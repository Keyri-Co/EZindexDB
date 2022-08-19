class EZindexDB{
  
  #database;
  #trans;

  
  // //////////////////////////////////////////////////////////////////////////
  //
  // Instantiate a connection to the database, if not just create
  // it outright.
  //
  // //////////////////////////////////////////////////////////////////////////
  start = async (database, table) => {
    return new Promise((resolve, reject) => {

      // start connection to DB, then, listen for events
      const openRequest = indexedDB.open(database, 1);

      // handle error
      openRequest.onerror = event => {
        console.log('error', event);
      };

      // upgradeNeeded ???
      openRequest.onupgradeneeded = event => {
        this.#database = event.target.result;
        this.#database.createObjectStore(table, {"keyPath": "id"});
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
          throw new Error(results.error);
          return j(false);
        }
      
      });
      

      // Return our success now that we're done
      return results.result;

    } catch(e){
      // return our failure, now that we've failed
      return results.error;
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
          throw new Error(results.error);
          return j(false);
        }
      
      });

      // Return our success now that we're done
      return results.result;

    } catch(e){
      // return our failure, now that we've failed
      return results.error;
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
      results = await store.put(data);

      await new Promise((s,j) => {
      
        // Handle when everything was successful
        results.onsuccess = () => {
          return s(true);
        }

        // Handle when things went poorly...
        results.onerror = (e) => {
          throw new Error(results.error);
          return j(false);
        }
      
      });
      

      // Return our success now that we're done
      return results.result;

    } catch(e){
      // return our failure, now that we've failed
      return results.error;
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
          throw new Error(results.error);
          return j(false);
        }
      
      });
      

      // Return our success now that we're done
      return results.result;

    } catch(e){
      // return our failure, now that we've failed
      return results.error;
    }
  }
  
}

/////////////////////////////////
// DEMO:
/////////////////////////////////

/*
  let ez = new EZindexDB();
  await ez.start("company","people");

  await ez.creates("people",{"id": "1", "salary": 12});
  await ez.creates("people",{"id": "2", "salary": 12});
  await ez.creates("people",{"id": "3", "salary": 12});

  await ez.updates("people",{"id": "3", "salary": 12_000});
  await ez.updates("people",{"id": "newb", "salary": 12_000});  // this one fails
*/

