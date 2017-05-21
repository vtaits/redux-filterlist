import {connect} from 'react-redux'

import List from './List'

import {check} from './actions'

const mapStateToProps = () => ({})

const mapDispatchToProps = {
  check,
}

export default connect(mapStateToProps, mapDispatchToProps)(List)
