// babel.config.js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    [
      'babel-plugin-root-import',
      {
        paths: [
          {
            rootPathSuffix: './testing/integration/__mock__/elasticsearch',
            rootPathPrefix: '@/utils/elasticsearch',
          },
          {
            rootPathSuffix: './testing/integration/__mock__/user',
            rootPathPrefix: '@/services/user',
          },
          {
            rootPathSuffix: './src',
            rootPathPrefix: '@',
          },
          {
            rootPathSuffix: './testing/integration/__mock__',
            rootPathPrefix: '__mock__',
          },
          {
            rootPathSuffix: './node_modules',
            rootPathPrefix: 'node_modules',
          },
          {
            rootPathSuffix: './testing/integration/__mock__/link',
            rootPathPrefix: 'umi/link',
          },
          {
            rootPathSuffix: './testing/integration/__mock__/react-responsive-carousel',
            rootPathPrefix: 'react-responsive-carousel',
          },
          {
            rootPathSuffix: './testing/integration/__mock__/mock_router',
            rootPathPrefix: 'umi/router'
          },
          {
            rootPathSuffix: './node_modules/dva/router',
            rootPathPrefix: 'dva/router',
          },
          {
            rootPathSuffix: './testing/integration/__mock__/dva',
            rootPathPrefix: 'dva',
          },
          {
            rootPathSuffix: './node_modules/react-apollo/test-utils',
            rootPathPrefix: 'react-apollo/test-utils',
          },
          {
            rootPathSuffix: './testing/integration/__mock__/react-apollo',
            rootPathPrefix: 'react-apollo',
          },
          {
            rootPathSuffix: './testing/integration/__mock__/react-router-dom',
            rootPathPrefix: 'react-router-dom',
          },
        ],
      },
    ],
  ],
}
