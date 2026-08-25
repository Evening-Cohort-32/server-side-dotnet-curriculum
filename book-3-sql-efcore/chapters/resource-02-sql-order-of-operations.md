# SQL - Order of Operations

SQL is *written* in one order, but the database evaluates it in a different order internally:

| You write it in this order | It actually runs in this order |
|---|---|
| `SELECT` | `FROM` / `JOIN` |
| `FROM` / `JOIN` | `WHERE` |
| `WHERE` | `GROUP BY` |
| `GROUP BY` | `HAVING` |
| `HAVING` | `SELECT` |
| `ORDER BY` | `ORDER BY` |
| `LIMIT` | `LIMIT` |

Each stage hands its result to the next as a working set of rows — filtering, grouping, or reshaping it along the way:

![Diagram and explanation of SQL query order of operations: FROM/JOIN runs first and combines rows, then WHERE tests each row individually, then GROUP BY collapses rows into groups, then HAVING filters those groups, then SELECT picks the columns to return, then ORDER BY sorts the results, then LIMIT cuts the results down to N rows](../../assets/sql-order-of-operations.png)
