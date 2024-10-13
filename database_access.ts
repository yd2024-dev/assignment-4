//import { MongoClient } from 'mongodb'
// We are importing the book type here, so we can keep our types consistent with the front end
//import { type Book } from './adapter/assignment-3'

// This is the connection string for the mongo database in our docker compose file
const uri = "mongodb://mongo";

// We're setting up a client, opening the database for our project, and then opening
// a typed collection for our books.
//export const client = new MongoClient(uri)
//export const database = client.db('mcmasterful-books')
//export const bookCollection = database.collection<Book>('books')
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/test'; // Default to 'test' if no URI is provided
const client = new MongoClient(uri);

export async function setupDatabase() {
  await client.connect();
}

export async function teardownDatabase() {
  await client.close();
}

export function getBookDatabase() {
  return client.db('test'); // Use the database name you prefer
}
