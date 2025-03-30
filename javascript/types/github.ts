export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
}

export interface GithubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GithubRepo[];
}
