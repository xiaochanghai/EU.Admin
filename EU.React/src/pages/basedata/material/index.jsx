import React, { Component } from 'react';
import { connect } from 'umi';

import TableList from './components/TableList'
import FormPage from './components/FormPage'

let me;
class material extends Component {
    constructor(props) {
        super(props);
        me = this;
        me.state = {
            current: <TableList />
        };
    }
    componentWillMount() {
        let tempRowId = localStorage.getItem("tempRowId");
        if (tempRowId) {
            localStorage.removeItem('tempRowId');
            if (tempRowId == "Y")
                me.setState({ current: <FormPage /> })
            else
                me.setState({ current: <FormPage Id={tempRowId} IsView={true} /> })
        }
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'material/setTableStatus',
            payload: {},
        })
    }
    static changePage(current) {
        me.setState({ current })
    }
    render() {
        let { current } = this.state;

        return (
            <>
                {current}
            </>
        )

    }
}

export default connect(({ material }) => ({
    material,
    // loading: loading.effects['dashboardAndanalysis/fetch'],
}))(material);
