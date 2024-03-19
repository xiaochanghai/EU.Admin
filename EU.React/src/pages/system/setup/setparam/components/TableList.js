import React, { Component, Suspense } from 'react';
import { Button, Divider, Dropdown, Menu, message, Input, Tag, Popconfirm } from 'antd';
import { connect } from 'umi';
import { DownOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';

import { SaveAddFormData, SaveEditFormData, query, BatchDelete, Delete } from '../service';
import Index from '../index';
import FormPage from './FormPage'
import SmProTable from '@/components/SysComponents/SmProTable';

let moduleCode = "SM_LOV_MNG";
let me;
class TableList extends Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        me = this;
        me.state = {

        };
    }
    componentWillMount() {
        const { dispatch, Id } = this.props;
        dispatch({
            type: 'setparam/getModuleInfo',
            payload: { moduleCode },
        })
    }
    render() {
        const { dispatch, setparam: { moduleInfo, tableParam } } = this.props;

        const columns = [
            {
                title: '参数代码',
                dataIndex: 'LovCode'
            },
            {
                title: '参数名称',
                dataIndex: 'LovName'
            },
        ];

        //#region 操作栏按钮方法
        const action = {}
        //#endregion

        return (
            <div>
                <SmProTable
                    columns={columns}
                    delete={Delete}
                    batchDelete={(selectedRows) => BatchDelete(selectedRows)}
                    moduleInfo={moduleInfo}
                    {...action}
                    changePage={Index.changePage}
                    formPage={FormPage}
                    formRef={this.formRef}
                    form={{ labelCol: { span: 6 } }}
                    onReset={() => {
                        dispatch({
                            type: 'setparam/setTableStatus',
                            payload: {},
                        })
                    }}
                    onLoad={() => {
                        if (tableParam && tableParam.params && this.formRef.current) {
                            this.formRef.current.setFieldsValue({ ...tableParam.params })
                        }
                    }}
                    pagination={tableParam && tableParam.params ? { current: tableParam.params.current } : {}}
                    request={(params, sorter, filter) => {
                        if (tableParam && tableParam.params && !params._timestamp)
                            params = Object.assign(tableParam.params, params);
                        if (tableParam && tableParam.sorter)
                            sorter = Object.assign(tableParam.sorter, sorter);
                        dispatch({
                            type: 'setparam/setTableStatus',
                            payload: { params, sorter },
                        })
                        return query({
                            paramData: JSON.stringify(params),
                            sorter: JSON.stringify(sorter),
                            filter: JSON.stringify(filter)
                        })
                    }}
                />
            </div>
        )
    }
}
export default connect(({ setparam, loading }) => ({
    setparam,
    // loading: loading.effects['dashboardAndanalysis/fetch'],
}))(TableList);
