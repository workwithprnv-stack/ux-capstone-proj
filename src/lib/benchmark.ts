/**
 * arXiv API Benchmarking Script
 * Measures fetch and parse times for arXiv API integration.
 */

import { searchArxiv, getPaperById } from './arxiv';

export interface BenchmarkResult {
  name: string;
  query: string;
  results?: number;
  total?: number;
  time: number;
  error?: string;
}

async function benchmarkSearch(): Promise<BenchmarkResult[]> {
  const results: BenchmarkResult[] = [];
  const queries = ['machine learning', 'quantum computing', 'black holes'];
  
  for (const query of queries) {
    const start = performance.now();
    try {
      const result = await searchArxiv({ query, maxResults: 10 });
      const end = performance.now();
      results.push({
        name: 'searchArxiv',
        query,
        results: result.papers.length,
        total: result.totalResults,
        time: end - start
      });
    } catch (error) {
      results.push({
        name: 'searchArxiv',
        query,
        time: 0,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  return results;
}

async function benchmarkGetById(): Promise<BenchmarkResult[]> {
  const results: BenchmarkResult[] = [];
  const ids = ['2403.12345', 'hep-th/9901001', 'cond-mat/0101001'];
  
  for (const id of ids) {
    const start = performance.now();
    try {
      const paper = await getPaperById(id);
      const end = performance.now();
      results.push({
        name: 'getPaperById',
        query: id,
        results: paper ? 1 : 0,
        time: end - start
      });
    } catch (error) {
      results.push({
        name: 'getPaperById',
        query: id,
        time: 0,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  return results;
}

export async function runBenchmarks(): Promise<BenchmarkResult[]> {
  const searchResults = await benchmarkSearch();
  const idResults = await benchmarkGetById();
  return [...searchResults, ...idResults];
}
