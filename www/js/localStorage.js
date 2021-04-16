/* - - - - - - - - - - - - - - - - -
   Methods for the localStorage
- - - - - - - - - - - - - - - - - - */
let addedShops = 0;
let addedProducts = 0;
let shopsCounter = 0;
let productsCounter = 0;

addedShops = localStorage.getItem("addedShops") > 0 ? localStorage.getItem("addedShops") : 0; 
addedProducts = localStorage.getItem("addedProducts") > 0 ? localStorage.getItem("addedProducts") : 0; 
shopsCounter = localStorage.getItem("addedShops") > 0 ? localStorage.getItem("addedShops") : 0; 
productsCounter = localStorage.getItem("addedProducts") > 0 ? localStorage.getItem("addedProducts") : 0; 

// Add new items to the Shop List
function addNewShopToLocalStorage(jsonObject) {
  let newShop = {
    name: jsonObject.name,
    telephone: jsonObject.telephone,
    address: jsonObject.address,
    location: jsonObject.location,
  };

  localStorage.setItem("Shop" + shopsCounter++, JSON.stringify(newShop));
  localStorage.setItem("addedShops", ++addedShops);
}

// Add new items to the Product List
function addNewProductToLocalStorage(jsonObject, imgSrc) {
  let Product = {
    code: jsonObject.code,
    name: jsonObject.name,
    price: jsonObject.price,
    quantity: jsonObject.quantity,
    shop: jsonObject.shop,
    image: imgSrc,
  };

  localStorage.setItem("Product" + productsCounter++, JSON.stringify(Product));
  localStorage.setItem("addedProducts", ++addedProducts);
}

// Uploading picture
function uploadImageToLocalStorage(fileName, img, edit) {
  let imageData = getImageDataURL(img);
  localStorage.setItem(fileName, imageData);

  if (edit) {
    app.dialog.alert("Saved product details.", "");
  } else {
    app.methods.emptyNewProductForm();
    document.getElementById("imageFile").src = "assets/pictures/camera.png";
  }
}

function getImageDataURL(img) {
  let canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  let context = canvas.getContext("2d");
  context.drawImage(img, 0, 0, 146, 146);

  let dataURL = canvas.toDataURL("image/jpg");
  return dataURL;
}

// To get the picture from the database
function getImageFromLocalStorage(jsonObject, pageName) {
  const DEFAULT = "assets/pictures/camera.png";
  try {
    let imageData = localStorage.getItem(jsonObject.code + jsonObject.shop + ".jpg");
    if (jsonObject.image != undefined) imageData = jsonObject.image;
    if (pageName == "EDIT")
      document.getElementById("imageFile").src = imageData;
    return imageData || DEFAULT;
  } catch (e) {
    return DEFAULT; // default picture if any error occured
  }
}

// Search by one filled field
const oneFieldSearchLocalStorage = (elementName, stringName, objectName) => {
  let result = "";
  let count = 0, found = 0;
  for (let i = 0; i < localStorage.getItem("addedProducts"); i++) {
    if (localStorage.getItem("Product" + i)) {
      const jsonObject = JSON.parse(localStorage.getItem("Product" + i));
      let imageSource = getImageFromLocalStorage(jsonObject, "PRODUCT");
      if (jsonObject.image != undefined) imageSource = jsonObject.image;
      if (jsonObject[objectName].includes(stringName)) {
        found++;
        result += `
        <div class="card-bg block block-strong inset">
          <p>Product Code: <span>${jsonObject.code}</span></p>
          <p>Name: <span>${jsonObject.name}</span></p>
          <p>Shop: <span>${jsonObject.shop}</span></p>
          <p>Price: <span>${jsonObject.price}</span></p>
          <p>Quantity: <span id="search-quantity">${jsonObject.quantity}</span></p>
          <div class="block display-flex justify-content-center">
            <img style="width:146px;height:146px" id="${jsonObject.code}_img" src="${imageSource}"/>
          </div>
          <div class="display-flex justify-content-center">
            <div class="stepper stepper-init stepper-small stepper-raised" data-value-el="#">
              <div id="minus" class="stepper-button-minus update-quantity-minus" data-quantity="${jsonObject.quantity}" data-product-id="${"Product" + i}"></div>
              <div id="plus" class="stepper-button-plus update-quantity-plus" data-quantity="${jsonObject.quantity}" data-product-id="${"Product" + i}"></div>
            </div>
          </div>   
        </div>`;
      }
    }
  }

  if(found == 0) 
    result += `
      <div class="card-bg block block-strong inset">
          <div class="display-flex justify-content-center">Product Not Found</div>
      </div>`;

  (countProductsInLocalStorage(elementName, count, result) != 0) ? 
  elementName.innerHTML = result : 
  countProductsInLocalStorage(elementName, count, result);
};

