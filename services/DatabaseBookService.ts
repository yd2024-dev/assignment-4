import { Book, BookID } from '../adapter/assignment-4';
import { getBookDatabase } from '../database_access';

export class DatabaseBookService {
  async getBookById(bookId: BookID): Promise<Book | null> {
    const db = getBookDatabase();
    const book = await db.collection('books').findOne({ _id: bookId });
    return book ? { ...book, id: book._id.toString() } : null;
  }

  async createOrUpdateBook(book: Book): Promise<BookID> {
    const db = getBookDatabase();
    await db.collection('books').updateOne(
      { _id: book.id },
      { $set: book },
      { upsert: true }
    );
    return book.id!;
  }
}
