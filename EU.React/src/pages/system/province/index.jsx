import React, { Component } from 'react';
import { connect } from 'umi';
import TableList from './components/TableList'

let me;
class province extends Component {
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
      type: 'province/setTableStatus',
      payload: {},
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

export default connect(({ province }) => ({
  province
  // loading: loading.effects['dashboardAndanalysis/fetch'],
}))(province);
