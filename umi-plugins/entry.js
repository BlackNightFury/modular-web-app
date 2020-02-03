import { join } from 'path'

export default function(api) {
  api.modifyEntryRender(() => {
    const memos = `const rootContainer = window.g_plugins.apply('rootContainer', {
    initialValue: React.createElement(require('${join(__dirname, '../src/entry/index')}').default,
    null,
    React.createElement(require('./router').default),),
  });
  ReactDOM.render(
    rootContainer,
    document.getElementById('root'),
  );`.trim()
    return memos
  })
}
