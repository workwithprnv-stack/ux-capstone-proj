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
  const REPULSION = 8000; // Massively increased spacing
  const ATTRACTION = 0.01; // Weaker attraction to allow spreading
  const TOPIC_BONUS = 0.15;
  const DAMPING = 0.85;

  // Category Color Palette (More vibrant and distinct)
  const CATEGORY_COLORS: Record<string, string> = {
    'cs': '#6366f1',      // Computer Science - Indigo (Vibrant)
    'math': '#f59e0b',    // Math - Amber
    'physics': '#10b981', // Physics - Emerald
    'stat': '#ef4444',    // stats - Strong Red
    'q-bio': '#3b82f6',   // Bio - Bright Blue
    'q-fin': '#8b5cf6',   // Fin - Bright Purple
    'eess': '#ec4899',    // Electrical Eng - Pink
    'econ': '#14b8a6',    // Economics - Teal
    'default': '#9ca3af'  // Others - Gray
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

  const updateSimulation = useCallback((time?: number) => {
    setNodes(prevNodes => {
      if (prevNodes.length <= 1) return prevNodes;

      const nextNodes = prevNodes.map(n => ({ ...n }));

      // 1. Repulsion between all nodes
      for (let i = 0; i < nextNodes.length; i++) {
        for (let j = i + 1; j < nextNodes.length; j++) {
          const n1 = nextNodes[i];
          const n2 = nextNodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const distSq = dx * dx + dy * dy || 1;
          const dist = Math.sqrt(distSq);
          
          if (dist < 800) { // Much larger repulsion range
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

      // 2. Attraction along edges (citations/references)
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

      // 3. Apply velocity and damping
      nextNodes.forEach(node => {
        // Center-pull force (Viewport is now 1200x800)
        const dx = 600 - node.x;
        const dy = 400 - node.y;
        node.vx += dx * 0.002;
        node.vy += dy * 0.002;

        node.x += node.vx;
        node.y += node.vy;
        node.vx *= DAMPING;
        node.vy *= DAMPING;

        // Boundary constraints (Expanded bounds)
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
      if (!res.ok) throw new Error('Failed to fetch citations');
      const data = await res.json();
      
      const discoveredPapers: Paper[] = [...data.forward, ...data.backward];
      
      setNodes(prev => {
        const existingIds = new Set(prev.map(n => n.id));
        const newPapers = discoveredPapers.filter(p => !existingIds.has(p.id));
        
        const newNodes: Node[] = newPapers.map(p => ({
          ...p,
          x: targetPaper.x + (Math.random() - 0.5) * 200,
          y: targetPaper.y + (Math.random() - 0.5) * 200,
          vx: (Math.random() - 0.5) * 20,
          vy: (Math.random() - 0.5) * 20,
          radius: Math.max(6, Math.min(18, (p.citationCount || 0) / 12)),
          type: 'discovered',
          expanded: false
        }));

        return [...prev.map(n => n.id === targetPaper.id ? { ...n, expanded: true } : n), ...newNodes];
      });

      setEdges(prev => {
        const newEdges: Edge[] = [];
        data.forward.forEach((p: Paper) => {
          const strength = calculateSimilarity(p, targetPaper) * TOPIC_BONUS;
          newEdges.push({ source: p.id, target: targetPaper.id, type: 'citation', strength });
        });
        data.backward.forEach((p: Paper) => {
          const strength = calculateSimilarity(p, targetPaper) * TOPIC_BONUS;
          newEdges.push({ source: targetPaper.id, target: p.id, type: 'reference', strength });
        });
        
        const existingKeys = new Set(prev.map(e => `${e.source}-${e.target}`));
        const filteredNew = newEdges.filter(e => !existingKeys.has(`${e.source}-${e.target}`));
        
        return [...prev, ...filteredNew];
      });
    } catch (err) {
      console.error('Expansion error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialized.current && paper) {
      const seedNode: Node = {
        ...paper,
        x: 600,
        y: 400,
        vx: 0,
        vy: 0,
        radius: 14,
        type: 'seed',
        expanded: false
      };
      setNodes([seedNode]);
      initialized.current = true;
      expandNode(seedNode);
    }
  }, [paper]);

  const authorsText = (authors: any[]) => authors.map(a => a.name).join(', ');

  // Get active categories for legend
  const activeCategories = Array.from(new Set(nodes.map(n => n.categories?.[0]?.split('.')[0] || 'default')));

  return (
    <div className="obsidian-graph-wrapper" style={{ 
      margin: 'var(--space-2xl) 0', 
      position: 'relative', 
      background: 'rgba(5, 5, 10, 0.98)', 
      borderRadius: 'var(--radius-lg)', 
      border: '1px solid #111', 
      padding: 'var(--space-lg)',
      boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
    }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .graph-node { transition: r 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .graph-node:hover { filter: drop-shadow(0 0 12px currentColor); }
        .grid-bg { background-image: radial-gradient(#222 1px, transparent 1px); background-size: 30px 30px; }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <div>
          <h3 style={{ fontSize: '0.875rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0, fontWeight: 700 }}>
             Multi-Category Knowledge Graph
          </h3>
          <p style={{ fontSize: '0.75rem', color: '#444', margin: '6px 0 0 0' }}>
            Directed edges: <span style={{ color: '#818cf8', fontWeight: 600 }}>Blue arrows cite central paper</span> | <span style={{ color: '#666', fontWeight: 600 }}>Gray arrows are references</span>
          </p>
        </div>
        
        {/* Dynamic Category Legend */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', maxWidth: '400px', justifyContent: 'flex-end' }}>
          {activeCategories.map(cat => (
            <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: CATEGORY_COLORS[cat] || CATEGORY_COLORS.default }} />
              <span style={{ fontSize: '0.625rem', color: '#666', textTransform: 'uppercase' }}>{cat}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-bg" style={{ position: 'relative', height: '600px', width: '100%', overflow: 'hidden', borderRadius: 'var(--radius-md)', border: '1px solid #1a1a1a' }}>
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 1200 800"
          style={{ cursor: 'crosshair' }}
        >
          <defs>
            <marker id="arrow-forward" viewBox="0 0 10 10" refX="25" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#818cf8" fillOpacity="0.8" />
            </marker>
            <marker id="arrow-backward" viewBox="0 0 10 10" refX="25" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#444" fillOpacity="0.8" />
            </marker>
          </defs>

          {/* Edges */}
          {edges.map((edge, i) => {
            const source = nodes.find(n => n.id === edge.source);
            const target = nodes.find(n => n.id === edge.target);
            if (!source || !target) return null;

            const isRelated = hoverNode?.id === source.id || hoverNode?.id === target.id;
            const isForward = edge.type === 'citation';

            return (
              <line
                key={`edge-${i}`}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke={isRelated ? 'var(--accent-primary)' : isForward ? '#312e81' : '#1f2937'}
                strokeWidth={isRelated ? 1.5 : 1}
                strokeDasharray={isForward ? 'none' : '4 2'}
                strokeOpacity={isRelated ? 1 : 0.4}
                markerEnd={isForward ? 'url(#arrow-forward)' : 'url(#arrow-backward)'}
                style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const nodeColor = getNodeColor(node.categories);
            const isSeed = node.type === 'seed';
            const isHovered = hoverNode?.id === node.id;

            return (
              <g 
                key={node.id} 
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => expandNode(node)}
                onMouseEnter={() => setHoverNode(node)}
                onMouseLeave={() => setHoverNode(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Glow Effect */}
                <circle
                  r={node.radius + 4}
                  fill={nodeColor}
                  fillOpacity={isHovered ? 0.3 : 0}
                  style={{ transition: 'fill-opacity 0.3s' }}
                />
                
                <circle
                  className="graph-node"
                  r={isHovered ? node.radius * 1.1 : node.radius}
                  fill={isSeed ? '#fff' : nodeColor}
                  fillOpacity={node.expanded ? 0.9 : 0.4}
                  stroke={isHovered ? '#fff' : isSeed ? '#fff' : nodeColor}
                  strokeWidth={isSeed ? 3 : 1.5}
                  color={nodeColor}
                  style={{ transition: 'fill 0.3s, stroke 0.3s, r 0.3s' }}
                />

                {/* Seed Indicator */}
                {isSeed && (
                  <circle
                    r={node.radius + 6}
                    fill="none"
                    stroke="#fff"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    style={{ animation: 'spin 10s linear infinite' }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Popup - Obsidian Card Style */}
        {hoverNode && (
          <div style={{ 
            position: 'absolute', 
            top: '20px', 
            left: '20px', 
            width: '320px', 
            background: 'rgba(10, 10, 15, 0.9)', 
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            zIndex: 100,
            pointerEvents: 'none',
            animation: 'fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) both',
            borderLeft: `4px solid ${getNodeColor(hoverNode.categories)}`
          }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: '#fff', fontWeight: '700', lineHeight: '1.4' }}>
              {hoverNode.title}
            </h4>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.75rem', color: '#666' }}>Year:</span>
                <span style={{ fontSize: '0.75rem', color: '#fff', fontWeight: '600' }}>{new Date(hoverNode.published).getFullYear()}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.75rem', color: '#666' }}>Citations:</span>
                <span style={{ fontSize: '0.75rem', color: '#fff', fontWeight: '600' }}>{hoverNode.citationCount || 0}</span>
              </div>
            </div>

            <div style={{ marginBottom: '16px', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.625rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Authors:</span>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: '#aaa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {authorsText(hoverNode.authors)}
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {hoverNode.categories.map(cat => (
                <span key={cat} style={{ fontSize: '0.625rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: '#888', border: '1px solid rgba(255,255,255,0.05)' }}>{cat}</span>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'rgba(0,0,0,0.5)', padding: '8px 16px', borderRadius: '20px', color: '#fff', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <div style={{ width: '12px', height: '12px', border: '2px solid #333', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
             Expanding Universe...
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-md)', padding: '0 10px' }}>
        <div style={{ fontSize: '0.625rem', color: '#444', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Interactive Force Simulation • Topologically Clustered
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.625rem', color: '#555' }}>
              <div style={{ width: '8px', height: '2px', background: '#312e81' }} /> Incoming Citation
           </div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.625rem', color: '#555' }}>
              <div style={{ width: '8px', height: '2px', background: '#1f2937', borderBottom: '1px dashed #333' }} /> Outgoing Reference
           </div>
        </div>
      </div>
    </div>
  );
}
