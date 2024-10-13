import { setupDatabase, teardownDatabase, getBookDatabase } from '../database_access_real';
import { MongoClient } from 'mongodb';

describe('Database Access', () => {
  const uri = 'mongodb://localhost:27017/test_db'; // Use your actual database URI
  let client: MongoClient;

  beforeAll(async () => {
    await setupDatabase(uri);
    client = getBookDatabase().client; // Retrieve the MongoDB client for further checks
  });

  afterAll(async () => {
    await teardownDatabase();
  });

  test('should connect to the database and extract the database name', async () => {
    const dbName = getBookDatabase().databaseName; // Assuming `databaseName` is accessible
    expect(dbName).toBe('test_db'); // Ensure the correct database name is extracted
  });

  test('should perform basic operations on the database', async () => {
    const db = getBookDatabase();
    const collection = db.collection('books');

    // Insert a test book
    const testBook = { name: 'Test Book', author: 'Test Author', price: 10.99 };
    await collection.insertOne(testBook);

    // Find the inserted book
    const foundBook = await collection.findOne({ name: 'Test Book' });
    expect(foundBook).toBeTruthy();
    expect(foundBook.name).toBe(testBook.name);
    expect(foundBook.author).toBe(testBook.author);
  });
});
