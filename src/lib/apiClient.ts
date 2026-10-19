import { ApiResponse, QueryParams, PaginatedResult } from '../types/api';

class ApiClient {
  private tenantId: string | null = null;
  private authToken: string | null = null;

  public setTenantId(id: string) {
    this.tenantId = id;
  }

  public setAuthToken(token: string | null) {
    this.authToken = token;
  }

  public getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Eduvora-Platform': 'SaaS-Enterprise-V2',
    };
    if (this.tenantId) {
      headers['X-Tenant-ID'] = this.tenantId;
    }
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    return headers;
  }

  /**
   * Simulated asynchronous request wrapper supporting multi-tenant isolation
   */
  public async mockRequest<T>(data: T, delayMs: number = 300): Promise<ApiResponse<T>> {
    await new Promise((resolve) => setTimeout(resolve, delayMs));

    return {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        tenantId: this.tenantId || 'global_system',
      },
    };
  }

  /**
   * Helper to paginate array data in memory for foundation mock endpoints
   */
  public paginate<T>(items: T[], params?: QueryParams): PaginatedResult<T> {
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    let filtered = [...items];

    if (params?.search) {
      const query = params.search.toLowerCase();
      filtered = filtered.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(query)
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const start = (page - 1) * pageSize;
    const paginatedItems = filtered.slice(start, start + pageSize);

    return {
      items: paginatedItems,
      total,
      page,
      pageSize,
      totalPages,
    };
  }
}

export const apiClient = new ApiClient();