// Search by two filled field
const twoFieldSearchLocalStorage = (elementName, stringName, objectName, stringName2, objectName2) => {
  let count = 0, found = 0;
  let result = "";
  for (let i = 0; i < localStorage.getItem("addedProducts"); i++) {
    if (localStorage.getItem("Product" + i)) {
      const jsonObject = JSON.parse(localStorage.getItem("Product" + i));
      let imageSource = getImageFromLocalStorage(jsonObject, "PRODUCT");
      if (jsonObject.image != undefined) imageSource = jsonObject.image;
      if (jsonObject[objectName].includes(stringName) && stringName2 == jsonObject[objectName2]) {
        found++;
        result += `
        <div class="card-bg block block-strong inset">
          <p>Product Code: <span>${jsonObject.code}</span></p>
          <p>Name: <span>${jsonObject.name}</span></p>
          <p>Shop: <span>${jsonObject.shop}</span></p>
          <p>Price: <span>${jsonObject.price}</span></p>
          <p>Quantity: <span id="search-quantity">${jsonObject.quantity}</span></p>
          <div class="block display-flex justify-content-center">
            <img style="width:146px;height:146px" id="${jsonObject.code}_img" src="${imageSource}"/>
          </div>
         <div class="display-flex justify-content-center">
            <div class="stepper stepper-init stepper-small stepper-raised" data-value-el="#">
              <div id="minus" class="stepper-button-minus update-quantity-minus" data-quantity="${jsonObject.quantity}" data-product-id="${"Product" + i}"></div>
              <div id="plus" class="stepper-button-plus update-quantity-plus" data-quantity="${jsonObject.quantity}" data-product-id="${"Product" + i}"></div>
            </div>
          </div>   
        </div>`;
      }
    }
  }

  if(found == 0) 
  result += `
    <div class="card-bg block block-strong inset">
        <div class="display-flex justify-content-center">Product Not Found</div>
    </div>`;
  

  (countProductsInLocalStorage(elementName, count, result) != 0) ? 
  elementName.innerHTML = result : 
  countProductsInLocalStorage(elementName, count, result);
};

// Search by three filled field
const threeFieldSearchLocalStorage = (elementName, stringName, objectName, stringName2, objectName2, stringName3, objectName3) => {
  let count = 0, found = 0;
  let result = "";
  for (let i = 0; i < localStorage.getItem("addedProducts"); i++) {
    if (localStorage.getItem("Product" + i)) {
      const jsonObject = JSON.parse(localStorage.getItem("Product" + i));
      let imageSource = getImageFromLocalStorage(jsonObject, "PRODUCT");
      if (jsonObject.image != undefined) imageSource = jsonObject.image;
      if (jsonObject[objectName].includes(stringName) && stringName2 == jsonObject[objectName2] && stringName3 == jsonObject[objectName3]) {
        found++;
        result += `
        <div class="card-bg block block-strong inset">
          <p>Product Code: <span>${jsonObject.code}</span></p>
          <p>Name: <span>${jsonObject.name}</span></p>
          <p>Shop: <span>${jsonObject.shop}</span></p>
          <p>Price: <span>${jsonObject.price}</span></p>
          <p>Quantity: <span id="search-quantity">${jsonObject.quantity}</span></p>
          <div class="block display-flex justify-content-center">
            <img style="width:146px;height:146px" id="${jsonObject.code}_img" src="${imageSource}"/>
          </div>
         <div class="display-flex justify-content-center">
            <div class="stepper stepper-init stepper-small stepper-raised" data-value-el="#">
              <div id="minus" class="stepper-button-minus update-quantity-minus" data-quantity="${jsonObject.quantity}" data-product-id="${"Product" + i}"></div>
              <div id="plus" class="stepper-button-plus update-quantity-plus" data-quantity="${jsonObject.quantity}" data-product-id="${"Product" + i}"></div>
            </div>
          </div>   
        </div>`;
      } 
    }
  }

  if(found == 0) 
  result += `
    <div class="card-bg block block-strong inset">
        <div class="display-flex justify-content-center">Product Not Found</div>
    </div>`;

  (countProductsInLocalStorage(elementName, count, result) != 0) ? 
  elementName.innerHTML = result : 
  countProductsInLocalStorage(elementName, count, result);
};

