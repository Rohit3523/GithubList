import axios, { AxiosResponse } from 'axios';
import { GithubSearchResponse } from '../types/github';
import { GithubContributor } from '../types/contributor';

const instance = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => status < 500
});

export async function searchRepositories(query: string, page = 1, resultPerPage = 10): Promise<AxiosResponse<GithubSearchResponse>> {
  const response = await instance.get('/search/repositories', {
    params: {
      q: query,
      page,
      per_page: resultPerPage,
    },
  });
  
  return response;
}

export async function getRepositoryContributors(owner: string, repo: string, page = 1, perPage = 10): Promise<AxiosResponse<GithubContributor[]>> {
  const response = await instance.get(`/repos/${owner}/${repo}/contributors`, {
    params: {
      page,
      per_page: perPage,
    },
  });
  
  return response;
}