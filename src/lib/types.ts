// Core types for ResearchHub

export interface Paper {
  id: string;
  title: string;
  abstract: string;
  authors: Author[];
  categories: string[];
  published: string;
  updated: string;
  pdfUrl: string;
  abstractUrl: string;
  doi?: string;
  comment?: string;
  citationCount?: number;
  openAlexId?: string;
  referencedWorks?: string[];
}

export interface Author {
  name: string;
  affiliation?: string;
  email?: string;
}

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  bio: string;
  avatar_url: string;
  research_interests: string[];
  arxiv_author_id?: string;
  created_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  arxiv_id: string;
  title: string;
  authors: string;
  abstract: string;
  saved_at: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: string;
  member_count?: number;
  creator_name?: string;
}

export interface GroupMember {
  group_id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
  profile?: Profile;
}

export interface TopicSubscription {
  id: string;
  user_id: string;
  category: string;
  subscribed_at: string;
}

// arXiv category mapping
export const ARXIV_CATEGORIES: Record<string, string> = {
  'cs.AI': 'Artificial Intelligence',
  'cs.CL': 'Computation & Language',
  'cs.CV': 'Computer Vision',
  'cs.LG': 'Machine Learning',
  'cs.NE': 'Neural & Evolutionary Computing',
  'cs.RO': 'Robotics',
  'cs.SE': 'Software Engineering',
  'cs.DS': 'Data Structures & Algorithms',
  'cs.CR': 'Cryptography & Security',
  'cs.DB': 'Databases',
  'cs.DC': 'Distributed Computing',
  'cs.HC': 'Human-Computer Interaction',
  'cs.IR': 'Information Retrieval',
  'cs.IT': 'Information Theory',
  'cs.MA': 'Multiagent Systems',
  'cs.PL': 'Programming Languages',
  'stat.ML': 'Machine Learning (Stats)',
  'stat.AP': 'Applications',
  'stat.CO': 'Computation',
  'stat.ME': 'Methodology',
  'math.OC': 'Optimization & Control',
  'math.ST': 'Statistics Theory',
  'physics.comp-ph': 'Computational Physics',
  'q-bio.BM': 'Biomolecules',
  'q-bio.GN': 'Genomics',
  'q-bio.NC': 'Neurons & Cognition',
  'econ.EM': 'Econometrics',
  'eess.SP': 'Signal Processing',
  'eess.IV': 'Image & Video Processing',
};
