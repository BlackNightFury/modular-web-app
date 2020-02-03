import React from 'react'

const defaultMapToProps = () => ({})

export const connect = (mapStateToProps, mapDispatchToProps) => {
  if (!mapStateToProps) {
    mapStateToProps = defaultMapToProps
  }
  if (!mapDispatchToProps) {
    mapDispatchToProps = defaultMapToProps
  }
  return WrappedComponent =>
    class extends React.Component {
      componentDidMount() {
        this.unsubscribe = store.subscribe(this.handleChange.bind(this))
      }

      componentWillUnmount() {
        this.unsubscribe()
      }

      handleChange() {
        this.forceUpdate()
      }

      render() {
        return (
          <WrappedComponent
            {...this.props}
            {...mapStateToProps(store.getState(), this.props)}
            {...mapDispatchToProps(store.dispatch, this.props)}
            {...store}
          />
        )
      }
    }
}

export default {}
