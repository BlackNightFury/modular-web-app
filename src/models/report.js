const initialValues = {
  reports: [],
}

export default {
  namespace: 'report',
  state: initialValues,
  reducers: {
    SET_STATE: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
  },
  effects: {
    *REPORT_GENERATION_START({ payload }, saga) {
      const { id } = payload
      const {
        report: { reports },
      } = window.g_app._store.getState()
      if (!reports.find(report => report.id === id)) {
        yield saga.put({
          type: 'SET_STATE',
          payload: {
            reports: [...reports, { ...payload, isGenerating: true, isGenerated: false }],
          },
        })
      }
    },
    *REPORT_GENERATION_FINISH({ payload }, saga) {
      const {
        reportDetails: { id },
      } = payload
      const {
        report: { reports },
      } = window.g_app._store.getState()
      const completedReportIndex = reports.findIndex(item => item.id === id)
      if (completedReportIndex < 0) {
        return
      }

      const completedReport = reports[completedReportIndex]
      if (completedReport.isGenerating && !completedReport.isGenerated) {
        reports.splice(completedReportIndex, 1)
        yield saga.put({
          type: 'SET_STATE',
          payload: {
            reports: [
              ...reports,
              { ...completedReport, ...payload, isGenerating: false, isGenerated: true },
            ],
          },
        })
      }
    },
    *REPORT_CANCEL({ payload }, saga) {
      const { id } = payload
      const {
        report: { reports },
      } = window.g_app._store.getState()

      const newReports = reports.filter(report => report.reportDetails.id !== id)
      yield saga.put({
        type: 'SET_STATE',
        payload: {
          reports: newReports,
        },
      })
    },
    *REPORT_GENERATING_HIDE({ payload }, saga) {
      const { id } = payload
      const {
        report: { reports },
      } = window.g_app._store.getState()

      const reportIndex = reports.findIndex(report => report.id === id)
      if (reportIndex > -1) {
        reports[reportIndex].isHidden = true
      }
      yield saga.put({
        type: 'SET_STATE',
        payload: {
          reports,
        },
      })
    },
  },
}
