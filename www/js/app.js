const $$ = Dom7;

const app = new Framework7({
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
      const formData = app.form.convertToData(formIdName);
      const jsonString = JSON.stringify(formData);
      const jsonObject = JSON.parse(jsonString);

      return jsonObject;
    },
    // Checks if the New Shop form has any empty entry
    isNewShopFormEmpty: function () {
      if (document.getElementById('shop-name').value == "" ||
        document.getElementById('shop-telephone').value == "" ||
        document.getElementById('shop-address').value == "" ||
        document.getElementById('shop-location').value == "")
        return false;

      return true;
    },
    // Checks if the New Product form has any empty entry
    isProductFormEmpty: function () {
      if (document.getElementById('product-code').value == "" ||
        document.getElementById('product-name').value == "" ||
        document.getElementById('product-price').value == "" ||
        document.getElementById('product-quantity').value == "" ||
        document.getElementById('product-shop').value == "")
        return false;

      return true;
    },
    // Checks if the Search form has any empty entry
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

const getProductInfoWithYahoo = (barcode) => {
  const yahooApiKey = 'dj00aiZpPW40WFV4SDhDVnd2SSZzPWNvbnN1bWVyc2VjcmV0Jng9ZjA-';
  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  //const url = `https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?appid=${yahooApiKey}&jan_code=${barcode}`;
  const url = `https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?appid=<${yahooApiKey}>&query=nike`
  fetch(proxyurl + url)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    console.log(data.hits);
    console.log(data.hits[0].name);
    if (data && data.hits && data.hits.length) {
      productNameInput.value = data.hits[0].name;
    } else {
      productNameInput.value = 'Product Not Found.';
    }
  }).catch(err => {
    alert(err);
    console.log(err);
  });
};
      getProductInfoWithYahoo(4984279120316);

/* - - - - - - - - - - - - - - - -
   Methods for the camera plugin
- - - - - - - - - - - - - - - - - */
// Set options for camera
function setOptions(srcType) {
  const options = {
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
  const srcType = Camera.PictureSourceType.CAMERA;
  const options = setOptions(srcType);
  navigator.camera.getPicture(function cameraSuccess(imageUrl) {
    // Cordova Bug getPicture doesn't work properly
    displayImage(imageUrl);
  }, function cameraError(error) {
    console.debug("Unable to take picture: " + error, "app");
  }, options);
}

// Open gallery and choose a picture
function openFilePicker(selection) {
  const srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
  const options = setOptions(srcType);
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
    if (useDatabaseApi) {
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
    } else {
      let result = '';
      for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.getItem('Product' + i)) {
          const jsonObject = JSON.parse(localStorage.getItem('Product' + i));
          result += `
          <li>
            <a href="#" class="item-content item-link popup-close">
              <div class="item-inner">
                <div data-product-code="${jsonObject.code}" class="get-product-code item-title">${jsonObject.code}</div>
              </div>
            </a>
          </li>`;
        }
      }

      elementName.innerHTML = result;
    }
  });
}

// Pop up to list all the products
function popUpProductList(elementName) {
  $$(document).on('click', '.popup-product-list', function () {
    if (useDatabaseApi) {
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
    } else {
      let result = '';
      for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.getItem('Product' + i)) {
          const jsonObject = JSON.parse(localStorage.getItem('Product' + i));
          result += `
          <li>
            <a href="#" class="item-content item-link popup-close">
              <div class="item-inner">
                <div data-product-name="${jsonObject.name}" class="get-product-name item-title">${jsonObject.name}</div>
              </div>
            </a>
          </li>`;
        }
      }

      elementName.innerHTML = result;
    }
  });
}

