import React, { Component, Suspense } from 'react';
import { Button, Divider, Dropdown, Menu, message, Input, Tag, Popconfirm, Tree, Card, Row, Col } from 'antd';
import { connect } from 'umi';
import { DownOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';

import { SaveAddFormData, SaveEditFormData, query, BatchDelete, Delete, GetStructureTree } from '../service';
import Index from '../index';
import FormPage from './FormPage'
import SmProTable from '@/components/SysComponents/SmProTable';

const { DirectoryTree } = Tree;

let moduleCode = "SM_WORKFLOW_MNG";
let me;
class TableList extends Component {
    actionRef = React.createRef();
    formRef = React.createRef();
    constructor(props) {
        super(props);
        me = this;
        me.state = {
            structureTree: [],
        };
    }
    async componentWillMount() {
        const { dispatch, Id } = this.props;
        dispatch({
            type: 'workflow/getModuleInfo',
            payload: { moduleCode },
        })
        var response = await GetStructureTree()
        if (response.status == 'ok' && response.data) {
            this.setState({ structureTree: [response.data] })
        }
    }
    selectStructure(selectKeys, e) {
        const { dispatch } = me.props;
        if (selectKeys && selectKeys[0] != 'All') {
            dispatch({
                type: 'workflow/setStructure',
                payload: selectKeys[0],
            })
        }
        else {
            dispatch({
                type: 'workflow/setStructure',
                payload: null,
            })
        }
        if (me.actionRef.current)
            me.actionRef.current.reload();
    }
    render() {
        const { dispatch, workflow: { moduleInfo, tableParam, structureId } } = this.props;
        const { structureTree } = this.state;
        const columns = [
            {
                title: '排序号',
                dataIndex: 'TaxisNo'
            },
            {
                title: '流程编号',
                dataIndex: 'FlowCode'
            },
            {
                title: '流程名称',
                dataIndex: 'FlowName'
            },
            {
                title: '模块',
                dataIndex: ['SmModule', 'ModuleName']
            },
        ];

        //#region 操作栏按钮方法
        const action = {}
        //#endregion

        return (
            <div>
                <Row gutter={24} justify={"center"}>
                    <Col span={6}>
                        <Card>
                            {
                                structureTree.length > 0 ?
                                    <DirectoryTree
                                        defaultExpandAll={true}
                                        selectedKeys={[structureId]}
                                        treeData={this.state.structureTree}
                                        onSelect={this.selectStructure}
                                    />
                                    : null
                            }
                        </Card>
                    </Col>
                    <Col span={18}>
                        {
                            structureId ?
                                <SmProTable
                                    search={false}
                                    columns={columns}
                                    delete={Delete}
                                    batchDelete={(selectedRows) => BatchDelete(selectedRows)}
                                    moduleInfo={moduleInfo}
                                    {...action}
                                    changePage={Index.changePage}
                                    formPage={FormPage}
                                    actionRef={this.actionRef}
                                    formRef={this.formRef}
                                    form={{ labelCol: { span: 6 } }}
                                    onReset={() => {
                                        dispatch({
                                            type: 'workflow/setTableStatus',
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
                                        if (tableParam && tableParam.params && !params._timestamp) {
                                            params = tableParam.params;
                                            //sorter = tableParam.sorter
                                        }
                                        dispatch({
                                            type: 'workflow/setTableStatus',
                                            payload: { params, sorter },
                                        })
                                        filter.StructureId = structureId;
                                        return query({
                                            paramData: JSON.stringify(params),
                                            sorter: JSON.stringify(sorter),
                                            filter: JSON.stringify(filter)
                                        })
                                    }}
                                /> : null
                        }

                    </Col>
                </Row>


            </div>
        )
    }
}
export default connect(({ workflow, loading }) => ({
    workflow,
    // loading: loading.effects['dashboardAndanalysis/fetch'],
}))(TableList);
