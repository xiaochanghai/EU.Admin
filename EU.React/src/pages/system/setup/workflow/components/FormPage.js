import React, { Component, Suspense } from 'react';
import { Button, Tree, Dropdown, Menu, message, DatePicker, Input, Card, Form, Row, Col, Select, Space, Switch, InputNumber, Tabs } from 'antd';
import { connect } from 'umi';
import { DownOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';

import TableList from './TableList';
import Index from '../index';
import ComBoBox from '@/components/SysComponents/ComboBox';
import ComboGrid from '@/components/SysComponents/ComboGrid';
import Utility from '@/utils/utility';
import GGEditor, { Flow } from 'gg-editor';
import EditorMinimap from './EditorMinimap';
import { FlowContextMenu } from './EditorContextMenu';
import { FlowDetailPanel } from './EditorDetailPanel';
import { FlowItemPanel } from './EditorItemPanel';
import { FlowToolbar } from './EditorToolbar';
import styles from '../index.less';
import Save from '@/components/SysComponents/FlowSaveButton';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { TreeNode } = Tree;

let me;
class FormPage extends Component {
    formRef = React.createRef();
    ggEditor = React.createRef();
    constructor(props) {
        super(props);
        me = this;
        me.state = {
            Id: ''
        };
    }
    componentWillMount() {
        const { dispatch, user, Id } = this.props;
        if (dispatch && Id) {
            this.setState({ Id })
            dispatch({
                type: 'workflow/getById',
                payload: { Id },
            }).then((result) => {
                if (result.response && me.formRef.current)
                    me.formRef.current.setFieldsValue(result.response)
            })
            dispatch({
                type: 'workflow/getFlowData',
                payload: { StructureId: Id },
            })
        }
    }
    onFinish(values) {
        const { dispatch, workflow: { structureId } } = this.props;
        const { Id } = this.state;
        if (Id) {
            values.ID = Id;
        }
        values.StructureId = structureId;
        dispatch({
            type: 'workflow/saveData',
            payload: values,
        }).then(() => {
            const { dispatch, workflow: { Id } } = me.props;
            this.setState({ Id });
            let data = this.ggEditor.current.props.propsAPI.save();
            if (data.nodes) {
                for (var i = 0; i < data.nodes.length; i++) {
                    data.nodes[i].SmProjectFlowId = Id;
                    data.nodes[i].nodeid = data.nodes[i].id;
                    delete data.nodes[i].id;
                }
            }
            if (data.edges) {
                for (var i = 0; i < data.edges.length; i++) {
                    data.edges[i].SmProjectFlowId = Id;
                    data.edges[i].edgeid = data.edges[i].id;
                    delete data.edges[i].id;
                }
            }
            var smFlowVm = {
                nodes: data.nodes ? data.nodes : [],
                edges: data.edges ? data.edges : []
            }

            dispatch({
                type: 'workflow/saveFlowData',
                payload: smFlowVm,
            })
        });
    }
    render() {
        const { IsView, workflow: { flowData } } = this.props;
        const { Id } = this.state;

        return (
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
                onFinish={(values) => { this.onFinish(values) }}
                ref={this.formRef}
            >
                <GGEditor className={styles.editor}>
                    <Card>
                        <Row gutter={24} justify={"center"}>
                            <Col span={12}>
                                <FormItem name="TaxisNo" label="排序号" rules={[{ required: true }]}>
                                    <InputNumber placeholder="请输入" disabled={IsView} />
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem name="FlowCode" label="流程编号" rules={[{ required: true }]}>
                                    <Input placeholder="请输入" disabled={IsView} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24} justify={"center"}>
                            <Col span={12}>
                                <FormItem name="FlowName" label="流程名称" rules={[{ required: true }]}>
                                    <Input placeholder="请输入" disabled={IsView} />
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem name="SmModuleId" label="模块" >
                                    <ComboGrid
                                        api="/api/SmModule/GetPageList"
                                        itemkey="ID"
                                        itemvalue="ModuleName"
                                        disabled={IsView}
                                    />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24} justify={"center"}>
                            <Col span={12}>
                                <FormItem name="Remark" label="备注" >
                                    <Input placeholder="请输入" disabled={IsView} />
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem valuePropName='checked' name="IsActive" label="是否启用">
                                    <Switch disabled={IsView} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Space style={{ display: 'flex', justifyContent: 'center' }}>
                            {!IsView ? <Save type="primary" htmlType="submit" ref={this.ggEditor} /> : null}
                            <Button type="default" onClick={() => Index.changePage(<TableList />)}>返回</Button>
                        </Space>
                    </Card>
                    <Row className={styles.editorHd}>
                        <Col span={24}>
                            <FlowToolbar />
                        </Col>
                    </Row>
                    <Row className={styles.editorBd}>
                        <Col span={4} className={styles.editorSidebar}>
                            <FlowItemPanel />
                        </Col>
                        <Col span={16} className={styles.editorContent}>
                            <Flow
                                className={styles.flow}
                                data={flowData}
                            />
                        </Col>
                        <Col span={4} className={styles.editorSidebar}>
                            <FlowDetailPanel />
                            {/* <EditorMinimap /> */}
                        </Col>
                    </Row>
                    <FlowContextMenu />
                </GGEditor>
            </Form>
        )
    }
}
export default connect(({ workflow, loading }) => ({
    workflow,
    // loading: loading.effects['dashboardAndanalysis/fetch'],
}))(FormPage);