// Pop up to list all the shops
function popUpShopList(elementName) {
  $$(document).on('click', '.popup-shop-list', function () {
    if (useDatabaseApi) {
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
    } else {
      let result = '';
      for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.getItem('Shop' + i)) {
          const jsonObject = JSON.parse(localStorage.getItem('Shop' + i));
          result += `
          <li>
            <a href="#" class="item-content item-link popup-close">
              <div class="item-inner">
                <div data-shop-id="${'Shop' + i}" data-shop-name="${jsonObject.name}" class="get-shop-name item-title">${jsonObject.name}</div>
              </div>
            </a>
          </li>`;
        }
      }

      elementName.innerHTML = result;
    }
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
let i = 0;
// Get new shop data 
$$(document).on('click', '.convert-form-to-data', function () {
  if (app.methods.isNewShopFormEmpty()) {
    const jsonObject = app.methods.dataToJson('#new-shop-form');
    if (useDatabaseApi) addNewShop(jsonObject); // Add new shop to the database
    else addNewShopToLocalStorage(jsonObject);
    app.methods.emptyNewShopForm();
    app.dialog.alert('Shop added to the shop list.', '');
  } else app.dialog.alert('Please fill out the form first.', '');
});

// Get new product data 
function getNewProductDataFromForm(elementName) {
  $$(document).on('click', '.convert-new-product-form-to-data', function () {
    if (app.methods.isProductFormEmpty()) {
      const jsonObject = app.methods.dataToJson('#new-product-form');
      if (checkPicture(elementName, jsonObject)) {
        if (useDatabaseApi) addNewProduct(jsonObject); // Create/add new product to the database
        else addNewProductToLocalStorage(jsonObject);
      }
    } else app.dialog.alert('Please fill out the form first.', '');
  });
}

// Check if the user added a picture or not to the New Product form
function checkPicture(elementName, jsonObject) {
  try {
    if (useDatabaseApi) {
      const img = document.getElementById("imageFile").src.substring(23);
      uploadImageToFirebaseStorage(elementName, jsonObject.code + '.jpg', img);
    }
    else {
      const img = document.getElementById("imageFile");
      uploadImageToLocalStorage(jsonObject.code + '.jpg', img); // NOT WORKING YET
    }
    return true;
  } catch {
    app.dialog.alert('Please upload a picture!', '');
    return false;
  }
}

// Get shop details data
$$(document).on('click', '.get-shop-details-data', function () {
  shopId = $$(this).data('shop-id');

  if (useDatabaseApi) {
    db.collection('shops').where(firebase.firestore.FieldPath.documentId(), '==', shopId).get().then((snapshot) => {
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        document.getElementById('shop-name').value = data.name;
        document.getElementById('shop-telephone').value = data.telephone;
        document.getElementById('shop-address').value = data.address;
        document.getElementById('shop-location').value = data.location;
      });
    });
  } else {
    for (let i = 0; i < localStorage.length; i++) {
      if ('Shop' + i == shopId) {
        const jsonObject = JSON.parse(localStorage.getItem('Shop' + i));
        $$(document).on('page:init', '.page[data-name="edit-shop"]', function () {
          shopDataForLocalStorage(jsonObject);
        });
        $$(document).on('page:afterin', '.page[data-name="edit-shop"]', function () {
          shopDataForLocalStorage(jsonObject);
        });
      }
    }
  }
});

function shopDataForLocalStorage(jsonObject) {
  document.getElementById('shop-name').value = jsonObject.name;
  document.getElementById('shop-telephone').value = jsonObject.telephone;
  document.getElementById('shop-address').value = jsonObject.address;
  document.getElementById('shop-location').value = jsonObject.location;
}

// Save the edited shop data
$$(document).on('click', '.edited-shop-data', function () {
  if (app.methods.isNewShopFormEmpty()) {
    if (useDatabaseApi) {
      db.collection('shops').doc(shopId).update({
        name: document.getElementById('shop-name').value,
        telephone: document.getElementById('shop-telephone').value,
        address: document.getElementById('shop-address').value,
        location: document.getElementById('shop-location').value
      });
    } else {
      for (let i = 0; i < localStorage.length; i++) {
        if ('Shop' + i == shopId) {
          let editedShop = {
            'name': document.getElementById('shop-name').value,
            'telephone': document.getElementById('shop-telephone').value,
            'address': document.getElementById('shop-address').value,
            'location': document.getElementById('shop-location').value,
          }

          localStorage.setItem(shopId, JSON.stringify(editedShop));
        }
      }
    }

    app.dialog.alert('Saved shop details.', '');
  } else app.dialog.alert('Please fill out the form first.', '');
});

// Get product details data
$$(document).on('click', '.get-product-details-data', function () {
  productId = $$(this).data('product-id');

  if (useDatabaseApi) {
    db.collection('products').where(firebase.firestore.FieldPath.documentId(), '==', productId).get().then((snapshot) => {
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        document.getElementById('product-code').value = data.code;
        document.getElementById('product-name').value = data.name;
        document.getElementById('product-price').value = data.price;
        document.getElementById('product-quantity').value = data.quantity;
        document.getElementById('product-shop').value = data.shop;

        getImage(data, "EDIT");
      });
    });
  } else {
    for (let i = 0; i < localStorage.length; i++) {
      if ('Product' + i == productId) {
        const jsonObject = JSON.parse(localStorage.getItem('Product' + i));
        $$(document).on('page:init', '.page[data-name="edit-product"]', function () {
          productDataForLocalStorage(jsonObject);
          getImageFromLocalStorage(jsonObject, "EDIT");
        });
        $$(document).on('page:afterin', '.page[data-name="edit-product"]', function () {
          productDataForLocalStorage(jsonObject);
          getImageFromLocalStorage(jsonObject, "EDIT");
        });
      }
    }
  }
});

function productDataForLocalStorage(jsonObject) {
  document.getElementById('product-code').value = jsonObject.code;
  document.getElementById('product-name').value = jsonObject.name;
  document.getElementById('product-price').value = jsonObject.price;
  document.getElementById('product-quantity').value = jsonObject.quantity;
  document.getElementById('product-shop').value = jsonObject.shop;
}

