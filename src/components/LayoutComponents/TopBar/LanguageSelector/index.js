import React from 'react'
import { setLocale, getLocale } from 'umi-plugin-locale/lib/locale'
import { Menu, Dropdown } from 'antd'
import styles from './style.scss'

class LanguageSelector extends React.Component {
  changeLang = ({ key }) => {
    setLocale(key)
  }

  render() {
    const selectedLocale = getLocale()
    const selectedLang = selectedLocale.substr(0, 2)

    const langMenu = (
      <Menu className={styles.menu} selectedKeys={[selectedLocale]} onClick={this.changeLang}>
        <Menu.Item key="en-US">
          <span role="img" aria-label="English" className="mr-2">
            🇬🇧
          </span>
          English
        </Menu.Item>
        <Menu.Item key="fr-FR">
          <span role="img" aria-label="French" className="mr-2">
            🇫🇷
          </span>
          French
        </Menu.Item>
        <Menu.Item key="ru-RU">
          <span role="img" aria-label="Русский" className="mr-2">
            🇷🇺
          </span>
          Русский
        </Menu.Item>
        <Menu.Item key="zh-CN">
          <span role="img" aria-label="简体中文" className="mr-2">
            🇨🇳
          </span>
          简体中文
        </Menu.Item>
      </Menu>
    )
    return (
      <Dropdown overlay={langMenu} trigger={['click']}>
        <div className={styles.dropdown}>
          <strong className="text-uppercase">{selectedLang}</strong>
        </div>
      </Dropdown>
    )
  }
}

export default LanguageSelector
