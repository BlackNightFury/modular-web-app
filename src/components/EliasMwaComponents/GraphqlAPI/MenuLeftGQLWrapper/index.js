import React from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'dva'
import { ListEliasInfo } from '@/graphql/queries'
import { getProjectFromEncoded } from '@/services/utils'

const Wrapper = WrappedComponent => ownProps => {
  const {
    user: { authenticated, tenantId, authenticatedBy },
    contentAreaNavigation: { project: projectNameEncoded },
  } = ownProps

  if (authenticated && authenticatedBy === 'demo') {
    const {
      prototype: { listEliasInfo: data },
    } = ownProps

    const projects = data.listProjects ? data.listProjects.items : []
    const project = getProjectFromEncoded(projects, projectNameEncoded)

    return <WrappedComponent {...ownProps} project={project} />
  }
  const InputComponent = compose(
    graphql(ListEliasInfo, {
      options: {
        fetchPolicy: 'cache-only',
        variables: { tenantId },
      },
      props: ({ data }) => {
        const projects = data.listProjects ? data.listProjects.items : []
        const project = getProjectFromEncoded(projects, projectNameEncoded)
        return {
          project,
        }
      },
    }),
  )(WrappedComponent)
  // The fact that we're returning the original input is a hint that it has
  // been mutated.
  return <InputComponent {...ownProps} />
}

const mapStateToProps = ({ user, prototype, contentAreaNavigation, settings }) => ({
  user,
  prototype,
  contentAreaNavigation,
  settings,
})

export default WrappedComponent => {
  class StoreWrapper extends React.Component {
    shouldComponentUpdate(nextProps) {
      const {
        contentAreaNavigation: { project: nextProject },
      } = nextProps
      const {
        contentAreaNavigation: { project: currProject },
      } = this.props
      if (nextProject === currProject) {
        return false
      }
      return true
    }

    render() {
      return Wrapper(WrappedComponent)(this.props)
    }
  }
  return connect(mapStateToProps)(StoreWrapper)
}
