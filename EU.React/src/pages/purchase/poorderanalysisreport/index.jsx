// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import { connect } from 'umi';
// eslint-disable-next-line no-unused-vars

// eslint-disable-next-line no-unused-vars
import TableList from './components/TableList'

let me;
class poorderanalysisreport extends Component {
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
            type: 'poorderanalysisreport/setTableStatus',
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
export default connect(({ poorderanalysisreport }) => ({
    poorderanalysisreport
}))(poorderanalysisreport);
