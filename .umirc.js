//ref: https://umijs.org/config/
import { join } from 'path'
import fs from 'fs'

export default {
  history: 'browser',
  sass: {},
  theme: 'src/theme.js',
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        locale: {
          enable: true,
          default: 'en-US',
          baseNavigator: true,
          antd: true,
        },
        antd: true,
        dva: {
          hmr: true,
        },
        dynamicImport: {
          loadingComponent: 'components/LayoutComponents/Loader',
        },
        pwa: {
          manifestOptions: {
            srcPath: '.pwa.json',
          },
          workboxPluginMode: 'InjectManifest',
          workboxOptions: {
            swSrc: './service-worker.js',
          },
        },
      },
    ],
    './scripts/get-config.js',
    './umi-plugins/entry.js',
    './umi-plugins/versioning.js',
    './umi-plugins/configuration.js',
  ],
  define: {
    Environment: 'int',
    Account: 'test',
    RedirectUrl: 'http://localhost:8000/azure',
  },
  devServer: {
    before: function(app, server) {
      app.get('/docs/:docId.pdf', function(req, res) {
        const { docId } = req.params
        const file = join(__dirname, `./etc/static_data/docs/${docId}.pdf`)
        try {
          var data = fs.readFileSync(file)
          res.contentType('application/pdf')
          res.send(data) // Set disposition and send it.
        } catch {
          res.send('<html>404 PDF NOT EXIST</html>')
        }
      })
    },
  },
}
