import mongoose from 'mongoose';

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // Use CachedConnection type for global.mongoose
  // eslint-disable-next-line no-var
  var mongoose: CachedConnection | undefined;
}

const cached: CachedConnection = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI as string)
      .then((mongooseInstance) => {
        console.log('✅ Database Connected');
        return mongooseInstance;
      })
      .catch((err) => {
        console.error('❌ Error connecting to MongoDB:', err);
        throw err; 
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
