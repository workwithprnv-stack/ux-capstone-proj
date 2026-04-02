import { NextRequest, NextResponse } from 'next/server';
import { getPaperById, getForwardCitations, getBackwardCitations } from '@/lib/arxiv';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string[] }> }
) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id.join('/'));

  try {
    const paper = await getPaperById(decodedId);
    if (!paper) {
      return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
    }

    const [forward, backward] = await Promise.all([
      getForwardCitations(paper),
      getBackwardCitations(paper)
    ]);

    return NextResponse.json({
      paper,
      forward,
      backward
    });
  } catch (error) {
    console.error('Citation API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch citations' },
      { status: 500 }
    );
  }
}
