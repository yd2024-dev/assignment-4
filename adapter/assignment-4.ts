export type BookID = string;

export interface Book {
  id?: BookID;
  name: string;
  author: string;
  description: string;
  price: number;
  image: string;
  stock?: number;
}

export interface Filter {
  from?: number;
  to?: number;
  name?: string;
  author?: string;
}

export interface WarehouseService {
  placeBooksOnShelf(bookId: BookID, numberOfBooks: number, shelfId: ShelfId): Promise<void>;
  findBookOnShelf(bookId: BookID): Promise<Array<{ shelfId: ShelfId; count: number }>>;
  fulfilOrder(orderId: OrderId, booksFulfilled: Array<{ bookId: BookID; shelfId: ShelfId; quantity: number }>): Promise<void>;
  listOrders(): Promise<Array<{ orderId: OrderId; books: Record<BookID, number> }>>;
}

export interface BookService {
  lookupBookById(bookId: BookID): Promise<Book | undefined>;
  listBooksWithStock(): Promise<BookWithStock[]>;
}

export interface BookWithStock extends Book {
  stock: number;
}

export type ShelfId = string;
export type OrderId = string;

// A mock in-memory storage for books and orders
const books: Book[] = [];
const shelves: Record<ShelfId, Record<BookID, number>> = {};
const orders: Array<{ orderId: OrderId; books: Record<BookID, number> }> = [];

// List books with filters
async function listBooks(filters?: Filter[]): Promise<Book[]> {
  let filteredBooks = [...books];

  if (filters) {
    filteredBooks = filteredBooks.filter(book => {
      return filters.some(filter => {
        const matchesPrice = (filter.from === undefined || book.price >= filter.from) &&
                             (filter.to === undefined || book.price <= filter.to);
        const matchesName = (filter.name === undefined || book.name.includes(filter.name));
        const matchesAuthor = (filter.author === undefined || book.author.includes(filter.author));
        return matchesPrice && matchesName && matchesAuthor;
      });
    });
  }

  return filteredBooks;
}

// Create or update book
async function createOrUpdateBook(book: Book): Promise<BookID> {
  const existingBookIndex = books.findIndex(b => b.id === book.id);
  if (existingBookIndex > -1) {
    books[existingBookIndex] = { ...books[existingBookIndex], ...book };
    return books[existingBookIndex].id!;
  } else {
    book.id = String(books.length + 1);
    books.push(book);
    return book.id;
  }
}

// Remove a book
async function removeBook(bookId: BookID): Promise<void> {
  const index = books.findIndex(b => b.id === bookId);
  if (index > -1) {
    books.splice(index, 1);
  }
}

// Lookup a book by ID
async function lookupBookById(bookId: BookID): Promise<Book | undefined> {
  return books.find(book => book.id === bookId);
}

// Place books on shelf
async function placeBooksOnShelf(bookId: BookID, numberOfBooks: number, shelfId: ShelfId): Promise<void> {
  const book = await lookupBookById(bookId);
  if (!book) throw new Error(`Book with ID ${bookId} not found`);
  
  book.stock = (book.stock || 0) + numberOfBooks;

  if (!shelves[shelfId]) {
    shelves[shelfId] = {};
  }
  shelves[shelfId][bookId] = (shelves[shelfId][bookId] || 0) + numberOfBooks;
}

// Find book on shelf
async function findBookOnShelf(bookId: BookID): Promise<Array<{ shelfId: ShelfId; count: number }>> {
  const locations: Array<{ shelfId: ShelfId; count: number }> = [];
  
  for (const shelfId in shelves) {
    if (shelves[shelfId][bookId]) {
      locations.push({ shelfId, count: shelves[shelfId][bookId] });
    }
  }
  
  return locations;
}

// Order books
async function orderBooks(order: BookID[]): Promise<{ orderId: OrderId }> {
  const orderId = `order_${orders.length + 1}`;
  const booksMap: Record<BookID, number> = {};

  for (const bookId of order) {
    if (!booksMap[bookId]) {
      booksMap[bookId] = 0;
    }
    booksMap[bookId]++;
  }

  orders.push({ orderId, books: booksMap });
  return { orderId };
}

// Fulfill an order
async function fulfilOrder(orderId: OrderId, booksFulfilled: Array<{ bookId: BookID; shelfId: ShelfId; quantity: number }>): Promise<void> {
  const orderIndex = orders.findIndex(o => o.orderId === orderId);
  if (orderIndex === -1) throw new Error(`Order with ID ${orderId} not found`);

  for (const { bookId, shelfId, quantity } of booksFulfilled) {
    const countOnShelf = shelves[shelfId]?.[bookId];
    if (!countOnShelf || countOnShelf < quantity) {
      throw new Error(`Not enough books on shelf ${shelfId} to fulfil the order for book ${bookId}`);
    }
    
    shelves[shelfId][bookId] -= quantity;
    if (shelves[shelfId][bookId] === 0) {
      delete shelves[shelfId][bookId];
    }
    
    const book = await lookupBookById(bookId);
    if (book) {
      book.stock! -= quantity;
    }
  }

  orders.splice(orderIndex, 1);
}

// List orders
async function listOrders(): Promise<Array<{ orderId: OrderId; books: Record<BookID, number> }>> {
  return orders;
}

// Adding a stock check and listing books with stock
async function listBooksWithStock(): Promise<BookWithStock[]> {
  return books.map(book => ({ ...book, stock: book.stock || 0 }));
}

// Export the main API
const assignment = 'assignment-4';

export default {
  assignment,
  createOrUpdateBook,
  removeBook,
  listBooks,
  placeBooksOnShelf,
  orderBooks,
  findBookOnShelf,
  fulfilOrder,
  listOrders,
  lookupBookById,
  listBooksWithStock,
};
