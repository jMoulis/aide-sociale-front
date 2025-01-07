'use server';

import { FilterType, IMongoRealtimeConfig, IUpsertResponse, ENUM_COLLECTIONS, IDeleteResponse } from '../interfaces';
import { cookies } from 'next/headers';
import { COOKIE_SERVER_AUTH } from '@/lib/utils/auth/utils';
import { IUser } from '@/lib/interfaces/interfaces';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

class MongoServerClient {
  private static instance: MongoServerClient | null = null; // Singleton instance
  private baseURL!: string;
  public error: string | null = null;

  private constructor() {

    // Private constructor to enforce singleton
  }

  // Initialize the MongoClient with configuration, only if it hasn't been initialized
  public static initialize(config: IMongoRealtimeConfig): MongoServerClient {
    if (!MongoServerClient.instance) {
      MongoServerClient.instance = new MongoServerClient();
      MongoServerClient.instance.baseURL = config.baseURL;
    }
    return MongoServerClient.instance;
  }

  private async request<T>(endpoint: 'update-many' | 'list' | 'get' | 'subscribe-changes' | 'upsert' | 'search' | string, options: RequestInit, webhookToken?: string | null): Promise<ApiResponse<T>> {
    try {
      const serverToken = (await cookies()).get(COOKIE_SERVER_AUTH);

      if (!serverToken && !webhookToken) throw new Error('Server token is required');

      const response = await fetch(`${this.baseURL}/${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          [COOKIE_SERVER_AUTH]: `Bearer ${serverToken?.value || webhookToken}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || response.statusText);
      }
      return { ...data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }
  // No right check
  private async serverRequest<T>(endpoint: 'get-server' | 'upsert-server', options: RequestInit): Promise<ApiResponse<T>> {
    try {
      const serverToken = (await cookies()).get(COOKIE_SERVER_AUTH);
      if (!serverToken) throw new Error('Server token is required');

      const response = await fetch(`${this.baseURL}/${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          [COOKIE_SERVER_AUTH]: `Bearer ${serverToken.value}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || response.statusText);
      }
      return { ...data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }
  // Method to perform upsert
  async update(collection: ENUM_COLLECTIONS, filter: Record<string, any>, data = {}, updateOptions = {}): Promise<ApiResponse<IUpsertResponse>> {
    return this.request<IUpsertResponse>(`upsert`, {
      method: 'POST',
      body: JSON.stringify({
        collection,
        data,
        updateOptions,
        filter
      }),
    });
  }
  async create(collection: ENUM_COLLECTIONS, filter: Record<string, any>, data = {}, updateOptions = {}): Promise<ApiResponse<IUpsertResponse>> {
    return this.request<IUpsertResponse>(`upsert`, {
      method: 'POST',
      body: JSON.stringify({
        collection,
        data,
        updateOptions,
        filter
      }),
    });
  }

  async upsertServer(collection: ENUM_COLLECTIONS, filter: Record<string, any>, data = {}, updateOptions = {}): Promise<ApiResponse<IUpsertResponse>> {
    return this.serverRequest<IUpsertResponse>(`upsert-server`, {
      method: 'POST',
      body: JSON.stringify({
        collection,
        data,
        updateOptions,
        filter
      }),
    });
  }

  // Method to get a document by filter
  async get<T>(collection: ENUM_COLLECTIONS, queryField: FilterType, options: any = {}): Promise<ApiResponse<T>> {
    return this.request('get', {
      method: 'POST',
      body: JSON.stringify({ collection, queryField, options }),
    });
  }
  async getServer<T>(collection: ENUM_COLLECTIONS, queryField: FilterType, options: any = {}): Promise<ApiResponse<T>> {
    return this.serverRequest('get-server', {
      method: 'POST',
      body: JSON.stringify({ collection, queryField, options }),
    });
  }
  async deleteClerkWebhook(collection: ENUM_COLLECTIONS, userId: string): Promise<ApiResponse<unknown>> {
    await fetch(`${this.baseURL}/delete-clerk-webhook`, {
      method: 'POST',
      body: JSON.stringify({ collectionName: collection, userId }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return this.request('delete-clerk-webhook', {

    });
  }

  async getById<T>(collection: ENUM_COLLECTIONS, id: string, filter: FilterType): Promise<ApiResponse<T>> {
    const preparedFilter = {
      ...filter,
      _id: id,
    }
    return this.request(`get`, {
      method: 'POST',
      body: JSON.stringify({
        collection,
        queryField: preparedFilter
      }),
    });
  }

  async search<T = any>(collection: ENUM_COLLECTIONS, query: any[]): Promise<ApiResponse<T>> {
    return this.request(`search`, {
      method: 'POST',
      body: JSON.stringify({ collection, query }),
    });
  }
  // Method to list all documents in a collection with an optional filter

  async list<T>(collection: ENUM_COLLECTIONS, filter: FilterType = {}, requestOptions?: RequestInit): Promise<ApiResponse<T[]>> {

    return this.request(`list`, {
      method: 'POST',
      body: JSON.stringify({ collection, filter }),
      ...requestOptions,
    });
  }
  // Method to delete a document by ID
  async delete(collection: ENUM_COLLECTIONS, id: string): Promise<ApiResponse<IDeleteResponse>> {
    return this.request(`delete/${id}?collection=${collection}`, {
      method: 'DELETE',
    });
  }
  async updateMany<T>(collectionNameToUpdate: ENUM_COLLECTIONS, matchQuery: Record<string, any>, upsertQuery: Record<string, any>, upsertOptions?: Record<string, any>, webhookToken?: string | null): Promise<ApiResponse<{ result: any, updatedDocs: T[] }>> {
    return this.request(`update-many`, {
      method: 'POST',
      body: JSON.stringify({
        collectionNameToUpdate,
        upsertQuery,
        matchQuery,
        upsertOptions
      }),
    }, webhookToken);
  }
  async getConnectedMongoUser(queryField: Record<string, any>, options?: Record<string, Record<string, number>>): Promise<ApiResponse<IUser>> {
    const mongoUser = await this.get<IUser>(ENUM_COLLECTIONS.USERS, queryField, options);
    return mongoUser;
  }

  async subscribe(collection: ENUM_COLLECTIONS, filter: FilterType, webhookEndPoint: string): Promise<ApiResponse<unknown>> {
    return this.request(`subscribe-changes`, {
      method: 'POST',
      body: JSON.stringify({
        collection,
        filter,
        webhookEndPoint
      }),
    });
  }

  getError(): string | null {
    return this.error;
  }
}

export default MongoServerClient;

