# Creating a PostgreSQL database for Honey Rae's API
In this part of Book 3 we will use a .NET package called Npgsql (based on a better-known set of libraries called ADO.NET) which allows our .NET applications to send SQL queries to a database and read the data that comes back when the queries are executed. But first, we need to create the database that the API will send requests to. 

## Write the script to create the database
1. Navigate to the HoneyRaesAPI directory in your terminal. Add a folder to it called `SQL` using the `mkdir` command. 
1. Add a file called `01_HoneyRaes_Create.sql` to that `SQL` directory using the `touch` command. 
1. Open the whole project in VS Code.
1. Add the following code to the top of the script:
``` SQL
DROP DATABASE IF EXISTS "HoneyRaes";

CREATE DATABASE "HoneyRaes";

\c HoneyRaes
```

### Explaining the beginning of this script
The first line of this script drops (database terminology for "deletes") the database if it already exists. Even though the first time you create the database, it obviously doesn't already exist, in the future if you want to run the script again, it will exist. This line makes the script _idempotent_, which means that whether we run the script once or seven times in a row, we will end with the same result - one database with all the data in it that we want.   

The second line, unsurprisingly, creates our new database. The third line, however, probably looks new to you. This is actually not a SQL command at all, but a command for the `psql` utility to _connect_ (this is what the `c` stands for) to the newly created `HoneyRaes` database. If we didn't have this line, the tables we are about to create would get added to the default `postgres` database, which we don't want. 

## Create the tables
1. Below the previous block of code, add this block:
```SQL 
CREATE TABLE Customer (
    Id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    Name TEXT NOT NULL,
    Address TEXT NOT NULL
);
```
This code creates the Customer table with all of the properties from the `Customer` class in our API. 

2. Try to create the `Employee` table below the `CREATE` statement for the `Customer` table. You do _not_ need to include a column for service tickets on this table (that data will be stored in the `ServiceTicket` table).  

3. After creating the `Employee` table, add this code to create the `ServiceTicket` table:
``` SQL
CREATE TABLE ServiceTicket (
    Id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    CustomerId INTEGER NOT NULL REFERENCES Customer (Id),
    Description TEXT NOT NULL, 
    Emergency BOOLEAN NOT NULL DEFAULT FALSE,
    DateCompleted TIMESTAMP  
);
```
This table has one foreign key, `CustomerId`, so we use the `REFERENCES` keyword to indicate that relationship. We are using the `DEFAULT` keyword to make a service ticket a non-emergency in the event that a value is not provided. And finally, we are using the `TIMESTAMP` data type for `DateCompleted` because that is the date/time type in PostgreSQL that includes the date and time. Notice there's no `EmployeeId` column here, because a service ticket can have any number of employees assigned to it (including zero), not just one. That relationship needs its own table.

4. A `ServiceTicket` and an `Employee` have a many-to-many relationship: a ticket can have several employees assigned to it, and an employee can be assigned to several tickets. A single foreign key column can't represent that, so we need a separate _join table_ (sometimes called a bridge or junction table) whose only job is to record which employees are assigned to which tickets. Add this table after `ServiceTicket`:
``` SQL
CREATE TABLE ServiceTicketEmployee (
    Id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    ServiceTicketId INTEGER NOT NULL REFERENCES ServiceTicket (Id),
    EmployeeId INTEGER NOT NULL REFERENCES Employee (Id)
);
```
Each row in `ServiceTicketEmployee` represents one employee's assignment to one ticket. Assigning two employees to the same ticket means adding two rows to this table, both with the same `ServiceTicketId` but a different `EmployeeId`. Both foreign keys are `NOT NULL`, because a row in this table only means something if it points at a real ticket and a real employee, there's no such thing as a "half" assignment.

5. Finally, save and run this script using `psql`. `cd` into the `SQL` directory of the projects and run:
``` bash
psql -U postgres -f 01_HoneyRaes_Create.sql
```

## Adding data to the database
1. Add another file to the `SQL` folder of the project called `02_HoneyRaes_Seed.sql`
1. The first line of the file should be `\c HoneyRaes` to connect the script to that database. 
1. In that file, use `INSERT` statements to add all of the data that you are currently storing in the collections at the top of `Program.cs` to your SQL database. You now have four collections to insert: `customers`, `employees`, `serviceTickets`, and `serviceTicketEmployees`. Insert them in that order, `Customer` and `Employee` rows first, then `ServiceTicket` rows, and finally `ServiceTicketEmployee` rows, since each `ServiceTicketEmployee` row references a ticket and an employee that need to already exist. Refer back to the MusicHistory chapter if you can't remember the syntax. 
1. Save that file, and run it with `psql` like you ran the create script. 
1. Open pgAdmin, and look to see that the database and all of the tables have been created (you can see the tables for a database under `Schemas` -> `public` -> `Tables`)
1. Write a few basic queries in pgAdmin to see that your data is there. 

> You many have noticed at this point that the table and column names are being saved in PostgreSQL as lower case, regardless of the casing when you name them. PostgreSQL will lower any upper casing before creating the tables, and luckily this is also true when you write queries (you can `SELECT` from `Customer` or `customer` and both will work). Continue using PascalCase for the names of tables and columns, as this will make your queries look more like the class and property names in C#. 

Up Next: [Connecting to the database from the Web API](./honeyrae-02-npgsql.md)