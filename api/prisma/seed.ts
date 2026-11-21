import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = connectionString ? new Pool({ connectionString }) : undefined;
const adapter = pool ? new PrismaPg(pool) : undefined;
const prisma = adapter ? new PrismaClient({ adapter }) : new PrismaClient();

async function main() {
  await prisma.review.deleteMany();
  await prisma.book.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.user.deleteMany();

  const librarian = await prisma.user.create({
    data: {
      email: 'librarian@library.com',
      name: 'Amina Librarian',
      password: 'hashed-password-placeholder',
      role: Role.LIBRARIAN,
    },
  });

  const patron = await prisma.user.create({
    data: {
      email: 'patron@library.com',
      name: 'John Patron',
      password: 'hashed-password-placeholder',
      role: Role.PATRON,
    },
  });

  const fiction = await prisma.genre.create({ data: { name: 'Fiction' } });
  const science = await prisma.genre.create({ data: { name: 'Science' } });
  const history = await prisma.genre.create({ data: { name: 'History' } });
  const biography = await prisma.genre.create({ data: { name: 'Biography' } });

  const books = [
    { title: 'Things Fall Apart', author: 'Chinua Achebe', isbn: '978-0385667832', publishedYear: 1958, genreId: fiction.id },
    { title: 'The River Between', author: "Ngugi wa Thiong'o", isbn: '978-0435905484', publishedYear: 1965, genreId: fiction.id },
    { title: 'Purple Hibiscus', author: 'Chimamanda Ngozi Adichie', isbn: '978-0007200283', publishedYear: 2003, genreId: fiction.id },
    { title: '1984', author: 'George Orwell', isbn: '978-0451524935', publishedYear: 1949, genreId: fiction.id },
    { title: 'Half of a Yellow Sun', author: 'Chimamanda Ngozi Adichie', isbn: '978-0007200284', publishedYear: 2006, genreId: fiction.id },
    { title: 'A Brief History of Time', author: 'Stephen Hawking', isbn: '978-0553380163', publishedYear: 1988, genreId: science.id },
    { title: 'The Selfish Gene', author: 'Richard Dawkins', isbn: '978-0192860927', publishedYear: 1976, genreId: science.id },
    { title: 'Sapiens', author: 'Yuval Noah Harari', isbn: '978-0062316097', publishedYear: 2011, genreId: science.id },
    { title: 'The Double Helix', author: 'James Watson', isbn: '978-0689701815', publishedYear: 1968, genreId: science.id },
    { title: 'The Making of Modern Kenya', author: 'Bethwell Ogot', isbn: '978-9966250071', publishedYear: 1980, genreId: history.id },
    { title: 'A History of Africa', author: 'John Iliffe', isbn: '978-0521684113', publishedYear: 2007, genreId: history.id },
    { title: 'The Guns of August', author: 'Barbara Tuchman', isbn: '978-0345476098', publishedYear: 1962, genreId: history.id },
    { title: 'Postwar', author: 'Tony Judt', isbn: '978-0143037755', publishedYear: 2005, genreId: history.id },
    { title: 'Long Walk to Freedom', author: 'Nelson Mandela', isbn: '978-0316548182', publishedYear: 1994, genreId: biography.id },
    { title: 'Becoming', author: 'Michelle Obama', isbn: '978-1524763138', publishedYear: 2018, genreId: biography.id },
    { title: 'Steve Jobs', author: 'Walter Isaacson', isbn: '978-1451648539', publishedYear: 2011, genreId: biography.id },
  ];

  for (const book of books) {
    await prisma.book.create({ data: book });
  }

  const reviewedBook = await prisma.book.findUnique({
    where: { isbn: '978-0385667832' },
  });

  if (reviewedBook) {
    await prisma.review.create({
      data: {
        bookId: reviewedBook.id,
        userId: patron.id,
        rating: 5,
        comment: 'A true classic and an insightful masterpiece.',
      },
    });
  }

  console.log(`Seeded ${books.length} books across 4 genres, 2 users, and 1 review.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    if (pool) {
      await pool.end();
    }
  });
