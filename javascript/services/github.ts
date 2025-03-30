import { GithubSearchResponse } from '../types/github';

const BASE_URL = 'https://api.github.com';

export const searchRepositories = async (query: string): Promise<GithubSearchResponse> => {
  if (!query.trim()) {
    return { total_count: 0, incomplete_results: false, items: [] };
  }
  
  try {
    const response = await fetch(`${BASE_URL}/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc`);
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching repositories:', error);
    throw error;
  }
};
