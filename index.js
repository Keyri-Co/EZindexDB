export default class EZindexDB{
  
  #database;
  
  // //////////////////////////////////////////////////////////////////////////
  //
  // Instantiate a connection to the database, if not just create
  // it outright.
  //
  // //////////////////////////////////////////////////////////////////////////
  start = (database, table, indexes) => {
    return new Promise((resolve, reject) => {
      // start connection to DB, then, listen for events
      const openRequest = indexedDB.open(database, 1);
  
      // handle error
      openRequest.onerror = event => {
        reject(event.target.error);
      };
  
      // upgradeNeeded ???
      openRequest.onupgradeneeded = event => {
        this.#database = event.target.result;
        const store = this.#database.createObjectStore(table, {"keyPath": "id"});
        
        // If we're taking indexes, let's create indexes
        if(indexes){
          indexes.forEach((index) => store.createIndex(index,index));
        }
      };
  
      openRequest.onsuccess = event => {
        this.#database = event.target.result;
        resolve(true);
      };
    });
  }
  
  // //////////////////////////////////////////////////////////////////////////
  //
  // Create a transaction that we can use internally
  //
  // //////////////////////////////////////////////////////////////////////////
  #transaction = async(table) => {
    const transaction = await this.#database.transaction(table, 'readwrite');
    const store = transaction.objectStore(table);
    return store;
  }
  
  
  // //////////////////////////////////////////////////////////////////////////
  //
  // Add a record to the database if it doesn't exist
  // THROW AN ERROR IF THE RECORD DOES EXIST
  //
  // //////////////////////////////////////////////////////////////////////////
  creates = (table, data) => {
    return new Promise((resolve, reject) => {
      // start a transaction
      const transaction = this.#database.transaction(table, 'readwrite');
      const store = transaction.objectStore(table);
  
      // Try adding data to the store
      const request = store.add(data);
  
      request.onsuccess = () => {
        resolve(request.result);
      };
  
      request.onerror = (event) => {
        console.error("Error adding data to IndexedDB:", event.target.error);
        reject(event.target.error);
      };
  
      // Handle transaction errors
      transaction.onerror = (event) => {
        console.error("Transaction error:", event.target.error);
      };
    });
  }
  
  
  // //////////////////////////////////////////////////////////////////////////
  //
  // GET A RECORD OUT OF THE DATABASE
  //
  // //////////////////////////////////////////////////////////////////////////
  reads = (table, id) => {
    return new Promise((resolve, reject) => {
      // start a transaction
      const transaction = this.#database.transaction(table, 'readonly');
      const store = transaction.objectStore(table);
      
      // Try getting some information out of the database
      const request = store.get(id);
      
      request.onsuccess = () => {
        resolve(request.result);
      };
  
      request.onerror = (event) => {
        console.error("Error reading data from IndexedDB:", event.target.error);
        reject(event.target.error);
      };
  
      // Handle transaction errors
      transaction.onerror = (event) => {
        console.error("Transaction error:", event.target.error);
      };
    });
  }
  
  
  // //////////////////////////////////////////////////////////////////////////
  //
  // UPDATE A RECORD IN THE DATABASE IF IT DOES EXIST
  // THROW AN ERROR IF THE RECORD DOES EXIST
  //
  // //////////////////////////////////////////////////////////////////////////
  updates = (table, data) => {
    return new Promise(async (resolve, reject) => {
      // see if the thing exists first.
      // if not, fail it
      let test_data = await this.reads(table, data.id);
      
      if(!test_data){
        reject(new Error("A record must exist before you can update it"));
      }
  
      // start a transaction
      const transaction = this.#database.transaction(table, 'readwrite');
      const store = transaction.objectStore(table);
      
      // Try updating data in the store
      const request = store.put({...test_data, ...data});
      
      request.onsuccess = () => {
        resolve(request.result);
      };
  
      request.onerror = (event) => {
        console.error("Error updating data in IndexedDB:", event.target.error);
        reject(event.target.error);
      };
  
      // Handle transaction errors
      transaction.onerror = (event) => {
        console.error("Transaction error:", event.target.error);
      };
    });
  }
  
  // //////////////////////////////////////////////////////////////////////////
  //
  // UPDATE A RECORD IN THE DATABASE IF IT DOES EXIST
  // THROW AN ERROR IF THE RECORD DOES EXIST
  //
  // //////////////////////////////////////////////////////////////////////////
  upserts = (table, data) => {
    return new Promise(async (resolve, reject) => {
      // see if the thing exists first.
      // if not, fail it
      let test_data = await this.reads(table, data.id);
  
      // start a transaction
      const transaction = this.#database.transaction(table, 'readwrite');
      const store = transaction.objectStore(table);
      let request;

      // Try updating data in the store
      if(test_data){
        request = store.put({...test_data, ...data});
      } else {
        request = store.add(data);
      }
 
      
      request.onsuccess = () => {
        resolve(request.result);
      };
  
      request.onerror = (event) => {
        console.error("Error updating data in IndexedDB:", event.target.error);
        reject(event.target.error);
      };
  
      // Handle transaction errors
      transaction.onerror = (event) => {
        console.error("Transaction error:", event.target.error);
      };
    });
  }
  
  // //////////////////////////////////////////////////////////////////////////
  //
  // UPDATE A RECORD IN THE DATABASE IF IT DOES EXIST
  // THROW AN ERROR IF THE RECORD DOES EXIST
  //
  // //////////////////////////////////////////////////////////////////////////
  deletes = (table, id) => {
    return new Promise((resolve, reject) => {
      // start a transaction
      const transaction = this.#database.transaction(table, 'readwrite');
      const store = transaction.objectStore(table);
      
      // Try deleting the record from the store
      const request = store.delete(id);
      
      request.onsuccess = () => {
        resolve(true);
      };
  
      request.onerror = (event) => {
        console.error("Error deleting record from IndexedDB:", event.target.error);
        reject(event.target.error);
      };
  
      // Handle transaction errors
      transaction.onerror = (event) => {
        console.error("Transaction error:", event.target.error);
      };
    });
  }
  
  // //////////////////////////////////////////////////////////////////////////
  //
  // GET A RECORD OUT OF THE DATABASE - BY FIELD / VALUE COMBO...
  //
  // //////////////////////////////////////////////////////////////////////////
  searches = (table, field, value) => {
    return new Promise((resolve, reject) => {
      // start a transaction
      const transaction = this.#database.transaction(table, 'readonly');
      const store = transaction.objectStore(table);
      
      // Set Reference to our Index
      let ndx = store.index(field);
      
      // Try getting some information out of the database
      const request = ndx.getAll(value);
      
      request.onsuccess = () => {
        // The result of the request will be in request.result
        resolve(request.result);
      };
  
      request.onerror = (event) => {
        console.error("Error reading from IndexedDB:", event.target.error);
        reject(event.target.error);
      };
      
      // Handle transaction errors
      transaction.onerror = (event) => {
        console.error("Transaction error:", event.target.error);
      };
    });
  }
  
  
}

/////////////////////////////////
// DEMO:
/////////////////////////////////

/*
// Instantiate the DB
  let ez = new EZindexDB();
  
//
// List any of the fields we might want to search on
// that aren't "id"
//
  await ez.start("company","people",["name"]);

//
// Demonstration of adding people to our DB
//
  await ez.creates("people",{"id": "1", "salary": 12, "name": "STEVE"});
  await ez.creates("people",{"id": "2", "salary": 12, "name": "EDDY"});
  await ez.creates("people",{"id": "3", "salary": 12, "name": "JOE"});
  await ez.creates("people",{"id": "4", "salary": 13, "name": "JOE"});

//
// Find everybody named "JOE"
//
  let data = await ez.searches("people","name", "JOE");
  
//
// Set Joe's Salary to 12_000
//
  await ez.updates("people",{"id": "3", "salary": 12_000});
  
//
// Make sure we can't 'upsert' a record
//
  await ez.updates("people",{"id": "newb", "salary": 12_000});  // this one fails
*/

