import { MongoClient } from 'mongodb'

const uri = process.env.MONGO_URI
if (!uri) throw new Error('❌ Missing MONGO_URI in environment variables')

const client = new MongoClient(uri)
let db

export async function connectToMongo() {
  if (db) return db // already connected
  try {
    await client.connect()
    db = client.db()
    console.log('✅ MongoDB connected')
    return db
  } catch (err) {
    console.error('❌ MongoDB connection error:', err)
    throw err
  }
}

export function getDb() {
  if (!db) throw new Error('❌ Database not connected. Call connectToMongo() first.')
  return db
}
