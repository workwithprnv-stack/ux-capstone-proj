'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Paper } from '@/lib/types';

interface Node extends Paper {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: 'seed' | 'discovered';
  expanded?: boolean;
}

interface Edge {
  source: string;
  target: string;
  type: 'citation' | 'reference';
  strength: number;
}

interface CitationGraphProps {
  paper: Paper;
}

export default function CitationGraph({ paper }: CitationGraphProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(false);
  const [hoverNode, setHoverNode] = useState<Node | null>(null);
  
  const canvasRef = useRef<SVGSVGElement>(null);
  const requestRef = useRef<number>(undefined);
  const initialized = useRef(false);

  // Physics constants
  const REPULSION = 10000;
  const ATTRACTION = 0.015;
  const DAMPING = 0.82;

  // Minimalist monochrome palette with subtle tints
  const CATEGORY_COLORS: Record<string, string> = {
    'cs': '#ffffff',      // Pure white
    'math': '#cccccc',    // Light gray
    'physics': '#999999', // Medium gray
    'stat': '#666666',    // Dark gray
    'default': '#444444'  // Muted gray
  };

  const getNodeColor = (categories: string[]) => {
    if (!categories || categories.length === 0) return CATEGORY_COLORS.default;
    const prefix = categories[0].split('.')[0];
    return CATEGORY_COLORS[prefix] || CATEGORY_COLORS.default;
  };

  const calculateSimilarity = (p1: Paper, p2: Paper): number => {
    if (!p1.categories || !p2.categories) return 0.1;
    const commonCategories = p1.categories.filter(c => p2.categories.includes(c));
    return (commonCategories.length / Math.max(p1.categories.length, p2.categories.length)) || 0.1;
  };

  const updateSimulation = useCallback(() => {
    setNodes(prevNodes => {
      if (prevNodes.length <= 1) return prevNodes;
      const nextNodes = prevNodes.map(n => ({ ...n }));

      for (let i = 0; i < nextNodes.length; i++) {
        for (let j = i + 1; j < nextNodes.length; j++) {
          const n1 = nextNodes[i];
          const n2 = nextNodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const distSq = dx * dx + dy * dy || 1;
          const dist = Math.sqrt(distSq);
          
          if (dist < 600) {
            const force = REPULSION / distSq;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            n1.vx -= fx;
            n1.vy -= fy;
            n2.vx += fx;
            n2.vy += fy;
          }
        }
      }

      edges.forEach(edge => {
        const source = nextNodes.find(n => n.id === edge.source);
        const target = nextNodes.find(n => n.id === edge.target);
        if (!source || !target) return;

        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = dist * (ATTRACTION + edge.strength);
        
        source.vx += (dx / dist) * force;
        source.vy += (dy / dist) * force;
        target.vx -= (dx / dist) * force;
        target.vy -= (dy / dist) * force;
      });

      nextNodes.forEach(node => {
        const dx = 600 - node.x;
        const dy = 400 - node.y;
        node.vx += dx * 0.003;
        node.vy += dy * 0.003;

        node.x += node.vx;
        node.y += node.vy;
        node.vx *= DAMPING;
        node.vy *= DAMPING;

        node.x = Math.max(50, Math.min(1150, node.x));
        node.y = Math.max(50, Math.min(750, node.y));
      });

      return nextNodes;
    });

    requestRef.current = requestAnimationFrame(updateSimulation);
  }, [edges]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateSimulation);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [updateSimulation]);

  const expandNode = async (targetPaper: Node) => {
    if (targetPaper.expanded) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/papers/citations/${encodeURIComponent(targetPaper.id)}`);
      const data = await res.json();
      const discoveredPapers: Paper[] = [...data.forward, ...data.backward];
      
      setNodes(prev => {
        const existingIds = new Set(prev.map(n => n.id));
        const newPapers = discoveredPapers.filter(p => !existingIds.has(p.id));
        const newNodes: Node[] = newPapers.map(p => ({
          ...p,
          x: targetPaper.x + (Math.random() - 0.5) * 100,
          y: targetPaper.y + (Math.random() - 0.5) * 100,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10,
          radius: Math.max(5, Math.min(12, (p.citationCount || 0) / 15)),
          type: 'discovered',
          expanded: false
        }));
        return [...prev.map(n => n.id === targetPaper.id ? { ...n, expanded: true } : n), ...newNodes];
      });

      setEdges(prev => {
        const newEdges: Edge[] = [];
        data.forward.forEach((p: Paper) => newEdges.push({ source: p.id, target: targetPaper.id, type: 'citation', strength: 0.05 }));
        data.backward.forEach((p: Paper) => newEdges.push({ source: targetPaper.id, target: p.id, type: 'reference', strength: 0.03 }));
        const existingKeys = new Set(prev.map(e => `${e.source}-${e.target}`));
        return [...prev, ...newEdges.filter(e => !existingKeys.has(`${e.source}-${e.target}`))];
      });
    } catch (err) {
      console.error('Expansion error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialized.current && paper) {
      const seedNode: Node = { ...paper, x: 600, y: 400, vx: 0, vy: 0, radius: 10, type: 'seed', expanded: false };
      setNodes([seedNode]);
      initialized.current = true;
      expandNode(seedNode);
    }
  }, [paper]);

  const authorsText = (authors: any[]) => authors.map(a => a.name).join(', ');

  return (
    <div className="citation-graph-wrapper" style={{ 
      margin: '60px 0', 
      position: 'relative', 
      background: '#0a0a0a', 
      borderRadius: '24px', 
      padding: '40px',
      border: '1px solid #1a1a1a',
      fontFamily: 'Inter, sans-serif'
    }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .graph-node { transition: all 0.2s ease; cursor: pointer; }
        .grid-bg { background-image: radial-gradient(#1a1a1a 1px, transparent 1px); background-size: 40px 40px; }
        .monotype { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h3 className="monotype" style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
             Citation Universe
          </h3>
        </div>
        
        <div className="logo-island" style={{ height: '32px', padding: '0 12px', fontSize: '11px' }}>
          {loading ? 'CALCULATING FORCES...' : 'INTERACTIVE KNOWLEDGE GRAPH'}
        </div>
      </div>

      <div className="grid-bg" style={{ position: 'relative', height: '640px', width: '100%', overflow: 'hidden', borderRadius: '16px', border: '1px solid #1a1a1a' }}>
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 1200 800"
        >
          {/* Edges */}
          {edges.map((edge, i) => {
            const source = nodes.find(n => n.id === edge.source);
            const target = nodes.find(n => n.id === edge.target);
            if (!source || !target) return null;
            const isRelated = hoverNode?.id === source.id || hoverNode?.id === target.id;
            return (
              <line
                key={`edge-${i}`}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke={isRelated ? '#ffffff' : '#1a1a1a'}
                strokeWidth={isRelated ? 1 : 0.5}
                strokeOpacity={isRelated ? 0.8 : 0.3}
                style={{ transition: 'all 0.3s' }}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const isSeed = node.type === 'seed';
            const isHovered = hoverNode?.id === node.id;
            const color = getNodeColor(node.categories);

            return (
              <g 
                key={node.id} 
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => expandNode(node)}
                onMouseEnter={() => setHoverNode(node)}
                onMouseLeave={() => setHoverNode(null)}
                className="graph-node"
              >
                <circle
                  r={isHovered ? node.radius * 1.5 : node.radius}
                  fill={isSeed ? '#ffffff' : 'transparent'}
                  stroke={isSeed ? '#ffffff' : (node.expanded ? '#666' : '#222')}
                  strokeWidth="1.5"
                  fillOpacity={isSeed ? 1 : 0}
                  style={{ transition: 'all 0.3s' }}
                />
                
                {isHovered && (
                  <circle
                    r={node.radius + 10}
                    fill="#ffffff"
                    fillOpacity="0.05"
                    stroke="#ffffff"
                    strokeWidth="0.5"
                    strokeOpacity="0.2"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Popup - Minimal White Island */}
        {hoverNode && (
          <div className="monotype" style={{ 
            position: 'absolute', 
            top: '40px', 
            left: '40px', 
            width: '280px', 
            background: '#ffffff', 
            color: '#000000',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            zIndex: 100,
            pointerEvents: 'none'
          }}>
            <div style={{ fontSize: '10px', color: '#666', marginBottom: '8px' }}>
              {hoverNode.id.toUpperCase()}
            </div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '600', lineHeight: '1.4' }}>
              {hoverNode.title}
            </h4>
            <div style={{ fontSize: '11px', opacity: 0.8 }}>
              {authorsText(hoverNode.authors).slice(0, 50)}...
            </div>
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
              {hoverNode.categories.slice(0, 2).map(cat => (
                <span key={cat} style={{ fontSize: '9px', background: '#000', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>{cat}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="monotype" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', color: '#444', fontSize: '10px' }}>
        <div style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Interactive Topology • Clustered by similarity
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '1.5px', background: '#fff' }} /> Seed node
           </div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '1.5px', background: '#1a1a1a' }} /> Related discoveries
           </div>
        </div>
      </div>
    </div>
  );
}
