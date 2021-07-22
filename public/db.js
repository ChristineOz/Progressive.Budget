let db;
// create a new db request for a "BudgetDB" database.
const request = indexedDB.open("BudgetDB", 23)
request.onupgradeneeded = function (event) {
  // create object store called "BudgetStore" and set autoIncrement to true
  const newVersion = event.newVersion
  console.log(`db Updated ${newVersion}`)
  db = event.target.result 
  db.createObjectStore("BudgetStore", {autoIncrement: true})
};
request.onsuccess = function (event) {
  db = event.target.result;
  if (navigator.onLine) {
    checkDatabase();
  }
};
request.onerror = function (event) {
  console.log(event)
  // log error here
  console.log(`An error happend here ${event.target.errorCode}`)
};
function saveRecord(record) {
  // create a transaction on the pending db with readwrite access
  // access your pending object store
  // add record to your store with add method.
  const transaction = db.transaction(["BudgetStore"], 'readwrite')
  const store = transaction.objectStore("BudgetStore")
  store.add(record)
}
function checkDatabase() {
  // open a transaction on your pending db
  // access your pending object store
  // get all records from store and set to a variable
  let transaction = db.transaction(["BudgetStore"], 'readwrite')
  const store = transaction.objectStore("BudgetStore")
  const getAll = store.getAll()
  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then(() => {
          // if successful, open a transaction on your pending db
          // access your pending object store
          // clear all items in your store
          transaction = db.transaction(["BudgetStore"], 'readwrite')
          const currentStore = transaction.objectStore("BudgetStore")
          currentStore.clear()
          console.log("Clearing the store ")
        });
    }
  };
}
// listen for app coming back online
 window.addEventListener('online', checkDatabase);