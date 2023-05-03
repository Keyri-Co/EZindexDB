// EZindexDB.d.ts
declare class EZindexDB {
    private database: any;
    private trans: any;
  
    start(database: string, table: string, indexes?: string[]): Promise<boolean>;
    private transaction(table: string): Promise<any>;
  
    creates(table: string, data: any): Promise<any>;
    reads(table: string, id: any): Promise<any>;
    updates(table: string, data: any): Promise<any>;
    deletes(table: string, id: any): Promise<any>;
    searches(table: string, field: string, value: any): Promise<any>;
  }
  
  export default EZindexDB;
  