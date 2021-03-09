var $$ = Dom7;

var app = new Framework7({
  root: '#app', // App root element
  name: 'framework7-core-tab-view', // App name
  theme: 'auto', // Automatic theme detection

  view: {
    stackPages: true, // For navigation between multi-level pages
  },
  // Centering the navbar
  navbar: {
    mdCenterTitle: true,
    iosCenterTitle: true,
    auroraCenterTitle: true
  },
  data: function () {
    return {
      // App root data
    };
  },
  // App root methods
  methods: {
    // Converts a form to a JSON object
    dataToJson: function (formIdName) {
      var formData = app.form.convertToData(formIdName);
      const jsonString = JSON.stringify(formData);
      const jsonObject = JSON.parse(jsonString);

      return jsonObject;
    },
    // Checks if the form (new shop) has any empty entry
    isNewShopFormEmpty: function () {
      if (document.getElementById('shop-name').value == "" ||
        document.getElementById('shop-telephone').value == "" ||
        document.getElementById('shop-address').value == "" ||
        document.getElementById('shop-location').value == "")
        return false;

      return true;
    },
    // Checks if the form (new product) has any empty entry
    isProductFormEmpty: function () {
      if (document.getElementById('product-code').value == "" ||
        document.getElementById('product-name').value == "" ||
        document.getElementById('product-price').value == "" ||
        document.getElementById('product-quantity').value == "" ||
        document.getElementById('product-shop').value == "")
        return false;

      return true;
    },
    // Checks if the form (search) has any empty entry
    isSearchFormEmpty: function () {
      if (document.getElementById('product-code').value == "" &&
        document.getElementById('product-name').value == "" &&
        document.getElementById('product-shop').value == "")
        return false;

      return true;
    },
    // After submitting a New Shop it will empty the inputs
    emptyNewShopForm: function () {
      document.getElementById('shop-name').value = "";
      document.getElementById('shop-telephone').value = "";
      document.getElementById('shop-address').value = "";
      document.getElementById('shop-location').value = "";
    },
    // After submitting a New Product it will empty the inputs
    emptyNewProductForm: function () {
      document.getElementById('product-code').value = "";
      document.getElementById('product-name').value = "";
      document.getElementById('product-price').value = "";
      document.getElementById('product-quantity').value = "";
      document.getElementById('product-shop').value = "";
    },
    // After clicking Clear button it will empty the inputs and the search result
    emptySearchForm: function () {
      document.getElementById('product-code').value = "";
      document.getElementById('product-name').value = "";
      document.getElementById('product-shop').value = "";
      document.getElementById('product-list').innerText = "";
    },
  },
  // App routes
  routes: routes,
});

// Variables
let shopId = null;

// PhoneGap
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
  console.log("PhoneGap is ready");
}

// Get shop details data
$$(document).on('click', '.get-shop-details-data', function () {
  shopId = $$(this).data('shop-id');

  db.collection('shops').where(firebase.firestore.FieldPath.documentId(), '==', shopId).get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      document.getElementById('shop-name').value = data.name;
      document.getElementById('shop-telephone').value = data.telephone;
      document.getElementById('shop-address').value = data.address;
      document.getElementById('shop-location').value = data.location;
    });
  });
});

// Save the edited shop data
$$(document).on('click', '.edited-shop-data', function () {
  if (app.methods.isNewShopFormEmpty()) {

    db.collection('shops').doc(shopId).update({
      name: document.getElementById('shop-name').value,
      telephone: document.getElementById('shop-telephone').value,
      address: document.getElementById('shop-address').value,
      location: document.getElementById('shop-location').value
    });

    app.dialog.alert('Saved shop details.', '');
  } else app.dialog.alert('Please fill out the form first.', '');
});

// Get product details data
$$(document).on('click', '.get-product-details-data', function () {
  productId = $$(this).data('product-id');

  // To get the picture from the database 
  function getImage(data) {
    const storageRef = firebase.storage().ref();
    const filename = 'products/' + data.code + '.jpg';
    const ref = storageRef.child(filename);

    // Get the download URL
    ref.getDownloadURL().then(function (url) {
      document.getElementById('imageFile').src = url;
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

  db.collection('products').where(firebase.firestore.FieldPath.documentId(), '==', productId).get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      document.getElementById('product-code').value = data.code;
      document.getElementById('product-name').value = data.name;
      document.getElementById('product-price').value = data.price;
      document.getElementById('product-quantity').value = data.quantity;
      document.getElementById('product-shop').value = data.shop;

      getImage(data);
    });
  });
});

