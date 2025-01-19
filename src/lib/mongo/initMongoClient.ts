import MongoRealtimeClient from './clients/MongoRealtimeClient';

const client = MongoRealtimeClient.initialize({
  baseURL: process.env.NEXT_PUBLIC_SERVER_API_URL!,
});

export default client;
