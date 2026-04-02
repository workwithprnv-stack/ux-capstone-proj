import { NextRequest, NextResponse } from 'next/server';
import { runBenchmarks } from '@/lib/benchmark';

export async function GET(request: NextRequest) {
  try {
    const results = await runBenchmarks();
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Benchmark API error:', error);
    return NextResponse.json(
      { error: 'Failed to run benchmarks' },
      { status: 500 }
    );
  }
}
