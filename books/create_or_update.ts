import { z } from 'zod'; 
import { Book, BookID } from '../adapter/assignment-4';
import { bookCollection } from '../database_access';

const bookSchema = z.object({
  name: z.string(),
  author: z.string(),
  description: z.string(),
  price: z.number(),
  image: z.string(),
});

export async function createOrUpdateBook(book: Book): Promise<BookID> {
  const parsedBook = bookSchema.parse(book);
  const { id, ...bookData } = parsedBook;

  await bookCollection.updateOne(
    { _id: id },
    { $set: bookData },
    { upsert: true }
  );

  return id!;
}
