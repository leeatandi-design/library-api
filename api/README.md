# Library Management System - API

A NestJS backend powering the Library Management System.

## Schema Decisions

### Why Book references Genre rather than embedding it

Book references Genre via a `genreId` foreign key rather than embedding the genre name directly, because many books share one genre and genres are managed independently (renaming a genre should not require updating every book). User stores a `role` field using a Role enum so Postgres and TypeScript both reject any value other than PATRON or LIBRARIAN.

1. **Single Source of Truth**: Renaming or updating metadata on a Genre only requires updating a single record in the `Genre` table, avoiding updating hundreds of book records.
2. **Data Integrity & Consistency**: Foreign key constraints prevent typos, orphan records, or invalid genres from being created.
3. **Relational Querying**: Allows easy querying such as finding all books under a genre (`prisma.genre.findUnique({ where: { id }, include: { books: true } })`) and aggregating statistics.

### Prisma vs a Document Database

In a document database like MongoDB, related data such as genres or reviews are often embedded directly into book documents. In Prisma and relational PostgreSQL, relations are modeled explicitly with foreign keys and strict schemas. While relational modeling requires upfront schema definitions and migrations, it guarantees relational integrity, eliminates data redundancy, and provides type-safe joins.
