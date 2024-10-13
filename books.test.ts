import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupDatabase, teardownDatabase, getBookDatabase } from './database_access';
import { listBooks } from './adapter/assignment-4';

describe('Book API Tests', () => {
  let database;

  beforeAll(async () => {
    await setupDatabase();
    database = getBookDatabase();
  });

  afterAll(async () => {
    await teardownDatabase();
  });

  it('should list books', async () => {
    const booksCollection = database.collection('books');
    await booksCollection.insertMany([
      { name: 'Book 1', author: 'Author A', price: 10, description: '', image: '' },
      { name: 'Book 2', author: 'Author B', price: 20, description: '', image: '' },
    ]);

    const books = await listBooks([], database);
    expect(books.length).toBe(2);
    expect(books[0].name).toBe('Book 1');
    expect(books[1].name).toBe('Book 2');
  });
});
