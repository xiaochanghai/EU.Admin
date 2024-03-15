import React, { Component } from 'react';
import { connect } from 'umi';
import TableList from './components/TableList'

let me;
class workflow extends Component {
  constructor(props) {
    super(props);
    me = this;
    me.state = {
      current: <TableList />
    };
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'workflow/setTableStatus',
      payload: {},
    })
    dispatch({
      type: 'workflow/setStructure',
      payload: null,
    })
  }
  static changePage(current) {
    me.setState({ current })
  }
  render() {
    const { current } = this.state;
    const pageComponent = current;
    return (
      <>
        {pageComponent}
      </>
    )
  }
}

export default connect(({ workflow }) => ({
  workflow,
  // loading: loading.effects['dashboardAndanalysis/fetch'],
}))(workflow);
