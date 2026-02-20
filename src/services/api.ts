/**
 * Client HTTP centralizado para chamadas à API
 * Usa variáveis de ambiente para URLs seguras
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface ApiRequestOptions extends RequestInit {
  timeout?: number;
  params?: Record<string, string | number | boolean>;
}

/**
 * Cliente HTTP com timeout e tratamento de erros
 */
class ApiClient {
  private apiUrl: string;
  private defaultTimeout: number = 30000; // 30 segundos

  constructor(baseUrl: string = API_URL) {
    this.apiUrl = baseUrl;
  }

  /**
   * Constrói query string a partir de parâmetros
   */
  private buildQueryString(params?: Record<string, string | number | boolean>): string {
    if (!params || Object.keys(params).length === 0) {
      return '';
    }
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');
    return queryString ? `?${queryString}` : '';
  }

  /**
   * Faz uma requisição HTTP
   */
  private async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const queryString = this.buildQueryString(options.params);
    const url = `${this.apiUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}${queryString}`;
    const timeout = options.timeout || this.defaultTimeout;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Verificar se há conteúdo na resposta
      const contentType = response.headers.get('content-type');
      const contentLength = response.headers.get('content-length');
      
      // Se não houver conteúdo ou for vazio, retornar objeto vazio
      if (!contentType || !contentType.includes('application/json') || contentLength === '0') {
        return {} as T;
      }

      // Tentar fazer parse de JSON
      try {
        return await response.json();
      } catch {
        // Se falhar no parse, retornar objeto vazio
        return {} as T;
      }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('aborted')) {
        throw new Error('Requisição expirou (timeout)');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(
    endpoint: string,
    data?: unknown,
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// Exporta uma instância única do cliente
export const api = new ApiClient();

export default api;
