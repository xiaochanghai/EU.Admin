import React, { Component } from 'react';
import { connect } from 'umi';
import TableList from './components/TableList'

let me;
class ivtransfersdetail extends Component {
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
      type: 'ivtransfersdetail/setTableStatus',
      payload: {},
    })
  }
  static changePage(current) {
    me.setState({ current })
  }
  render() {
    const { current } = this.state;
    return (
      <>
        {current}
      </>
    )
  }
}

export default connect(({ ivtransfersdetail }) => ({
  ivtransfersdetail,
  // loading: loading.effects['dashboardAndanalysis/fetch'],
}))(ivtransfersdetail);
