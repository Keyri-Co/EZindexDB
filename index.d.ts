export class EZindexDB {
  /**
   * Initializes a connection to the database or creates it if it doesn't exist.
   * 
   * @param database - The name of the database.
   * @param table - The name of the table (object store).
   * @param indexes - An array of index names to be created.
   * @returns Resolves to true if successful.
   */
  start(database: string, table: string, indexes?: string[]): Promise<boolean>;

  /**
   * Adds a record to the database if it doesn't exist.
   * Throws an error if the record already exists.
   * 
   * @param table - The name of the table (object store).
   * @param data - The data to be added.
   * @returns Resolves to the key of the added record.
   */
  creates(table: string, data: object): Promise<IDBValidKey>;

  /**
   * Retrieves a record from the database by its ID.
   * 
   * @param table - The name of the table (object store).
   * @param id - The ID of the record to retrieve.
   * @returns Resolves to the retrieved record.
   */
  reads(table: string, id: IDBValidKey): Promise<object>;

  /**
   * Updates an existing record in the database.
   * Throws an error if the record doesn't exist.
   * 
   * @param table - The name of the table (object store).
   * @param data - The data to update.
   * @returns Resolves to the key of the updated record.
   */
  updates(table: string, data: object): Promise<IDBValidKey>;

  /**
   * Inserts or updates a record in the database.
   * 
   * @param table - The name of the table (object store).
   * @param data - The data to insert or update.
   * @returns Resolves to the key of the inserted or updated record.
   */
  upserts(table: string, data: object): Promise<IDBValidKey>;

  /**
   * Deletes a record from the database by its ID.
   * 
   * @param table - The name of the table (object store).
   * @param id - The ID of the record to delete.
   * @returns Resolves to true if the deletion was successful.
   */
  deletes(table: string, id: IDBValidKey): Promise<boolean>;

  /**
   * Searches for records in the database by a specified field and value.
   * 
   * @param table - The name of the table (object store).
   * @param field - The name of the field to search by.
   * @param value - The value to search for.
   * @returns Resolves to an array of matching records.
   */
  searches(table: string, field: string, value: any): Promise<object[]>;
}

export class SynthEzIndexDB extends EZindexDB {}
