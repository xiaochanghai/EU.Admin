import React, { Component } from 'react';
import { Button, message } from 'antd';
import { connect } from 'umi';
// import TableList from './components/TableList'
import { ClearCache } from '../../../services/common';

let me;
class clearCache extends Component {
    constructor(props) {
        super(props);
        me = this;
        // me.state = {
        //     current: <Button>Default Button</Button>
        // };
    }
    // componentWillUnmount() {
    //     const { dispatch } = this.props;
    //     dispatch({
    //         type: 'module/setTableStatus',
    //         payload: {},
    //     })
    // }
    async clearCache() {
        message.loading('缓存清理中...', 0);
        let response = await ClearCache({});
        message.destroy();
        if (response.status == "ok") {
            message.success(response.message);
        } else {
            message.error(response.message);
        }
    }
    // static changePage(current) {
    //     me.setState({ current })
    // }
    render() {
        // const { current } = this.state;
        // const pageComponent = current;
        return (
            <>
               <Button type="primary" onClick={() => {
                        this.clearCache()
                    }}>清空缓存</Button>
                    <p style={{ marginTop: 10 }}>把所有缓存数据删除</p>
            </>
        )
    }
}

export default connect(({ }) => ({
}))(clearCache);
