
const routes = [
  {
    name: 'home',
    path: '/',
    url: './index.html',
  },
  {
    path: '/search-view/',
    componentUrl: './pages/search-view.html',
  },
  {
    path: '/shop-list-view/',
    componentUrl: './pages/shop-list-view.html',
  },
  {
    path: '/shop-list/',
    componentUrl: './pages/shop-list.html',
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
    path: '/product-list/',
    componentUrl: './pages/product-list.html',
  },
  {
    path: '/new-product/',
    componentUrl: './pages/new-product.html',
  },
  {
    path: '/edit-product/:name/',
    componentUrl: './pages/edit-product.html',
  },
  {
    path: '/search/',
    componentUrl: './pages/search.html',
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
