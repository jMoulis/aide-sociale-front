export interface IAiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}