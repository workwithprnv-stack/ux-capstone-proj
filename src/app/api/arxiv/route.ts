import { NextRequest } from 'next/server';
import { searchArxiv, getPaperById } from '@/lib/arxiv';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') || '';
  const category = searchParams.get('category') || '';
  const author = searchParams.get('author') || '';
  const start = parseInt(searchParams.get('start') || '0', 10);
  const maxResults = parseInt(searchParams.get('maxResults') || '10', 10);
  const sortBy = (searchParams.get('sortBy') as 'relevance' | 'lastUpdatedDate' | 'submittedDate') || 'relevance';
  const id = searchParams.get('id');

  try {
    if (id) {
      const paper = await getPaperById(id);
      if (!paper) {
        return Response.json({ error: 'Paper not found' }, { status: 404 });
      }
      return Response.json({ paper });
    }

    const result = await searchArxiv({
      query: query || undefined,
      category: category || undefined,
      author: author || undefined,
      start,
      maxResults,
      sortBy,
      sortOrder: 'descending',
    });

    return Response.json(result);
  } catch (error) {
    console.error('arXiv API error:', error);
    return Response.json(
      { error: 'Failed to fetch from arXiv' },
      { status: 500 }
    );
  }
}
