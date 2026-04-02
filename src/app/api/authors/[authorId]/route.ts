import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ authorId: string }> }
) {
  const { authorId } = await params;
  const decodedAuthorId = decodeURIComponent(authorId);

  try {
    // In a real implementation, you would fetch this from your database
    // For now, return realistic author data based on common patterns
    
    // Check if this is one of our known authors
    const knownAuthors = {
      'Dr. Geoffrey Hinton': {
        affiliation: 'University of Toronto',
        email: 'geoffrey.hinton@utoronto.ca',
        paperCount: 6,
        totalCitations: 45230,
        hIndex: 89
      },
      'Dr. Yann LeCun': {
        affiliation: 'Meta AI',
        email: 'yann.lecun@meta.com',
        paperCount: 5,
        totalCitations: 67890,
        hIndex: 102
      },
      'Dr. Yoshua Bengio': {
        affiliation: 'University of Montreal',
        email: 'yoshua.bengio@umontreal.ca',
        paperCount: 7,
        totalCitations: 54321,
        hIndex: 95
      },
      'Dr. Andrej Karpathy': {
        affiliation: 'OpenAI',
        email: 'andrej.karpathy@openai.com',
        paperCount: 4,
        totalCitations: 23456,
        hIndex: 45
      },
      'Dr. Fei-Fei Li': {
        affiliation: 'Stanford University',
        email: 'feifei.li@stanford.edu',
        paperCount: 5,
        totalCitations: 34567,
        hIndex: 78
      },
      'Dr. Ian Goodfellow': {
        affiliation: 'Google DeepMind',
        email: 'ian.goodfellow@deepmind.com',
        paperCount: 6,
        totalCitations: 28901,
        hIndex: 56
      },
      'Dr. Demis Hassabis': {
        affiliation: 'Google DeepMind',
        email: 'demis.hassabis@deepmind.com',
        paperCount: 3,
        totalCitations: 39876,
        hIndex: 72
      },
      'Dr. Andrew Ng': {
        affiliation: 'Stanford University',
        email: 'andrew.ng@stanford.edu',
        paperCount: 7,
        totalCitations: 56789,
        hIndex: 87
      }
    };

    // Check if we have exact match
    if (decodedAuthorId in knownAuthors) {
      return NextResponse.json({
        name: decodedAuthorId,
        ...knownAuthors[decodedAuthorId as keyof typeof knownAuthors]
      });
    }

    // If no exact match, generate consistent data based on author name hash
    let affiliation = 'Stanford University';
    let email = decodedAuthorId.toLowerCase().replace(/\s+/g, '.') + '@stanford.edu';
    
    if (decodedAuthorId.includes('MIT') || decodedAuthorId.includes('Massachusetts')) {
      affiliation = 'Massachusetts Institute of Technology';
      email = decodedAuthorId.toLowerCase().replace(/\s+/g, '.') + '@mit.edu';
    } else if (decodedAuthorId.includes('Google') || decodedAuthorId.includes('DeepMind')) {
      affiliation = 'Google Research';
      email = decodedAuthorId.toLowerCase().replace(/\s+/g, '.') + '@google.com';
    } else if (decodedAuthorId.includes('OpenAI')) {
      affiliation = 'OpenAI';
      email = decodedAuthorId.toLowerCase().replace(/\s+/g, '.') + '@openai.com';
    } else if (decodedAuthorId.includes('Microsoft')) {
      affiliation = 'Microsoft Research';
      email = decodedAuthorId.toLowerCase().replace(/\s+/g, '.') + '@microsoft.com';
    } else if (decodedAuthorId.includes('Berkeley') || decodedAuthorId.includes('UCB')) {
      affiliation = 'University of California, Berkeley';
      email = decodedAuthorId.toLowerCase().replace(/\s+/g, '.') + '@berkeley.edu';
    } else if (decodedAuthorId.includes('CMU') || decodedAuthorId.includes('Carnegie')) {
      affiliation = 'Carnegie Mellon University';
      email = decodedAuthorId.toLowerCase().replace(/\s+/g, '.') + '@cmu.edu';
    }
    
    // Generate consistent stats based on author name hash (not random)
    const nameHash = decodedAuthorId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const paperCount = Math.max(3, (nameHash % 5) + 3); // 3-7 papers per author (matches papers API)
    const totalCitations = Math.max(100, paperCount * (50 + (nameHash % 100)));
    const hIndex = Math.max(1, Math.floor(Math.sqrt(paperCount * 0.8)));

    const authorData = {
      name: decodedAuthorId,
      affiliation: affiliation,
      email: email,
      paperCount: paperCount,
      totalCitations: totalCitations,
      hIndex: hIndex,
    };

    return NextResponse.json(authorData);
  } catch (error) {
    console.error('Error fetching author:', error);
    return NextResponse.json(
      { error: 'Failed to fetch author data' },
      { status: 500 }
    );
  }
}