// Save the edited product data
$$(document).on('click', '.edited-product-data', function () {
  // Uploading picture
  function uploadImageToFirebaseStorage(filename, img) {
    const storageRef = firebase.storage().ref('products/' + filename);
    const uploadTask = storageRef.putString(img, 'base64');

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      function (snapshot) {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        document.getElementById('uploading-picture').innerHTML = 'Upload is ' + Math.trunc(progress) + '% done';

        if (progress == 100)
          app.dialog.alert('Saved product details.', '');

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

  if (app.methods.isProductFormEmpty()) {
    const jsonObject = app.methods.dataToJson('#edit-product-form');
    const img = document.getElementById("imageFile").src.substring("data:image/jpeg;base64,".length);
    uploadImageToFirebaseStorage(jsonObject.code + '.jpg', img);;

    db.collection('products').doc(productId).update({
      code: document.getElementById('product-code').value,
      name: document.getElementById('product-name').value,
      price: document.getElementById('product-price').value,
      quantity: document.getElementById('product-quantity').value,
      shop: document.getElementById('product-shop').value
    });

  } else app.dialog.alert('Please fill out the form first.', '');
});

/* - - - - - - - - - - - - - - - -
   Methods for the barcode plugin
- - - - - - - - - - - - - - - - - */
function scanBarcode() {
  cordova.plugins.barcodeScanner.scan(
    function (result) {
      document.getElementById('product-code').value = result.text;
    },
    function (error) {
      alert("Scanning failed: " + error);
    }, {
      preferFrontCamera: false,
      showFlipCameraButton: false,
      showTorchButton: false,
      torchOn: false,
      disableAnimations: true,
      disableSuccessBeep: false
    }
  );
}

/* - - - - - - - - - - - - - - - -
   Methods for the camera plugin
- - - - - - - - - - - - - - - - - */
// Set options for camera
function setOptions(srcType) {
  var options = {
    quality: 50,
    destinationType: Camera.DestinationType.DATA_URL,
    sourceType: srcType,
    encodingType: Camera.EncodingType.JPEG,
    mediaType: Camera.MediaType.PICTURE,
    allowEdit: false,
    correctOrientation: true
  }
  return options;
}

// Take picture with camera
function openCamera(selection) {
  var srcType = Camera.PictureSourceType.CAMERA;
  var options = setOptions(srcType);
  navigator.camera.getPicture(function cameraSuccess(imageUrl) {
    // Cordova Bug getPicture doesn't work properly
    displayImage(imageUrl);
  }, function cameraError(error) {
    console.debug("Unable to take picture: " + error, "app");
  }, options);
}

// Open gallery and choose a picture
function openFilePicker(selection) {
  var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
  var options = setOptions(srcType);
  navigator.camera.getPicture(function cameraSuccess(imageUrl) {
    // Cordova bug getPicture doesn't work properly
    displayImage(imageUrl);
  }, function cameraError(error) {
    console.debug("Unable to obtain picture: " + error, "app");
  }, options);
}

// Add picture to DOM
function displayImage(img) {
  let image = document.getElementById('imageFile');
  image.src = "data:image/jpeg;base64," + img;
}

/* - - - - - - 
   Pop ups
- - - - - - - */
// Pop up to list all the added barcodes
function popUpBarcodeList(elementName) {
  $$(document).on('click', '.popup-code-list', function () {
    db.collection('products').get().then((snapshot) => {
      let result = '';
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        result += `
          <li>
            <a href="#" class="item-content item-link popup-close">
              <div class="item-inner">
                <div data-product-code="${data.code}" class="get-product-code item-title">${data.code}</div>
              </div>
            </a>
          </li>`;
      });

      elementName.innerHTML = result;
    });
  });
}

