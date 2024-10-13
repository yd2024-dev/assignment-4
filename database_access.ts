//import { MongoClient } from 'mongodb'
// We are importing the book type here, so we can keep our types consistent with the front end
//import { type Book } from './adapter/assignment-3'

// This is the connection string for the mongo database in our docker compose file
const uri = 'mongodb://mongo'

// We're setting up a client, opening the database for our project, and then opening
// a typed collection for our books.
//export const client = new MongoClient(uri)
//export const database = client.db('mcmasterful-books')
//export const bookCollection = database.collection<Book>('books')
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';

let mongoServer: MongoMemoryServer;
let client: MongoClient;

// Function to extract the database name from the URI
function getDatabaseName(uri: string): string | null {
  const match = uri.match(/\/([^/?]*)$/);
  return match ? match[1] : null;
}

export async function setupDatabase() {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  client = new MongoClient(uri);
  await client.connect();
  
  const dbName = getDatabaseName(uri);
  console.log(`Connected to in-memory database: ${dbName}`);
}

export async function teardownDatabase() {
  if (client) {
    await client.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
}

export function getBookDatabase() {
  const uri = mongoServer.getUri();
  const dbName = getDatabaseName(uri) || 'test'; // Fallback to 'test' if extraction fails
  return client.db(dbName);
}
