/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
   Configurations for the Firebase Database or localStorage
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
let db = null;
let useDatabaseApi = false;

// Firebase configuration and initialization
const initFirebase = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyA6Q9GHEPm9sEUxi4zFJkdDnsu8K5-hg1U",
    authDomain: "monaca-stock-management.firebaseapp.com",
    projectId: "monaca-stock-management",
    storageBucket: "monaca-stock-management.appspot.com",
    messagingSenderId: "788776392831",
    appId: "1:788776392831:web:8ca3c8e735392adf26474a",
    measurementId: "G-B84QMRWKF5"
  };

  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
};

if (initFirebase) {
  useDatabaseApi = true;
  initFirebase(); // initialize Firebase
}

/* - - - - - - - - - - - - - - - - -
   Methods for the Firebase Database 
- - - - - - - - - - - - - - - - - - */
// Add new items to the Shop List
function addNewShop(jsonObject) {
  db.collection('shops').add({
    'name': jsonObject.name,
    'telephone': jsonObject.telephone,
    'address': jsonObject.address,
    'location': jsonObject.location,
  });
}

// Add new items to the Product List
function addNewProduct(jsonObject) {
  db.collection('products').add({
    code: jsonObject.code,
    'name': jsonObject.name,
    'price': jsonObject.price,
    'quantity': jsonObject.quantity,
    'shop': jsonObject.shop,
  });
}

// Uploading picture
function uploadImageToFirebaseStorage(elementName, fileName, img, edit) {
  const storageRef = firebase.storage().ref('products/' + fileName);
  const uploadTask = storageRef.putString(img, 'base64');

  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
    function (snapshot) {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      elementName.innerHTML = 'Upload is ' + Math.trunc(progress) + '% done';

      if (progress == 100) {
        if (edit) {
          app.dialog.alert('Saved product details.', '');
        } else {
          app.dialog.alert('Product added to the products list.', '');
          app.methods.emptyNewProductForm();
          document.getElementById("imageFile").src = "assets/pictures/camera.png";
          elementName.innerHTML = "";
        }
      }

      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED:
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING:
          console.log('Upload is running');
          break;
      }
    },
    function (error) {
      switch (error.code) {
        case 'storage/unauthorized':
          break;
        case 'storage/canceled':
          break;
        case 'storage/unknown':
          break;
        case 'storage/invalid-format':
          break;
      }
    });
}

// To get the picture from the database 
function getImage(data, pageName) {
  const storageRef = firebase.storage().ref();
  const filename = 'products/' + data.code + '.jpg';
  const ref = storageRef.child(filename);

  // Get the download URL
  ref.getDownloadURL().then(function (url) {
    if (pageName == "HOME")
      document.getElementById(`${data.code}`).src = url;
    else if (pageName == "EDIT")
      document.getElementById('imageFile').src = url;
    else if (pageName == "PRODUCT")
      document.getElementById(`${data.code}-img`).src = url;
  }).catch(function (error) {
    switch (error.code) {
      case 'storage/object-not-found':
        break;
      case 'storage/unauthorized':
        break;
      case 'storage/canceled':
        break;
      case 'storage/unknown':
        break;
    }
  });
};

// Search by one filled field
const oneFieldSearch = (elementName, stringName, fieldName) => {
  db.collection('products').where(stringName, '==', fieldName).get().then((snapshot) => {
    let result = '';
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      result += `
        <div class="card-bg block block-strong inset">
          <p>Product Code: <span>${data.code}</span></p>
          <p>Product Name: <span>${data.name}</span></p>
          <p>Price: <span>${data.price}</span></p>
          <p>Quantity: <span id="search-quantity">${data.quantity}</span></p>
          <div class="block display-flex justify-content-center">
            <img style="width:200px;height:150px" id="${data.code}-img" src="assets/pictures/camera.png" />
          </div>
          <div class="display-flex justify-content-center">
            <div class="stepper stepper-init stepper-small stepper-raised" data-value-el="#">
              <div id="minus" class="stepper-button-minus update-quantity-minus" data-quantity="${data.quantity}" data-product-id="${doc.id}"></div>
              <div id="plus" class="stepper-button-plus update-quantity-plus" data-quantity="${data.quantity}" data-product-id="${doc.id}"></div>
            </div>
          </div>   
        </div>`;

      getImage(data, "PRODUCT");
    });
    elementName.innerHTML = result;
  });
}

