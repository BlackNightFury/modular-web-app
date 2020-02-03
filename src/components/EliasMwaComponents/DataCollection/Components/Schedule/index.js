import React from 'react'
import { Calendar, Badge } from 'antd'

class Schedule extends React.Component {
  static defaultProps = {
    data: [],
  }

  getListData = value => {
    const firstDay = value.toDate().getTime()

    const oneDay = 1000 * 60 * 60 * 24
    const { data } = this.props
    return data.filter(obj => {
      const secondDay = new Date(obj.date).getTime()
      return Math.floor((secondDay - firstDay) / oneDay) === 0
    })
  }

  dateCellRender = value => {
    const listData = this.getListData(value)
    return (
      <ul className="events">
        {listData.map(item => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    )
  }

  getMonthData = value => {
    if (value.month() === 8) {
      return 1394
    }
    return 0
  }

  render() {
    return (
      <Calendar
        rowKey="key"
        dateCellRender={this.dateCellRender}
        //monthCellRender={this.monthCellRender}
      />
    )
  }
}

export default Schedule
