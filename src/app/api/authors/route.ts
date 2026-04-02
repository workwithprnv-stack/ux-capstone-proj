import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // In a real implementation, you would:
    // 1. Query your database for all authors
    // 2. Extract authors from papers in your database
    // For now, return realistic author data that matches the papers
    
    const mockAuthors = [
      { 
        name: 'Dr. Geoffrey Hinton', 
        affiliation: 'University of Toronto', 
        email: 'geoffrey.hinton@utoronto.ca' 
      },
      { 
        name: 'Dr. Yann LeCun', 
        affiliation: 'Meta AI', 
        email: 'yann.lecun@meta.com' 
      },
      { 
        name: 'Dr. Yoshua Bengio', 
        affiliation: 'University of Montreal', 
        email: 'yoshua.bengio@umontreal.ca' 
      },
      { 
        name: 'Dr. Andrej Karpathy', 
        affiliation: 'OpenAI', 
        email: 'andrej.karpathy@openai.com' 
      },
      { 
        name: 'Dr. Fei-Fei Li', 
        affiliation: 'Stanford University', 
        email: 'feifei.li@stanford.edu' 
      },
      { 
        name: 'Dr. Ian Goodfellow', 
        affiliation: 'Google DeepMind', 
        email: 'ian.goodfellow@deepmind.com' 
      },
      { 
        name: 'Dr. Demis Hassabis', 
        affiliation: 'Google DeepMind', 
        email: 'demis.hassabis@deepmind.com' 
      },
      { 
        name: 'Dr. Andrew Ng', 
        affiliation: 'Stanford University', 
        email: 'andrew.ng@stanford.edu' 
      },
    ];

    return NextResponse.json({ authors: mockAuthors });
  } catch (error) {
    console.error('Error fetching authors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch authors' },
      { status: 500 }
    );
  }
}
