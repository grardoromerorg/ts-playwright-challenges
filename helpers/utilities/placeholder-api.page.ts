import { type APIRequestContext } from '@playwright/test';

export class PlaceholderApi {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async getResource(path: string) {
    return this.request.get(path);
  }

  async createResource(path: string, data: Record<string, unknown>) {
    return this.request.post(path, { data });
  }
}
