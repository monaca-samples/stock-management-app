var $$ = Dom7;

var app = new Framework7({
  root: '#app', // App root element

  name: 'framework7-core-tab-view', // App name
  theme: 'auto', // Automatic theme detection

  // Centering the navbar
  navbar: {
    mdCenterTitle: true,
    iosCenterTitle: true,
    auroraCenterTitle: true
  },

  // App root data
  data: function () {
    return {
      user: {
        firstName: 'John',
        lastName: 'Doe',
      },
    };
  },
  // App root methods
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
    // Show index.html within the home tab
    home: function () {
      app.views.main.router.navigate({ name: 'home' });
    },
    // Switching from a tab to home tab, it will show the current page of the home tab
    homeTab: function () {
      document.getElementById('home-tab').click();
    },
    homeTabAndHome: function () {
      document.getElementById('home-tab').click();
      app.views.main.router.navigate({ name: 'home' });
    },
    // Converts a form to a JSON object
    dataToJson: function (formIdName) {
      var formData = app.form.convertToData(formIdName);
      const jsonString = JSON.stringify(formData);
      const jsonObject = JSON.parse(jsonString);

      return jsonObject;
    },
    // Checks if the form (new shop) has any empty entry
    isFormEmpty: function () {
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
  },
  // App routes
  routes: routes,
});

// Variables
let db = null;
let shopId = null;

// PhoneGap
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
  console.log("PhoneGap is ready");
}

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
  if (app.methods.isFormEmpty()) {

    db.collection('shops').doc(shopId).update({
      name: document.getElementById('shop-name').value,
      telephone: document.getElementById('shop-telephone').value,
      address: document.getElementById('shop-address').value,
      location: document.getElementById('shop-location').value
    });

    app.dialog.alert('Saved shop details.', '');
  } else app.dialog.alert('Please fill out the form first.', '');
});

// Execute functions
initFirebase();