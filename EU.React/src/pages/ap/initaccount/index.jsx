// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import { connect } from 'umi';
// eslint-disable-next-line no-unused-vars

// eslint-disable-next-line no-unused-vars
import TableList from './components/TableList'
// eslint-disable-next-line no-unused-vars
import FormPage from './components/FormPage';

let me;
class apinitaccount extends Component {
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
      type: 'apinitaccount/setTableStatus',
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
export default connect(({ apinitaccount }) => ({
  apinitaccount
  // loading: loading.effects['dashboardAndanalysis/fetch'],
}))(apinitaccount);
