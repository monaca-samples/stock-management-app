
var routes = [
  {
    name: 'home',
    path: '/',
    url: './index.html',
  },
  {
    path: '/shop-list/',
    componentUrl: './pages/shop-list.html',
  },
    {
    path: '/shop-list-view/',
    componentUrl: './pages/shop-list-view.html',
  },
  {
    path: '/new-shop/',
    componentUrl: './pages/new-shop.html',
  },
  {
    path: '/edit-shop/:name/',
    componentUrl: './pages/edit-shop.html',
  },
  {
    path: '/product/:id/',
    componentUrl: './pages/product.html',
  },
  {
    path: '/product-list/',
    componentUrl: './pages/product-list.html',
  },
  {
    path: '/new-product/',
    componentUrl: './pages/new-product.html',
  },
  {
    path: '/search/',
    componentUrl: './pages/search.html',
  },
    {
    path: '/search-view/',
    componentUrl: './pages/search-view.html',
  },
  {
    path: '/search-result/',
    url: './pages/search-result.html',
  },
    {
    path: '/catalog/',
    componentUrl: './pages/catalog.html',
  },
  {
    path: '/dynamic-route/blog/:blogId/post/:postId/',
    componentUrl: './pages/dynamic-route.html',
  },
  {
    path: '/request-and-load/user/:userId/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = routeTo.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: 'Vladimir',
          lastName: 'Kharlampidi',
          about: 'Hello, i am creator of Framework7! Hope you like it!',
          links: [
            {
              title: 'Framework7 Website',
              url: 'http://framework7.io',
            },
            {
              title: 'Framework7 Forum',
              url: 'http://forum.framework7.io',
            },
          ]
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            componentUrl: './pages/request-and-load.html',
          },
          {
            context: {
              user: user,
            }
          }
        );
      }, 1000);
    },
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
