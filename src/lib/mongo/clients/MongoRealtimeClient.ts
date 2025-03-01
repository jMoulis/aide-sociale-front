import { io, Socket } from 'socket.io-client';
import { nanoid } from "nanoid";
import Cookies from 'js-cookie'
import { ENUM_COLLECTIONS, ENUM_SOCKET_EVENTS, FilterType, IDeleteResponse, IMongoRealtimeConfig, ISocketEventListenCollectionProps, IUpsertResponse } from '../interfaces';
import { COOKIE_SERVER_AUTH } from '@/lib/utils/auth/utils';
import { IUser } from '@/lib/interfaces/interfaces';
import { convertDates } from '@/lib/utils/utils';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}
interface IChangeStream<TData> {
  operationType: string;
  fullDocument: TData;
  documentKey: { _id: string }
}
class MongoRealtimeClient {
  private static instance: MongoRealtimeClient | null = null; // Singleton instance
  private baseURL!: string;
  private socket!: Socket;
  public error: string | null = null;

  private constructor() {
    // Private constructor to enforce singleton
  }

  // Initialize the MongoClient with configuration, only if it hasn't been initialized
  public static initialize(config: IMongoRealtimeConfig): MongoRealtimeClient {
    if (!MongoRealtimeClient.instance) {
      MongoRealtimeClient.instance = new MongoRealtimeClient();
      MongoRealtimeClient.instance.baseURL = config.baseURL;
      MongoRealtimeClient.instance.socket = io(config.baseURL);
    }
    return MongoRealtimeClient.instance;
  }

  private async request<T>(endpoint: string, options: RequestInit): Promise<ApiResponse<T>> {
    const sessionToken = Cookies.get('__session');
    try {
      const response = await fetch(`${this.baseURL}/${endpoint}`, {
        ...options, headers: {
          ...options.headers,
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
          [COOKIE_SERVER_AUTH]: `Bearer ${Cookies.get(COOKIE_SERVER_AUTH)}`,
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw JSON.stringify({ status: response.status, error: data.error });
      }
      const parsedPaylod = { ...data, data: convertDates(data.data) };
      return { ...parsedPaylod, error: null };
    } catch (error: any) {
      throw error;
    }
  }
  // Method to perform upsert
  async update<T>(collection: ENUM_COLLECTIONS, filter = {}, data: Record<string, Partial<T>> = {}, updateOptions = {}): Promise<ApiResponse<IUpsertResponse>> {
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

  async create<T>(collection: ENUM_COLLECTIONS, data: Partial<T> = {}, updateOptions = {}): Promise<ApiResponse<IUpsertResponse>> {
    return this.request<IUpsertResponse>(`upsert`, {
      method: 'POST',
      body: JSON.stringify({
        collection,
        data,
        updateOptions,
        filter: {}
      }),
    });
  }
  async updateMany<T>(collectionNameToUpdate: ENUM_COLLECTIONS, matchQuery: Record<string, any>, upsertQuery: Record<string, any>, upsertOptions?: Record<string, any>): Promise<ApiResponse<{ result: any, updatedDocs: T[] }>> {
    return this.request(`update-many`, {
      method: 'POST',
      body: JSON.stringify({
        collectionNameToUpdate,
        upsertQuery,
        matchQuery,
        upsertOptions
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

  async search<T = any>(collection: ENUM_COLLECTIONS, query: any[]): Promise<ApiResponse<T[]>> {
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
  async getConnectedMongoUser(queryField: Record<string, any>, options: Record<string, Record<string, number>>): Promise<ApiResponse<IUser>> {
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

  unsubcribe(subscriptionId: string) {
    if (this.socket) {
      this.socket.emit(ENUM_SOCKET_EVENTS.UNSUBSCRIBE, subscriptionId);
      this.socket.off(ENUM_SOCKET_EVENTS.DB_CHANGE);
    }
  }
  // Method to listen to real-time updates on a collection or document
  onSnapshotList<TData>(collection: ENUM_COLLECTIONS, filter: FilterType, callback: (data: TData[], change: IChangeStream<TData>) => void): () => void {
    const subscriptionId = nanoid();
    if (this.socket) {
      const params: ISocketEventListenCollectionProps = { collection, filter, subscriptionId, pipelineMatch: [] };
      this.socket.emit(ENUM_SOCKET_EVENTS.LISTEN_COLLECTION, params);
      this.socket.on(ENUM_SOCKET_EVENTS.DB_CHANGE, (data: TData[], change: IChangeStream<TData>) => {
        callback(data, change);
      });
      this.errorChangeStream();
    }
    return () => this.unsubcribe(subscriptionId)
  }
  onSnapshotDocument<TData>(collection: ENUM_COLLECTIONS, filter: FilterType, callback: (change: IChangeStream<TData>) => void): () => void {
    const subscriptionId = nanoid();
    if (this.socket) {
      this.socket.emit(ENUM_SOCKET_EVENTS.LISTEN_DOCUMENT, { collection, filter, subscriptionId });
      this.socket.on(ENUM_SOCKET_EVENTS.DB_CHANGE, (change: any) => {
        callback(change);
      });
    }
    this.errorChangeStream();
    return () => this.unsubcribe(subscriptionId)
  }
  errorChangeStream(): void {
    if (this.socket) {
      this.socket.on(ENUM_SOCKET_EVENTS.CHANGE_STREAM_ERROR, ({ message }: { message: string }) => {
        this.error = message;
      });
    }
  }
  getError(): string | null {
    return this.error;
  }
}

export default MongoRealtimeClient;
