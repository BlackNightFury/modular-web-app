import React from 'react'
import classNames from 'classnames'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'dva'
import { Icon, Select } from 'antd'
import styles from './style.scss'

const { Option } = Select

const mapStateToProps = ({ settings }) => ({
  isMobileMenuOpen: settings.isMobileMenuOpen,
  isMediumView: settings.isMediumView,
  screenSize: settings.screenSize,
})
@withRouter
@connect(mapStateToProps)
class Breadcrumbs extends React.Component {
  onToggleMenu = () => {
    const { isMediumView, dispatch, isMobileMenuOpen, isSecondary } = this.props
    if (isSecondary || !isMediumView) {
      return
    }

    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'isMobileMenuOpen',
        value: !isMobileMenuOpen,
      },
    })
  }

  dropdownClicked = value => {
    const { history, isTest } = this.props
    if (isTest) {
      return
    }
    history.push(value)
  }

  render() {
    const { breadcrumbs, isMobileMenuOpen, screenSize, isTest } = this.props
    const showDropdown = screenSize === 'sm' || screenSize === 'xs'
    return (
      <>
        <div
          className={classNames(styles.itemContainer, styles.home)}
          onClick={this.onToggleMenu}
          role="presentation"
        >
          <Link
            data-test-selector="home-link"
            to="/#"
            className={classNames('text-muted', styles.homeContainer)}
          >
            <Icon type="home" className={styles.home} />
          </Link>
          <Icon
            type={isMobileMenuOpen ? 'menu-fold' : 'menu-unfold'}
            className={styles.menuCollapse}
          />
        </div>
        {!showDropdown && (
          <div className={styles.breadcrumbItemContainer}>
            {breadcrumbs.map((breadcrumb, index) => (
              <div
                key={index}
                className={classNames(styles.itemContainer, {
                  [styles.noBorder]: index === breadcrumbs.length - 1,
                })}
                style={{
                  maxWidth:
                    index === breadcrumbs.length - 1
                      ? `${100 - (90 * (breadcrumbs.length - 1)) / breadcrumbs.length}%`
                      : `${90 / breadcrumbs.length}%`,
                }}
                data-test-selector="breadcrumb-text"
              >
                {index === breadcrumbs.length - 1 ? (
                  <span>{breadcrumb}</span>
                ) : (
                  <Link to={isTest ? '/' : breadcrumb.props.match.url}>{breadcrumb}</Link>
                )}
              </div>
            ))}
          </div>
        )}
        {showDropdown && breadcrumbs[0] && (
          <div className={styles.dropdownContainer}>
            <Select
              defaultValue={isTest ? breadcrumbs[0] : breadcrumbs[0].props.match.url}
              onChange={this.dropdownClicked}
            >
              {breadcrumbs.map((breadcrumb, index) => (
                <Option key={index} value={isTest ? breadcrumb : breadcrumb.props.match.url}>
                  {breadcrumb}
                </Option>
              ))}
              {!isTest && breadcrumbs[0].props.match.url !== '/data-collection/home' && (
                <Option value="/data-collection/home">Home</Option>
              )}
            </Select>
          </div>
        )}
      </>
    )
  }
}

export default Breadcrumbs
