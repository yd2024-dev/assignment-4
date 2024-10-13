import { MongoClient, Db } from 'mongodb';
import { Book, BookID } from '../adapter/assignment-4';

export class DatabaseBookService {
  private db: Db;

  constructor(client: MongoClient) {
    this.db = client.db('your_database_name'); // Replace with your actual database name
  }

  async createOrUpdateBook(book: Book): Promise<BookID> {
    const collection = this.db.collection('books');
    const existingBook = await collection.findOne({ id: book.id });

    if (existingBook) {
      await collection.updateOne({ id: book.id }, { $set: book });
      return book.id!;
    } else {
      const result = await collection.insertOne(book);
      return result.insertedId.toString();
    }
  }

  async removeBook(bookId: BookID): Promise<void> {
    const collection = this.db.collection('books');
    await collection.deleteOne({ id: bookId });
  }

  async lookupBookById(bookId: BookID): Promise<Book | undefined> {
    const collection = this.db.collection('books');
    return collection.findOne({ id: bookId }) as Promise<Book | undefined>;
  }

  async listBooks(filters?: any): Promise<Book[]> {
    const collection = this.db.collection('books');
    const query: any = {};

    if (filters) {
      if (filters.from) {
        query.price = { ...query.price, $gte: filters.from };
      }
      if (filters.to) {
        query.price = { ...query.price, $lte: filters.to };
      }
      if (filters.name) {
        query.name = { $regex: filters.name, $options: 'i' };
      }
      if (filters.author) {
        query.author = { $regex: filters.author, $options: 'i' };
      }
    }

    return collection.find(query).toArray() as Promise<Book[]>;
  }
}
