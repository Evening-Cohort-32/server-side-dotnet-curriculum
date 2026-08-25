# SQL Cheatsheet

A quick syntax reference for the SQL you'll write in this book — PostgreSQL specifically, though almost all of this transfers directly to other relational databases. Before diving in, it helps to know the order a query actually executes in, see [SQL - Order of Operations](./resource-02-sql-order-of-operations.md).

## SELECT

```sql
SELECT * FROM Genre;                 -- every column
SELECT Name FROM Genre;              -- just one column
SELECT Name, Id FROM Genre;          -- specific columns
SELECT DISTINCT Name FROM Genre;     -- no duplicate values
```

## WHERE

```sql
SELECT * FROM Artist WHERE YearEstablished > 1970;
SELECT * FROM Artist WHERE YearEstablished > 1970 AND ArtistName = 'Rush';
SELECT * FROM Artist WHERE YearEstablished > 1970 OR ArtistName = 'Rush';
SELECT * FROM Song WHERE GenreId IS NULL;       -- no value
SELECT * FROM Song WHERE GenreId IS NOT NULL;
```

## ORDER BY / LIMIT

```sql
SELECT * FROM Artist ORDER BY ArtistName;          -- ascending (default)
SELECT * FROM Artist ORDER BY ArtistName DESC;      -- descending
SELECT * FROM Artist ORDER BY ArtistName LIMIT 5;   -- top 5 only
```

## JOIN

```sql
-- INNER JOIN: only rows that match in both tables
SELECT s.Title, a.ArtistName
FROM Song s
JOIN Artist a ON s.ArtistId = a.Id;

-- LEFT JOIN: every row from the left table, matched data if it exists (NULL if not)
SELECT a.Title, s.Title
FROM Album a
LEFT JOIN Song s ON s.AlbumId = a.Id;
```

Direction matters — `FROM Album LEFT JOIN Song` keeps every album, even ones with no songs. `FROM Song LEFT JOIN Album` keeps every song, even one that (hypothetically) has no album.

## GROUP BY / HAVING

```sql
-- count of songs per album
SELECT AlbumId, COUNT(*) AS SongCount
FROM Song
GROUP BY AlbumId;

-- only albums with more than 5 songs
SELECT AlbumId, COUNT(*) AS SongCount
FROM Song
GROUP BY AlbumId
HAVING COUNT(*) > 5;
```

`WHERE` can't filter on an aggregate like `COUNT(*)`, because `WHERE` runs before grouping happens. `HAVING` runs after `GROUP BY`, so it can.

## Aggregate Functions

```sql
SELECT COUNT(*) FROM Song;             -- number of rows
SELECT SUM(SongLength) FROM Song;      -- total
SELECT AVG(SongLength) FROM Song;      -- average
SELECT MIN(SongLength) FROM Song;      -- smallest
SELECT MAX(SongLength) FROM Song;      -- largest
```

## INSERT

```sql
INSERT INTO Genre (Name) VALUES ('Soul');
INSERT INTO Artist (ArtistName, YearEstablished) VALUES ('Rush', 1968);
```

## UPDATE

```sql
UPDATE Artist SET YearEstablished = 1969 WHERE Id = 3;
```

## DELETE

```sql
DELETE FROM Artist WHERE Id = 3;
```

## CREATE TABLE

```sql
CREATE TABLE Genre (
    Id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    Name TEXT NOT NULL
);

CREATE TABLE Album (
    Id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    Title TEXT NOT NULL,
    ArtistId INTEGER NOT NULL REFERENCES Artist (Id),  -- foreign key, required
    GenreId INTEGER REFERENCES Genre (Id)               -- foreign key, optional
);
```

`GENERATED ALWAYS AS IDENTITY` auto-increments the primary key for you. `REFERENCES` creates a foreign key constraint — the row it points to has to exist. Leaving `NOT NULL` off a foreign key column makes that relationship optional.
