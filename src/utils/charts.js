import _ from 'lodash'
import colors from '@/assets/colors'

const SI_POSTFIXES = ['', 'k', 'M', 'G', 'T', 'P', 'E']

export const formatNumber = number => {
  if (!number) return 0
  // what tier? (determines SI prefix)
  const tier = number !== 0 ? Math.floor(Math.log10(Math.abs(number)) / 3) : 0

  // if zero, we don't need a prefix
  if (tier === 0) return number

  // get postfix and determine scale
  const postfix = SI_POSTFIXES[tier]
  const scale = 10 ** (tier * 3)

  // scale the number
  const scaled = number / scale

  // format number and add postfix as suffix
  let formatted = String(scaled.toFixed(1))

  // remove '.0' case
  if (/\.0$/.test(formatted)) formatted = formatted.substr(0, formatted.length - 2)

  return formatted + postfix
}

export const generateBarChartConfig = data => ({
  chart: {
    type: 'column',
  },
  credits: {
    enabled: false,
  },
  title: {
    text: '',
  },
  xAxis: {
    type: 'category',
    title: {
      text: 'User',
    },
  },
  yAxis: {
    title: {
      text: 'Count',
    },
  },
  legend: {
    enabled: false,
  },
  tooltip: {
    formatter() {
      return `Count: <b>${this.key}</b><br>User: <b>${this.y}</b>`
    },
  },
  series: [
    {
      name: 'Population',
      data: _.keys(data).map(key => [key, data[key]]),
    },
  ],
})

export const generatePieChartConfig = data => ({
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: 'pie',
  },
  credits: {
    enabled: false,
  },
  title: {
    text: '',
  },
  tooltip: {
    pointFormat: '<b>{point.y}({point.percentage:.1f}%)</b>',
  },
  legend: {
    align: 'right',
    verticalAlign: 'top',
    layout: 'vertical',
    x: 0,
    y: 100,
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: false,
      },
      showInLegend: true,
      innerSize: '70%',
    },
  },
  series: [
    {
      name: 'Brands',
      colorByPoint: true,
      borderWidth: 5,
      data: _.keys(data).map(key => ({
        name: key,
        y: data[key],
      })),
    },
  ],
})

export const generateConditionByFacilityChartConfig = (
  facilityNames,
  conditions,
  assetsByConditionAndFacility,
) => ({
  chart: {
    type: 'column',
    style: {
      fontFamily: 'lato',
    },
  },
  credits: {
    enabled: false,
  },
  exporting: {
    enabled: false,
  },
  title: {
    text: 'Asset Condition By Facility',
    style: { color: colors['battleship-grey'] },
  },
  xAxis: {
    categories: facilityNames,
    title: {
      style: { color: colors['battleship-grey'] },
    },
    labels: {
      style: { color: colors['battleship-grey'] },
    },
    crosshair: true,
  },
  yAxis: {
    min: 0,
    title: {
      text: 'Number of assets',
      style: { color: colors['battleship-grey'] },
    },
    labels: {
      style: { color: colors['battleship-grey'] },
    },
  },
  tooltip: {
    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
    pointFormat:
      '<tr><td style="padding:0">{series.name}: </td>' +
      '<td style="padding:0"><b>{point.y:.1f} assets</b></td></tr>',
    footerFormat: '</table>',
    shared: true,
    useHTML: true,
  },
  legend: {
    itemStyle: { color: colors['battleship-grey'] },
  },
  plotOptions: {
    column: {
      pointPadding: 0,
      borderWidth: 1,
    },
  },
  series: conditions.map((condition, idx) => ({
    name: condition,
    color:
      colors[['link-blue', 'blue', 'slate-grey', 'sky-grey', 'leading-pink', 'error-pink'][idx]],
    data: assetsByConditionAndFacility[idx],
  })),
})

