export default class EZindexDB{
  
  #database;
  #trans;

  
  // //////////////////////////////////////////////////////////////////////////
  //
  // Instantiate a connection to the database, if not just create
  // it outright.
  //
  // //////////////////////////////////////////////////////////////////////////
  start = async (database, table, indexes) => {
    return new Promise((resolve, reject) => {
      try{
        // start connection to DB, then, listen for events
        const openRequest = indexedDB.open(database, 1);

        // handle error
        openRequest.onerror = event => {reject(event)};

        // upgradeNeeded ???
        openRequest.onupgradeneeded = async event => {
          this.#database = event.target.result;
          const store = this.#database.createObjectStore(table, {"keyPath": "id"});
          
          // If we're taking indexes, let's create indexes
          if(indexes){
            let tmp = await Promise.all(indexes.map((index) => {return store.createIndex(index,index)}));
          }
        };

        openRequest.onsuccess = event => {
          this.#database = event.target.result;
          resolve(true);
        };
      } catch(err){
        reject(err);
      }
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
  creates = async (table, data) => {
    
    // start a transaction
    const store = await this.#transaction(table);
    
    // store whatever comes from our method here
    let results;
    
    try{

      // Try getting some information out of the database
      results = await store.add(data);

      await new Promise((s,j) => {
      
        // Handle when everything was successful
        results.onsuccess = () => {
          return s(true);
        }

        // Handle when things went poorly...
        results.onerror = (e) => {
          throw new Error(e);
          return j(false);
        }
      
      });
      

      // Return our success now that we're done
      return results.result;

    } catch(e){
      // return our failure, now that we've failed
      return e;
    }
  }
  
  // //////////////////////////////////////////////////////////////////////////
  //
  // GET A RECORD OUT OF THE DATABASE
  //
  // //////////////////////////////////////////////////////////////////////////
  reads = async (table, id) => {
    
    // start a transaction
    const store = await this.#transaction(table);
    
    // store whatever comes from our method here
    let results;
    
    try{

      // Try getting some information out of the database
      results = await store.get(id);

      await new Promise((s,j) => {
      
        // Handle when everything was successful
        results.onsuccess = () => {
          return s(true);
        }

        // Handle when things went poorly...
        results.onerror = (e) => {
          throw new Error(e);
          return j(false);
        }
      
      });

      // Return our success now that we're done
      return results.result;

    } catch(e){
      // return our failure, now that we've failed
      return e;
    }

  }
  
  // //////////////////////////////////////////////////////////////////////////
  //
  // UPDATE A RECORD IN THE DATABASE IF IT DOES EXIST
  // THROW AN ERROR IF THE RECORD DOES EXIST
  //
  // //////////////////////////////////////////////////////////////////////////
  updates = async (table, data) => {
    
    // see if the thing exists first.
    // if not, fail it
    let test_data = await this.reads(table, data.id);
    
    if(!test_data){
      throw new Error("A record must exist before you can update it");
    }
    
    // start a transaction
    const store = await this.#transaction(table);
    
    // store whatever comes from our method here
    let results;
    
    try{

      // Try getting some information out of the database
      results = await store.put({...test_data, ...data});

      await new Promise((s,j) => {
      
        // Handle when everything was successful
        results.onsuccess = () => {
          return s(true);
        }

        // Handle when things went poorly...
        results.onerror = (e) => {
          throw new Error(e);
          return j(false);
        }
      
      });
      

      // Return our success now that we're done
      return results.result;

    } catch(e){
      // return our failure, now that we've failed
      return e;
    }
  }
  
  // //////////////////////////////////////////////////////////////////////////
  //
  // UPDATE A RECORD IN THE DATABASE IF IT DOES EXIST
  // THROW AN ERROR IF THE RECORD DOES EXIST
  //
  // //////////////////////////////////////////////////////////////////////////
  deletes = async (table, id) => {
    
    
    // start a transaction
    const store = await this.#transaction(table);
    
    // store whatever comes from our method here
    let results;
    
    try{

      // Try getting some information out of the database
      results = await store.delete(id);

      await new Promise((s,j) => {
      
        // Handle when everything was successful
        results.onsuccess = () => {
          return s(true);
        }

        // Handle when things went poorly...
        results.onerror = (e) => {
          throw new Error(e);
          return j(false);
        }
      
      });
      

      // Return our success now that we're done
      return results.result;

    } catch(e){
      // return our failure, now that we've failed
      return e;
    }
  }
  
  
  
  
  
  // //////////////////////////////////////////////////////////////////////////
  //
  // GET A RECORD OUT OF THE DATABASE - BY FIELD / VALUE COMBO...
  //
  // //////////////////////////////////////////////////////////////////////////
  searches = async (table, field, value) => {
    
    // start a transaction
    const store = await this.#transaction(table);
    
    // store whatever comes from our method here
    let results;
    
    try{

      // Set Reference to our Index
      let ndx = store.index(field);
      
      results = await ndx.getAll(value);

      await new Promise((s,j) => {
      
        // Handle when everything was successful
        results.onsuccess = () => {
          return s(true);
        }

        // Handle when things went poorly...
        results.onerror = (e) => {
          console.log({e});
          throw new Error(e);
          return j(false);
        }
      
      });

      // Return our success now that we're done
      return results.result;

    } catch(e){
      // return our failure, now that we've failed
      return e;
    }

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

