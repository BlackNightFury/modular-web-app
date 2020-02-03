import React from 'react'
import { connect } from 'dva'
import { Button } from 'antd'
import { Storage } from 'aws-amplify'
import fileSaver from 'file-saver'

import { updateStorage } from '@/services/utils'
import WarningCard from '@/components/EliasMwaComponents/DataCollection/Components/WarningCard'

import styles from './style.scss'

const { tenants, aws } = window.mwa_config

const mapStateToProps = ({ user, report }) => ({ user, report })

@connect(mapStateToProps)
class ExportMessagePanel extends React.Component {
  cancelDownload = report => () => {
    const { dispatch } = this.props
    dispatch({
      type: 'report/REPORT_CANCEL',
      payload: {
        id: report.id,
      },
    })
  }

  hideReportGenerating = report => () => {
    const { dispatch } = this.props
    dispatch({
      type: 'report/REPORT_GENERATING_HIDE',
      payload: {
        id: report.reportDetails.id,
      },
    })
  }

  downloadReport = report => () => {
    const {
      reportDetails: { name },
      report: { key },
    } = report
    const {
      user: { tenantId },
    } = this.props

    this.cancelDownload(report)()
    updateStorage(tenants[tenantId], aws.project_region)
    Storage.get(key.replace('public/', ''), { download: true, level: 'public' }).then(response => {
      const arrayBufferView = new Uint8Array(response.Body)
      const blob = new Blob([arrayBufferView], { type: response.ContentType })
      fileSaver.saveAs(blob, name)
    })
  }

  renderReportCard = report => {
    const { id, type, isGenerating, isGenerated, isHidden } = report
    switch (type) {
      case 'EXPORT_CAFM':
        if (isGenerating && !isGenerated && !isHidden) {
          return (
            <WarningCard
              key={id}
              message="Export CAFM"
              type="info"
              description="Your CAFM import is being generated. You will receive an update when it is ready for download"
              dataTestSelector="report-generating-card"
              onClose={this.hideReportGenerating(report)}
              closable
              show
              showIcon
            />
          )
        }
        if (!isGenerating && isGenerated) {
          return (
            <WarningCard
              key={id}
              message="Export CAFM"
              type="success"
              description={
                <div>
                  Your CAFM import is ready for download.
                  <div className={styles.reportActionContainer}>
                    <Button
                      data-test-selector="cancel-export-btn"
                      onClick={this.cancelDownload(report)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className={`primary-btn ${styles.downloadReport}`}
                      data-test-selector="download-export-btn"
                      onClick={this.downloadReport(report)}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              }
              dataTestSelector="report-success-card"
              show
              showIcon
            />
          )
        }

        return <></>
      default:
        return <></>
    }
  }

  render() {
    const {
      report: { reports },
    } = this.props
    const reversedReports = reports.reverse()
    return reversedReports.map(report => this.renderReportCard(report))
  }
}

export default ExportMessagePanel
