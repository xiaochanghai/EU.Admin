import React, { Component } from 'react';
import { connect } from 'umi';
import TableList from './components/TableList'
import FormPage from './components/FormPage';

let me;
class outorder extends Component {
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
      type: 'outorder/setTableStatus',
      payload: {},
    })
  }

  componentWillMount() {
    const tempRowId = localStorage.getItem("tempRowId");
    if (tempRowId) {
      localStorage.removeItem('tempRowId');
      me.setState({ current: <FormPage Id={tempRowId} IsView={true} /> })
    }
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

// eslint-disable-next-line no-shadow
export default connect(({ outorder }) => ({
  outorder
  // loading: loading.effects['dashboardAndanalysis/fetch'],
}))(outorder);