// Search by two filled field
const twoFieldSearch = (elementName, stringName, fieldName, stringName2, fieldName2) => {
  db.collection('products').where(stringName, '==', fieldName).where(stringName2, '==', fieldName2).get().then((snapshot) => {
    let result = '';
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      result += `
        <div class="card-bg block block-strong inset">
          <p>Product Code: <span>${data.code}</span></p>
          <p>Product Name: <span>${data.name}</span></p>
          <p>Price: <span>${data.price}</span></p>
          <p>Quantity: <span id="search-quantity">${data.quantity}</span></p>
          <div class="block display-flex justify-content-center">
            <img style="width:200px;height:150px" id="${data.code}-img" src="assets/pictures/camera.png" />
          </div>
         <div class="display-flex justify-content-center">
            <div class="stepper stepper-init stepper-small stepper-raised" data-value-el="#">
              <div id="minus" class="stepper-button-minus update-quantity-minus" data-quantity="${data.quantity}" data-product-id="${doc.id}"></div>
              <div id="plus" class="stepper-button-plus update-quantity-plus" data-quantity="${data.quantity}" data-product-id="${doc.id}"></div>
            </div>
          </div>   
        </div>`;

      getImage(data, "PRODUCT");
    });
    elementName.innerHTML = result;
  });
}

// Real time update with Firebase for the Search
const getRealTimeUpdatesForSearch = (elementName) => {
  const jsonObject = app.methods.dataToJson('#search-product-form');

  if (jsonObject.code != "" && jsonObject.name == "" && jsonObject.shop == "") {
    oneFieldSearch(elementName, 'code', jsonObject.code);
  } else if (jsonObject.code == "" && jsonObject.name != "" && jsonObject.shop == "") {
    oneFieldSearch(elementName, 'name', jsonObject.name);
  } else if (jsonObject.code == "" && jsonObject.name == "" && jsonObject.shop != "") {
    oneFieldSearch(elementName, 'shop', jsonObject.shop);
  } else if (jsonObject.code != "" && jsonObject.name != "" && jsonObject.shop == "") {
    twoFieldSearch(elementName, 'code', jsonObject.code, 'name', jsonObject.name);
  } else if (jsonObject.code != "" && jsonObject.name == "" && jsonObject.shop != "") {
    twoFieldSearch(elementName, 'code', jsonObject.code, 'shop', jsonObject.shop);
  } else if (jsonObject.code == "" && jsonObject.name != "" && jsonObject.shop != "") {
    twoFieldSearch(elementName, 'name', jsonObject.name, 'shop', jsonObject.shop);
  }
}

// Real time update with Firebase for the Shops
const getRealTimeUpdatesForShops = (elementName) => {
  db.collection('shops').onSnapshot((doc) => {
    let result = '';
    doc.docs.forEach((doc) => {
      const data = doc.data();
      result += `
        <div class=" card-bg block block-strong inset display-flex flex-direction-row">
          <div>
            <p>Name: <span>${data.name}</span></p>
          	<p>Tel: <span>${data.telephone}</span></p>
            <p>Address: <span>${data.address}</span></p>
          </div>
          <div class="align-self-flex-start">
					  <i class="icon f7-icons">
              <a href="/edit-shop/${doc.id}/" data-shop-id="${doc.id}" class="get-shop-details-data">pencil</a>
            </i>
				  </div>
        </div>`;
    });

    elementName.innerHTML = result;
  });
}

// Real time update with Firebase for the Products
const getRealTimeUpdatesForProducts = (elementName, pageName) => {
  db.collection('products').onSnapshot((doc) => {
    let result = '';
    doc.docs.forEach((doc) => {
      const data = doc.data();
      result += `
        <div class="card-bg block block-strong inset">
          <div class="display-flex justify-content-space-between">
            <div>
              <p>Product Code: <span>${data.code}</span></p>
              <p>Name: <span>${data.name}</span></p>
              <p>Price: <span>${data.price}</span></p>
              <p>Quantity: <span">${data.quantity}</span></p>
            </div>
            <i class="icon f7-icons">
              <a href="/edit-product/${doc.id}/" data-product-id="${doc.id}" class="get-product-details-data">pencil</a>
            </i>
          </div>
          <div class="block display-flex justify-content-center">
            <div>`;
      if (pageName == "HOME")
        result += `<img style="width:200px;height:150px" id="${data.code}" src="assets/pictures/camera.png">`
      else if (pageName == "PRODUCT")
        result += `<img style="width:200px;height:150px" id="${data.code}-img" src="assets/pictures/camera.png">`
      result += `
            </div>
          </div>
          <div class="display-flex justify-content-center">
            <div class="stepper stepper-init stepper-small stepper-raised" data-value-el="#">
              <div id="minus" class="stepper-button-minus update-quantity-minus" data-quantity="${data.quantity}" data-product-id="${doc.id}"></div>
              <div id="plus" class="stepper-button-plus update-quantity-plus" data-quantity="${data.quantity}" data-product-id="${doc.id}"></div>
            </div>
          </div>   
        </div>`;

      getImage(data, pageName);
    });
    elementName.innerHTML = result;
  });
}