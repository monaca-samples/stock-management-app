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
      // Demo products for Catalog section
      products: [
        {
          id: '0',
          title: 'Apple iPhone 8',
          description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempora similique reiciendis, error nesciunt vero, blanditiis pariatur dolor, minima sed sapiente rerum, dolorem corrupti hic modi praesentium unde saepe perspiciatis.'
        },
        {
          id: '1',
          title: 'Apple iPhone 8 Plus',
          description: 'Velit odit autem modi saepe ratione totam minus, aperiam, labore quia provident temporibus quasi est ut aliquid blanditiis beatae suscipit odio vel! Nostrum porro sunt sint eveniet maiores, dolorem itaque!'
        },
        {
          id: '2',
          title: 'Apple iPhone X',
          description: 'Expedita sequi perferendis quod illum pariatur aliquam, alias laboriosam! Vero blanditiis placeat, mollitia necessitatibus reprehenderit. Labore dolores amet quos, accusamus earum asperiores officiis assumenda optio architecto quia neque, quae eum.'
        },
      ],
      // Demo shops for Shop List section
      shops: [
        {
          id: '0',
          name: 'Le Croissant Shinsaibashi',
          telephone: '06-6211-9603',
          address: '2 Chome-7-25 Shinsaibashisuji, Chuo Ward, Osaka, 542-0085',
          location: '2 Chome-1 Dogenzaka, Shibuya City, Tokyo 150-0043',
          products: 50
        },
        {
          id: '1',
          name: 'Rikuro’s cheese cake',
          telephone: '0120-572-132',
          address: '3 Chome-2-28 Nanba, Chuo Ward, Osaka, 542-0076',
          location: '2 Chome-1 Dogenzaka, Shibuya City, Tokyo 150-0043',
          products: 20
        },
        {
          id: '2',
          name: 'DAIWA KAEN',
          telephone: '06-6212-3566',
          address: '4 Chome-2-１番17 号 Nanba, Chuo Ward, Osaka, 542-0076',
          location: '2 Chome-1 Dogenzaka, Shibuya City, Tokyo 150-0043',
          products: 100
        }
      ]
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
    // Show shop-list.html within the home tab
    shoplist: function () {
      app.views.main.router.navigate({ name: 'shoplist' });
    },
    // Converts a form to a JSON object
    dataToJson: function (formIdName) {
      var formData = app.form.convertToData(formIdName);
      const jsonString = JSON.stringify(formData);
      const jsonObject = JSON.parse(jsonString);

      return jsonObject;
    },
    // Checks if the form has any empty entry
    isFormEmpty: function () {
      if (document.getElementById('shop-name').value == "" ||
        document.getElementById('shop-telephone').value == "" ||
        document.getElementById('shop-address').value == "" ||
        document.getElementById('shop-location').value == "")
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
  },
  // App routes
  routes: routes,
});

// Login Screen Demo
$$('#my-login-screen .login-button').on('click', function () {
  var username = $$('#my-login-screen [name="username"]').val();
  var password = $$('#my-login-screen [name="password"]').val();

  // Close login screen
  app.loginScreen.close('#my-login-screen');

  // Alert username and password
  app.dialog.alert('Username: ' + username + '<br>Password: ' + password);
});

// Get new shop data from form
$$(document).on('click', '.convert-form-to-data', function () {
  if (app.methods.isFormEmpty()) {
    const jsonObject = app.methods.dataToJson('#new-shop-form');

    const data = {
      'id': app.data.shops.length,
      'name': jsonObject.name,
      'telephone': jsonObject.telephone,
      'address': jsonObject.address
    }

    app.data.shops.push(data);
    app.methods.emptyNewShopForm();
    app.dialog.alert('Shop added to the shop list.', '');
  } else app.dialog.alert('Please fill out the form first.', '');
});

// Get shop details data
$$(document).on('click', '.get-shop-details-data', function () {
  var shopId = $$(this).data('shop-id');

  // Save the edited shop data
  $$(document).on('click', '.edited-shop-data', function () {
    if (app.methods.isFormEmpty()) {
      const jsonObject = app.methods.dataToJson('#edit-shop-form');

      app.data.shops[shopId].name = jsonObject.name;
      app.data.shops[shopId].telephone = jsonObject.telephone;
      app.data.shops[shopId].address = jsonObject.address;
      app.data.shops[shopId].location = jsonObject.location;

      app.dialog.alert('Saved shop details.', '');
    } else app.dialog.alert('Please fill out the form first.', '');
  });
});