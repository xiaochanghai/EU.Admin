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

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { TreeNode } = Tree;

let me;
class FormPage extends Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        me = this;
        me.state = {
            Id: ''
        };
    }
    componentDidMount() {
        const { dispatch, user, Id } = this.props;
        if (dispatch && Id) {
            this.setState({ Id })
            dispatch({
                type: 'department/getById',
                payload: { Id },
            }).then((result) => {
                if (result.response && me.formRef.current) {
                    me.formRef.current.setFieldsValue(result.response);
                    this.setState({ CompanyId: result.response.CompanyId });
                }
            })
        }

    }
    onFinish(values) {
        const { dispatch } = this.props;
        const { Id } = this.state;
        if (Id) {
            values.ID = Id;
        }
        dispatch({
            type: 'department/saveData',
            payload: values,
        }).then(() => {
            const { dispatch, department: { Id } } = me.props;
            this.setState({ Id })
        });
    }
    render() {
        const { IsView } = this.props;
        const { Id } = this.state;
        return (
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
                onFinish={(values) => { this.onFinish(values) }}
                ref={this.formRef}
            >
                <Card>
                    <Row gutter={24} justify={"center"}>
                        <Col span={12}>
                            <FormItem name="DepartmentCode" label="部门编码" rules={[{ required: true }]}>
                                <Input placeholder="请输入" disabled={IsView} />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem name="DepartmentName" label="部门名称" rules={[{ required: true }]}>
                                <Input placeholder="请输入" disabled={IsView} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24} justify={"center"}>
                        <Col span={12}>
                            <FormItem name="CompanyId" label="所属组织" rules={[{ required: true }]}>
                                <ComboGrid
                                    api="/api/SmCompany/GetPageList"
                                    itemkey="ID"
                                    itemvalue="CompanyName"
                                    onChange={(value) => {
                                        if (value != this.state.CompanyId) {
                                            me.formRef.current.setFieldsValue({ 'DepartmentId': '' });
                                        }
                                        this.setState({ CompanyId: value })
                                    }}
                                    disabled={IsView}
                                />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem name="DepartmentId" label="上级部门" >
                                <ComboGrid
                                    api="/api/SmDepartment/GetPageList"
                                    itemkey="ID"
                                    itemvalue="DepartmentName"
                                    disabled={IsView}
                                    parentId={{ 'CompanyId': this.state.CompanyId }}
                                />
                            </FormItem>
                        </Col>
                    </Row>
                    <Space style={{ display: 'flex', justifyContent: 'center' }}>
                        {!IsView ? <Button type="primary" htmlType="submit">保存</Button> : ''}
                        <Button type="default" onClick={() => Index.changePage(<TableList />)}>返回</Button>
                    </Space>
                </Card>
            </Form>
        )
    }
}
export default connect(({ department, loading }) => ({
    department,
    loading: loading.effects['dashboardAndanalysis/fetch'],
}))(FormPage);
