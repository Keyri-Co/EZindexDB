# EZindexDB & SynthEzIndexDB

## Overview

`EZindexDB` is a class designed to simplify interactions with IndexedDB, providing a set of methods to perform various database operations. `SynthEzIndexDB` is a class that simulates interactions with IndexedDB using in-memory storage, which can be useful for testing purposes.

## EZindexDB

### Description

A class to simplify interactions with IndexedDB.

### Methods

#### `start(database, table, indexes)`
- **Description:** Initializes a connection to the database or creates it if it doesn't exist.
- **Parameters:**
  - `database` (string): The name of the database.
  - `table` (string): The name of the table (object store).
  - `indexes` (Array<string>): An array of index names to be created (optional).
- **Returns:** Promise<boolean> - Resolves to true if successful.

#### `creates(table, data)`
- **Description:** Adds a record to the database if it doesn't exist. Throws an error if the record already exists.
- **Parameters:**
  - `table` (string): The name of the table (object store).
  - `data` (Object): The data to be added.
- **Returns:** Promise<IDBValidKey> - Resolves to the key of the added record.

#### `reads(table, id)`
- **Description:** Retrieves a record from the database by its ID.
- **Parameters:**
  - `table` (string): The name of the table (object store).
  - `id` (IDBValidKey): The ID of the record to retrieve.
- **Returns:** Promise - Resolves to the retrieved record.

#### `updates(table, data)`
- **Description:** Updates an existing record in the database. Throws an error if the record doesn't exist.
- **Parameters:**
  - `table` (string): The name of the table (object store).
  - `data` (Object): The data to update.
- **Returns:** Promise<IDBValidKey> - Resolves to the key of the updated record.

#### `upserts(table, data)`
- **Description:** Inserts or updates a record in the database.
- **Parameters:**
  - `table` (string): The name of the table (object store).
  - `data` (Object): The data to insert or update.
- **Returns:** Promise<IDBValidKey> - Resolves to the key of the inserted or updated record.

#### `deletes(table, id)`
- **Description:** Deletes a record from the database by its ID.
- **Parameters:**
  - `table` (string): The name of the table (object store).
  - `id` (IDBValidKey): The ID of the record to delete.
- **Returns:** Promise<boolean> - Resolves to true if the deletion was successful.

#### `searches(table, field, value)`
- **Description:** Searches for records in the database by a specified field and value.
- **Parameters:**
  - `table` (string): The name of the table (object store).
  - `field` (string): The name of the field to search by.
  - `value` (any): The value to search for.
- **Returns:** Promise<Array> - Resolves to an array of matching records.

#### `getAll(table)`
- **Description:** Retrieves all records from a table.
- **Parameters:**
  - `table` (string): The name of the table (object store).
- **Returns:** Promise<Array> - Resolves to an array of all records.

#### `countRecords(table)`
- **Description:** Counts the number of records in a table.
- **Parameters:**
  - `table` (string): The name of the table (object store).
- **Returns:** Promise<number> - Resolves to the count of records.

## SynthEzIndexDB

### Description

A class to simulate interactions with IndexedDB using in-memory storage.

### Methods

The methods for `SynthEzIndexDB` are similar to those of `EZindexDB`, but operate on in-memory storage. Refer to the methods listed under `EZindexDB` for their descriptions, parameters, and return values.

### Usage

```javascript
// Instantiate the DB
let ez = new EZindexDB();

// List any of the fields we might want to search on that aren't "id"
await ez.start("company","people",["name"]);

// Demonstration of adding people to our DB
await ez.creates("people",{"id": "1", "salary": 12, "name": "STEVE"});
await ez.creates("people",{"id": "2", "salary": 12, "name": "EDDY"});
await ez.creates("people",{"id": "3", "salary": 12, "name": "JOE"});
await ez.creates("people",{"id": "4", "salary": 13, "name": "JOE"});

// Find everybody named "JOE"
let data = await ez.searches("people","name", "JOE");

// Set Joe's Salary to 12_000
await ez.updates("people",{"id": "3", "salary": 12_000});

// Make sure we can't 'upsert' a record
await ez.updates("people",{"id": "newb", "salary": 12_000});  // this one fails
