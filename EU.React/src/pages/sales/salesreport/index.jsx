import React, { Component } from 'react';
import { connect } from 'umi';
import TableList from './components/TableList'

let me;
class sdsalesreport extends Component {
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
      type: 'sdsalesreport/setTableStatus',
      payload: {},
    })
  }

  // componentWillMount() {
  //        }

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
export default connect(({ sdsalesreport }) => ({
  sdsalesreport
}))(sdsalesreport);