// Save the edited product data
function saveEditedProductData(elementName) {
  $$(document).on('click', '.edited-product-data', function () {
    if (app.methods.isProductFormEmpty()) {
      const jsonObject = app.methods.dataToJson('#edit-product-form');
      const img = document.getElementById("imageFile").src.substring(23);

      if (useDatabaseApi) {
        uploadImageToFirebaseStorage(elementName, jsonObject.code + '.jpg', img, true);
        

        db.collection('products').doc(productId).update({
          code: document.getElementById('product-code').value,
          name: document.getElementById('product-name').value,
          price: document.getElementById('product-price').value,
          quantity: document.getElementById('product-quantity').value,
          shop: document.getElementById('product-shop').value
        });
      } else {
        // NOT WORKING YET
        uploadImageToLocalStorage(jsonObject.code + '.jpg', img, true);

        for (let i = 0; i < localStorage.length; i++) {
          if ('Product' + i == productId) {
            let editedProduct = {
              'code': document.getElementById('product-code').value,
              'name': document.getElementById('product-name').value,
              'price': document.getElementById('product-price').value,
              'quantity': document.getElementById('product-quantity').value,
              'shop': document.getElementById('product-shop').value
            }

            localStorage.setItem(productId, JSON.stringify(editedProduct));
          }
        }
      }
    } else app.dialog.alert('Please fill out the form first.', '');
  });
}

/* - - - - - - - - - - -
   Methods for the maps
- - - - - - - - - - - -  */
// onSuccess callback accepts a Position object, which contains the current coordinates
let onSuccess = function (map, p) {
  L.marker([p.coords.latitude, p.coords.longitude]).addTo(map)
    .bindPopup('Your current location.')
    .openPopup();

  map.setView([p.coords.latitude, p.coords.longitude], 14);
};

// onError callback receives a PositionError object
function onError(error) {
  app.dialog.alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
}

// Gives back the current location & adds a marker
function currentLocation(map) {
  navigator.geolocation.getCurrentPosition(function (position) {
    onSuccess(map, position)
  }, onError);
}

// Move on the map and add marker to a chosen position
function moveOnTheMap(map, chosenPositionMarker) {
  map.on('click', function (e) {
    lat = e.latlng.lat;
    lon = e.latlng.lng;

    let redIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    if (chosenPositionMarker != undefined)
      map.removeLayer(chosenPositionMarker);

    chosenPositionMarker = L.marker([lat, lon], { icon: redIcon }).addTo(map)
      .bindPopup('Your chosen position.')
      .openPopup();

    map.setView([lat, lon], 14);
  });
}

/* - - - - - - - - - - - - - - - - -
   Methods for the product quantity
- - - - - - - - - - - - - - - - - - */
// Subtract quantity
function subtractQuantity(elementName) {
  $$(document).on('click', '.update-quantity-minus', function () {
    productId = $$(this).data('product-id');
    changeQuantity(elementName, 'update-quantity-minus', productId, $$(this).data('quantity'));
  });
}

// Add quantity
function addQuantity(elementName) {
  $$(document).on('click', '.update-quantity-plus', function () {
    productId = $$(this).data('product-id');
    changeQuantity(elementName, 'update-quantity-plus', productId, $$(this).data('quantity'));
  });
}

// Function to add/subtract quantity
const changeQuantity = (elementName, className, productId, productQuantity) => {
  let newProductQuantity = 0;
  const idValue = document.getElementsByClassName(className)[0].id;

  if (idValue == "plus")
    newProductQuantity = parseInt(productQuantity) + 1;
  if (idValue == "minus")
    if (parseInt(productQuantity) > 0)
      newProductQuantity = parseInt(productQuantity) - 1;

  // Update Firebase 
  if (useDatabaseApi) {
    db.collection('products').doc(productId).update({
      quantity: newProductQuantity,
    });
    getRealTimeUpdatesForSearch(elementName);
  } else {
    for (let i = 0; i < localStorage.length; i++) {
      if ('Product' + i == productId) {
        const jsonObject = JSON.parse(localStorage.getItem('Product' + i));
        let changedProduct = {
          'code': jsonObject.code,
          'name': jsonObject.name,
          'price': jsonObject.price,
          'quantity': newProductQuantity,
          'shop': jsonObject.shop
        }

        localStorage.setItem(productId, JSON.stringify(changedProduct));
        location.reload(true);
      }
    }
  }
}

/* - - - - - - - - - - - - - - -
   Methods for the Search pages
- - - - - - - - - - - - - - - - */
// Get query
function getQuery(elementName) {
  $$(document).on('click', '.convert-product-form-to-data', function () {
    if (app.methods.isSearchFormEmpty()) {
      if (useDatabaseApi) getRealTimeUpdatesForSearch(elementName);
      else localStorageUpdateForSearch(elementName);
    }
    else app.dialog.alert('Please fill out the form first.', '');
  });
}