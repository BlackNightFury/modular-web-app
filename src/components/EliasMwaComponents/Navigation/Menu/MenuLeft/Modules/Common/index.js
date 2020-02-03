import React from 'react'
import { Link } from 'dva/router'
import { Icon, Button } from 'antd'
import styles from './style.scss'

export const renderPanelHeader = (text, icon, dataTestSelector, isData) => (
  <div className={styles.main} data-test-selector={dataTestSelector}>
    <div className={styles.itemIconContainer}>
      <Icon type={icon} />
    </div>
    <span className={isData ? styles.slateGrey : styles.battleshipGrey}>{text}</span>
  </div>
)

export const renderIcon = (icon, bgColor, borderRadius) => {
  const iconStyles = {
    backgroundColor: bgColor || 'transparent',
    borderRadius: borderRadius || 0,
  }
  if (icon === 'empty-circle') {
    return (
      <i className="anticon" style={iconStyles}>
        <svg viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" />
        </svg>
      </i>
    )
  }
  return <Icon type={icon} style={iconStyles} />
}

export const renderDocLinks = docs => (
  <>
    {docs.map((doc, index) => (
      <a
        key={index}
        href={`/docs/${doc.id}.pdf`}
        target="_blank"
        rel="noopener noreferrer"
        data-test-selector="contextpanel_project_docs"
      >
        <span className={`${styles.smallIconContainer} ${styles.battleshipGrey}`}>
          {renderIcon('download')}
        </span>
        <span className={`${styles.smallIconAfterText} ${styles.slateGrey}`}>{doc.text}</span>
      </a>
    ))}
  </>
)

export const renderItemWithInfo = (text, icon, info, onClick, dataTestSelector) => (
  <div
    className={styles.itemContainer}
    onClick={onClick}
    role="presentation"
    data-test-selector={dataTestSelector}
  >
    <div className={styles.headerContainer}>
      {renderPanelHeader(text, icon, icon, true)}
      <div className={styles.info}>{info}</div>
    </div>
  </div>
)

export const renderItemWithChildren = (
  text,
  icon,
  dataTestSelector,
  children,
  additionalButton,
) => (
  <div className={styles.itemContainer} role="presentation" data-test-selector={dataTestSelector}>
    <div className={styles.headerContainer}>{renderPanelHeader(text, icon, icon, true)}</div>
    <div className={styles.detailContainer}>
      {children.map(
        (
          {
            type,
            icon: smIcon,
            text: smText,
            color,
            bgColor,
            borderRadius,
            id,
            to,
            onClick,
            testSelector,
          },
          key,
        ) => {
          switch (type) {
            case 'download':
              return (
                <div key={key} data-test-selector={testSelector}>
                  {renderDocLinks([{ text: smText, id }])}
                </div>
              )
            case 'internal-link':
              return (
                <Link to={to} key={key} onClick={onClick} data-test-selector={testSelector}>
                  <div>
                    <span className={`${styles.smallIconContainer} ${styles[color]}`}>
                      {renderIcon(smIcon, bgColor, borderRadius)}
                    </span>
                    <span className={`${styles.smallIconAfterText} ${styles[color]}`}>
                      {smText}
                    </span>
                  </div>
                </Link>
              )
            default:
              return null
          }
        },
      )}
      {additionalButton && !additionalButton.hide && (
        <Button
          onClick={additionalButton.onClick}
          className={styles.additionalButton}
          data-test-selector={additionalButton.testSelector}
        >
          {additionalButton.text}
        </Button>
      )}
    </div>
  </div>
)
