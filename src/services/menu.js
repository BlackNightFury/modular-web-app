import _ from 'lodash'

export async function getLeftMenuData() {
  return [
    {
      title: 'Home',
      key: 'home',
    },
    {
      title: 'Settings',
      key: 'settings',
      icon: 'icmn icmn-cog utils__spin-delayed--pseudo-selector',
    },
    {
      title: 'Documentation',
      key: 'documentation',
      url: 'https://docs.cleanuitemplate.com/react/getting-started',
      target: '_blank',
      icon: 'icmn icmn-books',
    },
    {
      divider: true,
    },
    {
      title: 'Dashboard Alpha',
      key: 'dashboardAlpha',
      url: '/original-template/dashboard/alpha',
      icon: 'icmn icmn-home',
    },
    {
      title: 'Dashboard Beta',
      key: 'dashboardBeta',
      url: '/original-template/dashboard/beta',
      icon: 'icmn icmn-home',
    },
    {
      title: 'Dashboard Crypto',
      key: 'dashboardCrypto',
      url: '/original-template/dashboard/crypto',
      icon: 'icmn icmn-home',
    },
    {
      title: 'Dashboard Gamma',
      key: 'dashboardGamma',
      url: '/original-template/dashboard/gamma',
      icon: 'icmn icmn-home',
    },
    {
      divider: true,
    },
    {
      title: 'AntDesign Components',
      key: 'antComponents',
      icon: 'icmn icmn-menu',
      url: '/original-template/antd',
    },
    {
      divider: true,
    },
    {
      title: 'Default Pages',
      key: 'defaultPages',
      icon: 'icmn icmn-file-text',
      children: [
        {
          key: 'loginAlpha',
          title: 'Login Alpha',
          url: '/original-template/pages/login-alpha',
        },
        {
          key: 'loginBeta',
          title: 'Login Beta',
          url: '/original-template/pages/login-beta',
        },
        {
          key: 'register',
          title: 'Register',
          url: '/original-template/pages/register',
        },
        {
          key: 'lockscreen',
          title: 'Lockscreen',
          url: '/original-template/pages/lockscreen',
        },
        {
          key: 'pricingTable',
          title: 'Pricing Table',
          url: '/original-template/pages/pricing-table',
        },
        {
          key: 'invoice',
          title: 'Invoice',
          url: '/original-template/pages/invoice',
        },
      ],
    },
    {
      title: 'Charts',
      key: 'charts',
      icon: 'icmn icmn-stats-bars',
      children: [
        {
          title: 'Chartist',
          key: 'chartist',
          url: '/original-template/charts/chartist',
        },
        {
          title: 'Chart',
          key: 'chart',
          url: '/original-template/charts/chart',
        },
        {
          title: 'Peity',
          key: 'peity',
          url: '/original-template/charts/peity',
        },
        {
          title: 'C3',
          key: 'c3',
          url: '/original-template/charts/c3',
        },
      ],
    },
    {
      title: 'Mail Templates',
      key: 'mailTemplates',
      url: '/original-template/layout/mail-templates',
      icon: 'icmn icmn-envelop',
    },
    {
      divider: true,
    },
    {
      title: 'Apps',
      key: 'apps',
      icon: 'icmn icmn-database',
      children: [
        {
          title: 'Messaging',
          key: 'messaging',
          url: '/original-template/apps/messaging',
        },
        {
          title: 'Mail',
          key: 'mail',
          url: '/original-template/apps/mail',
        },
        {
          title: 'Profile',
          key: 'profile',
          url: '/original-template/apps/profile',
        },
        {
          title: 'Gallery',
          key: 'gallery',
          url: '/original-template/apps/gallery',
        },
      ],
    },
    {
      title: 'Ecommerce',
      key: 'ecommerce',
      icon: 'icmn icmn-cart',
      children: [
        {
          title: 'Dashboard',
          key: 'dashboard',
          url: '/original-template/ecommerce/dashboard',
        },
        {
          title: 'Products Catalog',
          key: 'productsCatalog',
          url: '/original-template/ecommerce/products-catalog',
        },
        {
          title: 'Products Details',
          key: 'productsDetails',
          url: '/original-template/ecommerce/product-details',
        },
        {
          title: 'Products Edit',
          key: 'productsEdit',
          url: '/original-template/ecommerce/product-edit',
        },
        {
          title: 'Products List',
          key: 'productsList',
          url: '/original-template/ecommerce/products-list',
        },
        {
          title: 'Orders',
          key: 'orders',
          url: '/original-template/ecommerce/orders',
        },
        {
          title: 'Cart',
          key: 'cart',
          url: '/original-template/ecommerce/cart',
        },
      ],
    },
    {
      title: 'Blog',
      key: 'blog',
      icon: 'icmn icmn-wordpress',
      children: [
        {
          title: 'Feed',
          key: 'blogFeed',
          url: '/original-template/blog/feed',
        },
        {
          title: 'Post',
          key: 'blogPost',
          url: '/original-template/blog/post',
        },
        {
          title: 'Add Post',
          key: 'blogAddPost',
          url: '/original-template/blog/add-blog-post',
        },
      ],
    },
    {
      title: 'YouTube',
      key: 'youtube',
      icon: 'icmn icmn-youtube',
      children: [
        {
          title: 'Feed',
          key: 'youtubeFeed',
          url: '/original-template/youtube/feed',
        },
        {
          title: 'View',
          key: 'youtubeView',
          url: '/original-template/youtube/view',
        },
      ],
    },
    {
      title: 'GitHub',
      key: 'github',
      icon: 'icmn icmn-github',
      children: [
        {
          title: 'Explore',
          key: 'githubExplore',
          url: '/original-template/github/explore',
        },
        {
          title: 'Discuss',
          key: 'githubDiscuss',
          url: '/original-template/github/discuss',
        },
      ],
    },
    {
      divider: true,
    },
    {
      title: 'Icons',
      key: 'icons',
      icon: 'icmn icmn-star-full',
      children: [
        {
          title: 'FontAwesome',
          key: 'fontAwesome',
          url: '/original-template/icons/fontawesome',
        },
        {
          title: 'Linear',
          key: 'linear',
          url: '/original-template/icons/linear',
        },
        {
          title: 'Icomoon',
          key: 'icoMoon',
          url: '/original-template/icons/icomoon',
        },
      ],
    },
    {
      title: 'Bootstrap Grid',
      key: 'bootstrap',
      url: '/original-template/layout/bootstrap',
      icon: 'icmn icmn-html-five',
    },
    {
      title: 'Bootstrap Card',
      key: 'card',
      url: '/original-template/layout/card',
      icon: 'icmn icmn-stack',
    },
    {
      title: 'Typography',
      key: 'typography',
      url: '/original-template/layout/typography',
      icon: 'icmn icmn-font-size',
    },
    {
      title: 'Utilities',
      key: 'utilities',
      url: '/original-template/layout/utilities',
      icon: 'icmn icmn-magic-wand',
    },
    {
      divider: true,
    },
    {
      title: 'Nested Items',
      key: 'nestedItem1',
      disabled: true,
      icon: 'icmn icmn-arrow-down2',
      children: [
        {
          title: 'Nested Item 1-1',
          key: 'nestedItem1-1',
          children: [
            {
              title: 'Nested Item 1-1-1',
              key: 'nestedItem1-1-1',
            },
            {
              title: 'Nested Items 1-1-2',
              key: 'nestedItem1-1-2',
              disabled: true,
            },
          ],
        },
        {
          title: 'Nested Items 1-2',
          key: 'nestedItem1-2',
        },
      ],
    },
    {
      title: 'Disabled Item',
      key: 'disabledItem',
      disabled: true,
      icon: 'icmn icmn-cancel-circle',
    },
  ]
}
export async function getTopMenuData() {
  return [
    {
      title: 'Settings',
      key: 'settings',
      icon: 'icmn icmn-cog utils__spin-delayed--pseudo-selector',
    },
    {
      title: 'Docs',
      key: 'documentation',
      url: 'https://docs.cleanuitemplate.com/react/getting-started',
      target: '_blank',
      icon: 'icmn icmn-books',
    },
    {
      title: 'Dashboards',
      key: 'dashboards',
      icon: 'icmn icmn-stack',
      children: [
        {
          title: 'Dashboard Alpha',
          key: 'dashboardAlpha',
          url: '/original-template/dashboard/alpha',
        },
        {
          title: 'Dashboard Beta',
          key: 'dashboardBeta',
          url: '/original-template/dashboard/beta',
        },
        {
          title: 'Dashboard Crypto',
          key: 'dashboardCrypto',
          url: '/original-template/dashboard/crypto',
        },
        {
          title: 'Dashboard Gamma',
          key: 'dashboardGamma',
          url: '/original-template/dashboard/gamma',
        },
      ],
    },
    {
      title: 'AntDesign Components',
      key: 'antComponents',
      icon: 'icmn icmn-menu',
      url: '/original-template/antd',
    },
    {
      title: 'Apps',
      key: 'apps',
      icon: 'icmn icmn-star-full',
      children: [
        {
          title: 'Messaging',
          key: 'messaging',
          url: '/original-template/apps/messaging',
        },
        {
          title: 'Mail',
          key: 'mail',
          url: '/original-template/apps/mail',
        },
        {
          title: 'Profile',
          key: 'profile',
          url: '/original-template/apps/profile',
        },
        {
          title: 'Gallery',
          key: 'gallery',
          url: '/original-template/apps/gallery',
        },
        {
          title: 'Ecommerce',
          key: 'ecommerce',
          children: [
            {
              title: 'Dashboard',
              key: 'dashboard',
              url: '/original-template/ecommerce/dashboard',
            },
            {
              title: 'Products Catalog',
              key: 'productsCatalog',
              url: '/original-template/ecommerce/products-catalog',
            },
            {
              title: 'Products Details',
              key: 'productsDetails',
              url: '/original-template/ecommerce/product-details',
            },
            {
              title: 'Products Edit',
              key: 'productsEdit',
              url: '/original-template/ecommerce/product-edit',
            },
            {
              title: 'Products List',
              key: 'productsList',
              url: '/original-template/ecommerce/products-list',
            },
            {
              title: 'Orders',
              key: 'orders',
              url: '/original-template/ecommerce/orders',
            },
            {
              title: 'Cart',
              key: 'cart',
              url: '/original-template/ecommerce/cart',
            },
          ],
        },
        {
          title: 'Blog',
          key: 'blog',
          children: [
            {
              title: 'Feed',
              key: 'blogFeed',
              url: '/original-template/blog/feed',
            },
            {
              title: 'Post',
              key: 'blogPost',
              url: '/original-template/blog/post',
            },
            {
              title: 'Add Post',
              key: 'blogAddPost',
              url: '/original-template/blog/add-blog-post',
            },
          ],
        },
        {
          title: 'YouTube',
          key: 'youtube',
          children: [
            {
              title: 'Feed',
              key: 'youtubeFeed',
              url: '/original-template/youtube/feed',
            },
            {
              title: 'View',
              key: 'youtubeView',
              url: '/original-template/youtube/view',
            },
          ],
        },
        {
          title: 'GitHub',
          key: 'github',
          children: [
            {
              title: 'Explore',
              key: 'githubExplore',
              url: '/original-template/github/explore',
            },
            {
              title: 'Discuss',
              key: 'githubDiscuss',
              url: '/original-template/github/discuss',
            },
          ],
        },
      ],
    },
    {
      title: 'Pages & Blocks',
      key: 'pagesBlocks',
      icon: 'icmn icmn-stack',
      children: [
        {
          title: 'Default Pages',
          key: 'defaultPages',
          children: [
            {
              key: 'loginAlpha',
              title: 'Login Alpha',
              url: '/original-template/pages/login-alpha',
            },
            {
              key: 'loginBeta',
              title: 'Login Beta',
              url: '/original-template/pages/login-beta',
            },
            {
              key: 'register',
              title: 'Register',
              url: '/original-template/pages/register',
            },
            {
              key: 'lockscreen',
              title: 'Lockscreen',
              url: '/original-template/pages/lockscreen',
            },
            {
              key: 'pricingTable',
              title: 'Pricing Table',
              url: '/original-template/pages/pricing-table',
            },
            {
              key: 'invoice',
              title: 'Invoice',
              url: '/original-template/pages/invoice',
            },
          ],
        },
        {
          title: 'Charts',
          key: 'charts',
          children: [
            {
              title: 'Chartist',
              key: 'chartist',
              url: '/original-template/charts/chartist',
            },
            {
              title: 'Chart',
              key: 'chart',
              url: '/original-template/charts/chart',
            },
            {
              title: 'Peity',
              key: 'peity',
              url: '/original-template/charts/peity',
            },
            {
              title: 'C3',
              key: 'c3',
              url: '/original-template/charts/c3',
            },
          ],
        },
        {
          title: 'Mail Templates',
          key: 'mailTemplates',
          url: '/original-template/layout/mail-templates',
        },
        {
          title: 'Icons',
          key: 'icons',
          children: [
            {
              title: 'FontAwesome',
              key: 'fontAwesome',
              url: '/original-template/icons/fontawesome',
            },
            {
              title: 'Linear',
              key: 'linear',
              url: '/original-template/icons/linear',
            },
            {
              title: 'Icomoon',
              key: 'icoMoon',
              url: '/original-template/icons/icomoon',
            },
          ],
        },
        {
          title: 'Bootstrap Grid',
          key: 'bootstrap',
          url: '/original-template/layout/bootstrap',
        },
        {
          title: 'Bootstrap Card',
          key: 'card',
          url: '/original-template/layout/card',
        },
        {
          title: 'Typography',
          key: 'typography',
          url: '/original-template/layout/typography',
        },
        {
          title: 'Utilities',
          key: 'utilities',
          url: '/original-template/layout/utilities',
        },
        {
          title: 'Nested Items',
          key: 'nestedItem1',
          disabled: true,
          children: [
            {
              title: 'Nested Item 1-1',
              key: 'nestedItem1-1',
              children: [
                {
                  title: 'Nested Item 1-1-1',
                  key: 'nestedItem1-1-1',
                },
                {
                  title: 'Nested Items 1-1-2',
                  key: 'nestedItem1-1-2',
                  disabled: true,
                },
              ],
            },
            {
              title: 'Nested Items 1-2',
              key: 'nestedItem1-2',
            },
          ],
        },
        {
          title: 'Disabled Item',
          key: 'disabledItem',
          disabled: true,
        },
      ],
    },
  ]
}

// Only work for array of arrays
export const cartesianProductOf = (products, result, currentPosition, currentPermutation) => {
  if (currentPosition === products.length) {
    return
  }

  const curProduct = products[currentPosition]
  _.forEach(curProduct, product => {
    currentPermutation = currentPermutation.concat([product])
    result.push(currentPermutation)
    cartesianProductOf(products, result, currentPosition + 1, currentPermutation)
    currentPermutation = currentPermutation.slice(0, currentPermutation.length - 1)
  })
}