// Update for the Search
const localStorageUpdateForSearch = (elementName) => {
  let count = 0;
  let result = "";
  const jsonObject = app.methods.dataToJson("#search-product-form");

  if(jsonObject.code == "" && jsonObject.name == "" && jsonObject.shop == "") 
    countProductsInLocalStorage(elementName, count, result);
  else if (jsonObject.code != "" && jsonObject.name == "" && jsonObject.shop == "") 
    oneFieldSearchLocalStorage(elementName, jsonObject.code, "code");
  else if (jsonObject.code == "" && jsonObject.name != "" && jsonObject.shop == "") 
    oneFieldSearchLocalStorage(elementName, jsonObject.name, "name");
  else if (jsonObject.code == "" && jsonObject.name == "" && jsonObject.shop != "") 
    oneFieldSearchLocalStorage(elementName, jsonObject.shop, "shop");
  else if (jsonObject.code != "" && jsonObject.name != "" && jsonObject.shop == "") 
    twoFieldSearchLocalStorage(elementName, jsonObject.name, "name", jsonObject.code, "code");
  else if (jsonObject.code != "" && jsonObject.name == "" && jsonObject.shop != "") 
    twoFieldSearchLocalStorage(elementName, jsonObject.code, "code", jsonObject.shop, "shop");
  else if (jsonObject.code == "" && jsonObject.name != "" && jsonObject.shop != "") 
    twoFieldSearchLocalStorage(elementName, jsonObject.name, "name", jsonObject.shop, "shop");
  else if (jsonObject.code != "" && jsonObject.name != "" && jsonObject.shop != "") 
    threeFieldSearchLocalStorage(elementName, jsonObject.name, "name", jsonObject.code, "code", jsonObject.shop, "shop");
};

function countProductsInLocalStorage(elementName, count, result) {
  for (let i = 0; i < localStorage.getItem("addedProducts"); i++) 
    if (localStorage.getItem("Product" + i)) 
      count++;

  if(count == 0)    
    result = `
      <div class="card-bg block block-strong inset">
        <div class="display-flex justify-content-center">There are no products added to the database.</div>
      </div>`;

    elementName.innerHTML = result;

    return count;
}

// Retrieve saved Shops from localStorage
function getShopsFromLocalStorage(elementName) {
  let count = 0;
  let result = "";

  for (let i = 0; i < localStorage.getItem("addedShops"); i++) {
    if (localStorage.getItem("Shop" + i)) {
      count++;
      const jsonObject = JSON.parse(localStorage.getItem("Shop" + i));
      result += `
        <div class=" card-bg block block-strong inset display-flex flex-direction-row">
          <div>
            <p>Name: <span>${jsonObject.name}</span></p>
            <p>Tel: <span>${jsonObject.telephone}</span></p>
            <p>Address: <span>${jsonObject.address}</span></p>
          </div>
          <div class="topright align-self-flex-start">
            <i class="icon f7-icons">
              <a href="/edit-shop/${"Shop" + i}/" data-shop-id="${"Shop" + i}" class="get-shop-details-data">pencil</a>
            </i>
          </div>
        </div>`;
    }
  }

  if (count == 0) {
    result += `
      <div class="card-bg block block-strong inset">
          <div class="item-inner display-flex justify-content-center">There are no shops added to the database.</div>
      </div>`;
  }

  elementName.innerHTML = result;
}

// Retrieve saved Products from localStorage
const getProductsFromLocalStorage = (elementName, pageName) => {
  let count = 0;
  let result = "";

  for (let i = 0; i < localStorage.getItem("addedProducts"); i++) {
    if (localStorage.getItem("Product" + i)) {
      count++;
      const jsonObject = JSON.parse(localStorage.getItem("Product" + i));
      let imageSource = getImageFromLocalStorage(jsonObject, pageName);
      if (jsonObject.image != undefined) imageSource = jsonObject.image;

      result += `
        <div class="card-bg block block-strong inset">
          <div class="display-flex justify-content-space-between">
            <div>
              <p>Product Code: <span>${jsonObject.code}</span></p>
              <p>Name: <span>${jsonObject.name}</span></p>
              <p>Shop: <span>${jsonObject.shop}</span></p>
              <p>Price: <span>${jsonObject.price}</span></p>
              <p>Quantity: <span">${jsonObject.quantity}</span></p>
            </div>
            <div class="topright align-self-flex-start">
              <i class="icon f7-icons">
                <a href="/edit-product/${"Product" + i}/" data-product-id="${"Product" + i}" class="get-product-details-data">pencil</a>
              </i>
            </div>
          </div>
          <div class="block display-flex justify-content-center">
        <div>`;
      if (pageName == "HOME")
        result += `<img style="width:146px;height:146px" id="${jsonObject.code}" src="${imageSource}">`;
      else if (pageName == "PRODUCT")
        result += `<img style="width:146px;height:146px" id="${jsonObject.code}_img" src="${imageSource}">`;
      result += `
            </div>
          </div>
          <div class="display-flex justify-content-center">
            <div class="stepper stepper-init stepper-small stepper-raised" data-value-el="#">
              <div id="minus" class="stepper-button-minus update-quantity-minus" data-quantity="${jsonObject.quantity}" data-product-id="${"Product" + i}"></div>
              <div id="plus" class="stepper-button-plus update-quantity-plus" data-quantity="${jsonObject.quantity}" data-product-id="${"Product" + i}"></div>
            </div>
          </div>   
        </div>`;
    }
  }

  if (count == 0) {
    result += `
      <div class="card-bg block block-strong inset">
        <div class="item-inner display-flex justify-content-center">There are no products added to the database.</div>
      </div>`;
  }

  elementName.innerHTML = result;
};