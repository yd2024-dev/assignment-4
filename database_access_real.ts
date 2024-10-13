import { MongoClient } from 'mongodb';

let client: MongoClient;

// Function to extract the database name from the URI
function getDatabaseName(uri: string): string | null {
  const match = uri.match(/\/([^/?]*)$/);
  return match ? match[1] : null;
}

export async function setupDatabase(uri: string) {
  client = new MongoClient(uri);
  await client.connect();
  
  const dbName = getDatabaseName(uri);
  console.log(`Connected to real database: ${dbName}`);
}

export async function teardownDatabase() {
  if (client) {
    await client.close();
  }
}

export function getBookDatabase() {
  const uri = client.s.options.servers[0].host; // or adjust as necessary
  const dbName = getDatabaseName(uri) || 'test'; // Fallback to 'test' if extraction fails
  return client.db(dbName);
}