// Pop up to list all the products
function popUpProductList(elementName) {
  $$(document).on('click', '.popup-product-list', function () {
    db.collection('products').get().then((snapshot) => {
      let result = '';
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        result += `
          <li>
            <a href="#" class="item-content item-link popup-close">
              <div class="item-inner">
                <div data-product-name="${data.name}" class="get-product-name item-title">${data.name}</div>
              </div>
            </a>
          </li>`;
      });

      elementName.innerHTML = result;
    });
  });
}

// Pop up to list all the shops
function popUpShopList(elementName) {
  $$(document).on('click', '.popup-shop-list', function () {
    db.collection('shops').get().then((snapshot) => {
      let result = '';
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        result += `
        <li>
          <a href="#" class="item-content item-link popup-close">
            <div class="item-inner">
              <div data-shop-id="${doc.id}" data-shop-name="${data.name}" class="get-shop-name item-title">${data.name}</div>
            </div>
          </a>
        </li>`;
      });

      elementName.innerHTML = result;
    });
  });
}

/* - - - - - - - - - - - - - - - 
   Get data from the pop ups
- - - - - - - - - - - - - - - - */
// Get barcode data from pop up and add it to the form
$$(document).on('click', '.get-product-code', function () {
  productCode = $$(this).data('product-code');
  document.getElementById('product-code').value = productCode;
});

// Get product name data from pop up and add it to the form
$$(document).on('click', '.get-product-name', function () {
  productName = $$(this).data('product-name');
  document.getElementById('product-name').value = productName;
});

// Get shop name from shop list pop up and add it to the form
$$(document).on('click', '.get-shop-name', function () {
  shopName = $$(this).data('shop-name');
  shopId = $$(this).data('shop-id');
  document.getElementById('product-shop').value = shopName;
});

/* - - - - - - - - - - - - - - 
   Get data from the forms
- - - - - - - - - - - - - - - */
// Get new shop data 
$$(document).on('click', '.convert-form-to-data', function () {
  if (app.methods.isNewShopFormEmpty()) {
    const jsonObject = app.methods.dataToJson('#new-shop-form');
    if (useDatabaseApi) addNewShop(jsonObject); // Add new shop to the database
    app.methods.emptyNewShopForm();
    app.dialog.alert('Shop added to the shop list.', '');
  } else app.dialog.alert('Please fill out the form first1', '');
});

// Get new product data 
function getNewProductDataFromForm(elementName) {
  $$(document).on('click', '.convert-new-product-form-to-data', function () {
    if (app.methods.isProductFormEmpty()) {
      const jsonObject = app.methods.dataToJson('#new-product-form');
      if (checkPicture(elementName, jsonObject))
        if (useDatabaseApi) addNewProduct(jsonObject); // Create/add new product to the database
    } else app.dialog.alert('Please fill out the form first.', '');
  });
}

// Check if the user added a picture or not
function checkPicture(elementName, jsonObject) {
  try {
    const img = document.getElementById("imageFile").src.substring("data:image/jpeg;base64,".length);
    uploadImageToFirebaseStorage(elementName, jsonObject.code + '.jpg', img);
    return true;
  } catch {
    app.dialog.alert('Please upload a picture!', '');
    return false;
  }
}

/* - - - - - - - - - - -
   Methods for the maps
- - - - - - - - - - - -  */

/* - - - - - - - - - - - - - - - - -
   Methods for the product quantity
- - - - - - - - - - - - - - - - - - */
// Subtract quantity
$$(document).on('click', '.update-quantity-minus', function () {
  productId = $$(this).data('product-id');
  changeQuantity('update-quantity-minus', productId, $$(this).data('quantity'));
});

// Add quantity
$$(document).on('click', '.update-quantity-plus', function () {
  productId = $$(this).data('product-id');
  changeQuantity('update-quantity-plus', productId, $$(this).data('quantity'));
});

// Function to add/subtract quantity
const changeQuantity = (className, productId, productQuantity) => {
  let newProductQuantity = 0;
  const idValue = document.getElementsByClassName(className)[0].id;

  if (idValue == "plus")
    newProductQuantity = parseInt(productQuantity) + 1;
  if (idValue == "minus")
    if (parseInt(productQuantity) > 0)
      newProductQuantity = parseInt(productQuantity) - 1;

  // Update Firebase 
  db.collection('products').doc(productId).update({
    quantity: newProductQuantity,
  });
}