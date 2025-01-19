import MongoServerClient from './clients/MongoServerClient';

const clientMongoServer = MongoServerClient.initialize({
  baseURL: process.env.NEXT_PUBLIC_SERVER_API_URL!,
});

export default clientMongoServer;