export const generateAssetReplacementCostsGroupedByFacilityChartConfig = assetsGroupedByFacility => {
  const categories = []
  for (let i = 0; i < 10; i += 1) {
    categories.push(new Date().getFullYear() + i)
  }
  const series = []
  for (let i = 0; i < assetsGroupedByFacility.length; i += 1) {
    const facility = assetsGroupedByFacility[i]
    const serie = {
      name: facility.name,
      color: colors[['slate-grey', 'battleship-grey', 'sky-grey', 'sage'][i % 4]],
      data: categories.map((yr, index) => {
        if (index === 0) {
          return _.keys(facility.years)
            .filter(year => year <= yr)
            .reduce((result, year) => {
              result += facility.years[year]
              return result
            }, 0)
        }
        return facility.years[yr.toString()] || 0
      }),
    }
    if (i === 0) {
      serie.color = colors.blue
    } else if (i === assetsGroupedByFacility.length - 1) {
      serie.color = colors['link-blue']
    }

    series.push(serie)
  }

  categories.splice(0, 1, 'Backlog')

  return {
    chart: {
      type: 'column',
      style: { fontFamily: 'lato' },
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },

    title: {
      text: 'Asset Replacement Cost Facility By Year | 10 years',
      style: { color: colors['battleship-grey'] },
    },
    xAxis: {
      categories,
      style: {
        color: colors['battleship-grey'],
        textOutline: false,
      },
    },
    yAxis: {
      allowDecimals: false,
      min: 0,
      title: {
        text: 'Replacement cost £ (GBP)',
        style: { color: colors['battleship-grey'] },
      },
      labels: {
        style: { color: colors['battleship-grey'] },
      },
      stackLabels: {
        enabled: false,
        verticalAlign: 'top',
        crop: false,
        //overflow: 'none',
        y: -5,
        formatter() {
          return this.stack
        },
        style: {
          color: colors['battleship-grey'],
          textOutline: false,
        },
      },
    },
    tooltip: {
      formatter() {
        return `<b>${this.x}</b><br/>${this.series.name}: £${this.y}<br/>Total: £${this.point.stackTotal}`
      },
    },
    legend: {
      enabled: true,
      itemStyle: { color: colors['battleship-grey'] },
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: false,
        },
      },
    },
    series,
  }
}

export const generateAssetsBySystemAndTypeChartConfig = (data, onPress) => {
  const series = data.map((obj, index) => ({
    name: obj.key,
    color: ['#6AAAE6', '#BADAF9', '#748595', '#ABBAC7', '#DAE3E5', '#DBDFE5'][index],
    cursor: 'pointer',
    data: obj.subTypes.map(subTypeObj => ({
      name: subTypeObj.key,
      value: subTypeObj.doc_count,
      assetType: subTypeObj.assetType,
    })),
    events: { click: onPress },
  }))
  return {
    chart: {
      type: 'packedbubble',
      height: '80%',
      style: { fontFamily: 'lato' },
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
    title: {
      text: 'Assets By System And Type',
      style: { color: '#ABBAC7' },
    },
    tooltip: {
      useHTML: true,
      pointFormat: '<b>{point.name}:</b> {point.value} assets</sub>',
    },
    legend: {
      itemStyle: { color: '#ABBAC7' },
      alignValue: 'center',
    },
    plotOptions: {
      packedbubble: {
        minSize: '25%',
        maxSize: '100%',
        zMin: 0,
        zMax: 1000,
        layoutAlgorithm: {
          gravitationalConstant: 0.05,
          splitSeries: true,
          seriesInteraction: false,
          dragBetweenSeries: true,
          parentNodeLimit: true,
        },
        dataLabels: {
          enabled: true,
          format: '{point.name}',
          filter: {
            property: 'y',
            operator: '>',
            value: 20,
          },
          style: {
            color: '#748595',
            textOutline: 'none',
            fontWeight: 'normal',
          },
        },
      },
    },
    series,
  }
}

export const generateAssetReplacementCostsByPriorityChartConfig = assetCostsByPriority => {
  const categories = []
  for (let i = 0; i < 10; i += 1) {
    categories.push(new Date().getFullYear() + i)
  }
  categories.splice(0, 1, 'Backlog')
  const series = []
  Object.keys(assetCostsByPriority).forEach(key => {
    const serie = {
      name: assetCostsByPriority[key].name,
      color: assetCostsByPriority[key].color,
      data: categories.map(yr => 0), //eslint-disable-line no-unused-vars
    }
    const currentYear = new Date().getFullYear()
    for (let i = 0; i < 10; i += 1) {
      const cost = assetCostsByPriority[key].simpleReplacementCost.find(
        item => item.key === currentYear + i,
      )
      if (cost) {
        serie.data[i] = cost.replacement.value
      }
    }
    series.push(serie)
  })

  return {
    chart: {
      type: 'area',
      style: { fontFamily: 'lato' },
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
    title: {
      text: 'Asset replacement cost by priority | 10 years',
      style: { color: colors['battleship-grey'] },
    },
    xAxis: {
      categories,
      title: {
        style: { color: colors['battleship-grey'] },
      },
      labels: {
        style: { color: colors['battleship-grey'] },
      },
    },
    yAxis: {
      title: {
        text: 'Replacement cost £ (GBP)',
        style: { color: colors['battleship-grey'] },
      },
      labels: {
        style: { color: colors['battleship-grey'] },
      },
    },
    tooltip: {
      shared: true,
      useHTML: true,
      valueDecimals: 2,
      valuePrefix: '£',
      valueSuffix: ' GBP',
    },
    legend: {
      itemStyle: { color: colors['battleship-grey'] },
    },
    plotOptions: {
      area: {
        stacking: 'normal',
        fillOpacity: 0.2,
      },
    },
    series,
  }
}
