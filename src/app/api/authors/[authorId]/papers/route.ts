import { NextRequest, NextResponse } from 'next/server';
import { Paper } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ authorId: string }> }
) {
  const { authorId } = await params;
  const decodedAuthorId = decodeURIComponent(authorId);

  try {
    // In a real implementation, you would:
    // 1. Query your database for papers by this author
    // 2. Call arXiv API with author search parameter
    // For now, return realistic mock data with proper structure
    
    // First, get the author's paper count from the author API to ensure consistency
    const authorRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/authors/${encodeURIComponent(authorId)}`);
    let targetPaperCount = 5; // default
    
    if (authorRes.ok) {
      const authorData = await authorRes.json();
      targetPaperCount = authorData.paperCount || 5;
    }
    
    // Generate consistent papers based on author name hash
    const nameHash = decodedAuthorId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const paperCount = targetPaperCount;
    
    const basePapers = [
      {
        title: 'Deep Learning Approaches to Natural Language Understanding: A Comprehensive Survey',
        abstract: 'This paper presents a comprehensive survey of deep learning approaches in natural language processing. We analyze recent advances in transformer architectures, attention mechanisms, and their applications across various NLP tasks. Our survey covers machine translation, sentiment analysis, question answering, and text generation. We provide detailed comparisons of state-of-the-art models and discuss future research directions in the field.',
        categories: ['cs.CL', 'cs.AI', 'cs.LG'],
        coAuthors: ['Maria Garcia', 'James Wilson']
      },
      {
        title: 'Efficient Training of Large Language Models: Optimization Strategies and Best Practices',
        abstract: 'Large language models have revolutionized natural language processing, but their training remains computationally expensive. This paper presents novel optimization strategies that significantly reduce training costs while maintaining model performance. We introduce adaptive learning rate schedules, gradient compression techniques, and memory-efficient attention mechanisms. Our experiments on models ranging from 1B to 175B parameters show up to 40% reduction in training time without compromising accuracy.',
        categories: ['cs.LG', 'cs.AI', 'cs.DC'],
        coAuthors: ['Sarah Chen']
      },
      {
        title: 'Neural Architecture Search: Automated Design of Deep Neural Networks',
        abstract: 'Neural Architecture Search (NAS) has emerged as a powerful approach for automatically designing neural network architectures. This paper presents a comprehensive review of NAS methods, including reinforcement learning-based approaches, evolutionary algorithms, and gradient-based optimization. We analyze the computational efficiency, search space design, and performance of various NAS techniques. Our evaluation on benchmark datasets provides insights into the strengths and limitations of current NAS methods.',
        categories: ['cs.LG', 'cs.AI', 'cs.NE'],
        coAuthors: ['David Kumar', 'Lisa Anderson', 'Robert Taylor']
      },
      {
        title: 'Computer Vision with Transformers: A Modern Approach to Visual Recognition',
        abstract: 'Transformers have revolutionized natural language processing and are now making significant inroads in computer vision. This paper explores the application of transformer architectures to various vision tasks including image classification, object detection, and semantic segmentation. We propose novel attention mechanisms specifically designed for visual data and demonstrate state-of-the-art performance on multiple benchmark datasets.',
        categories: ['cs.CV', 'cs.LG', 'cs.AI'],
        coAuthors: ['Alex Johnson', 'Emma Davis']
      },
      {
        title: 'Reinforcement Learning for Complex Decision Making: Algorithms and Applications',
        abstract: 'Reinforcement learning has shown remarkable success in games and robotics, but applying it to complex real-world decision making remains challenging. This paper presents novel algorithms that address sample efficiency, exploration strategies, and safety constraints in RL. We demonstrate our methods on autonomous driving, robotics control, and game playing tasks, showing significant improvements over existing approaches.',
        categories: ['cs.AI', 'cs.LG', 'cs.RO'],
        coAuthors: ['Michael Brown', 'Sophie Wilson']
      },
      {
        title: 'Graph Neural Networks: Theory, Applications, and Future Directions',
        abstract: 'Graph neural networks have emerged as a powerful tool for learning from graph-structured data. This paper provides a comprehensive overview of GNN architectures, theoretical foundations, and applications across domains including social networks, molecular chemistry, and recommendation systems. We analyze the scalability, expressiveness, and generalization capabilities of different GNN variants.',
        categories: ['cs.SI', 'cs.LG', 'cs.DM'],
        coAuthors: ['Thomas Anderson', 'Jennifer Lee']
      },
      {
        title: 'Federated Learning: Privacy-Preserving Machine Learning at Scale',
        abstract: 'Federated learning enables training machine learning models across multiple decentralized devices while keeping data local. This paper presents novel algorithms for efficient federated learning, addressing challenges in communication efficiency, heterogeneity, and privacy. We propose adaptive aggregation strategies and demonstrate significant improvements in both accuracy and communication costs.',
        categories: ['cs.LG', 'cs.CR', 'cs.DC'],
        coAuthors: ['Christopher Martin', 'Amanda White']
      }
    ];

    // Select papers based on author name hash for consistency
    const mockPapers: Paper[] = basePapers.slice(0, paperCount).map((paper, index) => {
      const year = 2024 - index;
      const month = String((nameHash % 12) + 1).padStart(2, '0');
      const day = String((nameHash % 28) + 1).padStart(2, '0');
      const id = `arxiv.${year}.${month}.${String((nameHash + index) % 99999).padStart(5, '0')}`;
      
      // Calculate updated date properly (5 days after published, handle month overflow)
      let updatedDay = parseInt(day) + 5;
      let updatedMonth = parseInt(month);
      let updatedYear = year;
      
      if (updatedDay > 28) {
        // Handle different month lengths
        const daysInMonth = new Date(updatedYear, updatedMonth, 0).getDate();
        if (updatedDay > daysInMonth) {
          updatedDay = updatedDay - daysInMonth;
          updatedMonth += 1;
          if (updatedMonth > 12) {
            updatedMonth = 1;
            updatedYear += 1;
          }
        }
      }
      
      return {
        id: id,
        title: paper.title,
        abstract: paper.abstract,
        authors: [
          { 
            name: decodedAuthorId, 
            affiliation: decodedAuthorId.includes('MIT') ? 'MIT' : decodedAuthorId.includes('Google') ? 'Google Research' : decodedAuthorId.includes('OpenAI') ? 'OpenAI' : 'Stanford University',
            email: decodedAuthorId.toLowerCase().replace(/\s+/g, '.') + '@' + (decodedAuthorId.includes('MIT') ? 'mit.edu' : decodedAuthorId.includes('Google') ? 'google.com' : decodedAuthorId.includes('OpenAI') ? 'openai.com' : 'stanford.edu')
          },
          ...paper.coAuthors.map((coAuthor, i) => ({
            name: coAuthor,
            affiliation: ['MIT CSAIL', 'Google Research', 'OpenAI', 'Stanford University', 'CMU', 'Microsoft Research'][i % 6],
            email: coAuthor.toLowerCase().replace(/\s+/g, '.') + '@' + ['mit.edu', 'google.com', 'openai.com', 'stanford.edu', 'cmu.edu', 'microsoft.com'][i % 6]
          }))
        ],
        categories: paper.categories,
        published: `${year}-${month}-${day}T${String((nameHash % 24)).padStart(2, '0')}:${String((nameHash % 60)).padStart(2, '0')}:00Z`,
        updated: `${updatedYear}-${String(updatedMonth).padStart(2, '0')}-${String(updatedDay).padStart(2, '0')}T${String((nameHash + 1) % 24).padStart(2, '0')}:${String((nameHash + 1) % 60).padStart(2, '0')}:00Z`,
        pdfUrl: `/papers/${id}`,
        abstractUrl: `/papers/${id}`,
        doi: `10.48550/arXiv.${id.split('.')[1]}.${id.split('.')[2]}.${id.split('.')[3]}`,
        comment: index === 0 ? 'Accepted to NeurIPS 2024' : undefined
      };
    });

    return NextResponse.json({
      papers: mockPapers,
      total: mockPapers.length,
      hasMore: false
    });
  } catch (error) {
    console.error('Error fetching author papers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch author papers' },
      { status: 500 }
    );
  }
}
