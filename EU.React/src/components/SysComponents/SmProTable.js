import React from 'react';
// import ProTable from '@ant-design/pro-table';
import { Button, Menu, Dropdown, message, Tag, Space, Modal, Descriptions, Skeleton, Tooltip } from 'antd';
import { DownOutlined, PlusOutlined, ExclamationCircleOutlined, UnorderedListOutlined, RedoOutlined, FileExcelOutlined, CloudUploadOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import { GetModuleLogInfo, ExportExcel } from '../../services/common';
import defaultSettings from '../../../config/defaultSettings';
import Utility from '@/utils/utility';
import UploadExcel from '../../pages/import/UploadExcel';
import { ProTable } from '@ant-design/pro-components';

const { confirm } = Modal;
let tableAction;

class SmProTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recordLogVisible: false,
      recordLogData: null,
      moreToolBarVisible: false,
      UploadExcelVisible: false,
      SearchVisible: false
    };
  }
  async showDeleteConfirm(action, record) {
    let me = this;
    confirm({
      title: '是否确定删除记录?',
      icon: <ExclamationCircleOutlined />,
      // content: '是否确定删除记录？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        me.props.delete({ Id: record.ID }).then((response) => {
          if (response.status == "ok") {
            action.reload();
            message.success(response.message);
          }
          else message.error(response.message);
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  async submitAudit(action, selectedRows) {
    const { moduleInfo } = this.props;
    let response = await this.props.submitAudit(moduleInfo.moduleId, selectedRows);
    if (response.status == "ok") {
      message.success(response.message);
      action.reload();
    }
    else message.error(response.message);
  }
  async showLogRecord(selectedRows) {
    const { moduleInfo, moduleInfo: { moduleCode } } = this.props;

    let response = await GetModuleLogInfo({ moduleCode, id: selectedRows[0].ID });
    if (response.Success) {
      this.setState({ recordLogData: response.Data, recordLogVisible: true })
    } else message.error(response.message);
  }
  async moreToolBarMenuClick(e, action) {
    let me = this;
    const { moduleInfo: { moduleCode } } = me.props;
    me.setState({ moreToolBarVisible: false });
    let { webUrl } = defaultSettings;

    switch (e.key) {
      case "1":
        action.reload();
        break;
      case "2":
        message.success('后台处理中，处理完成将自动下载！');
        let response = await ExportExcel({ moduleCode });
        if (response.status == "ok") {
          // webUrl + response.data.filePath
          let a = document.createElement('a');
          a.setAttribute('download', '')
          a.setAttribute('href', '/api/File/Download?id=' + response.data.fileId);
          a.click();
        } else message.error(response.message);
        break;
      default:
        break;
    }

  }
  showLogRecordCancel = e => {
    let me = this;
    me.setState({
      recordLogData: null,
      recordLogVisible: false,
    });
  };
  batchDelete(action, selectedRows) {
    let me = this;
    confirm({
      title: '你确定需要批量删除所选数据吗？',
      icon: <ExclamationCircleOutlined />,
      // content: '是否确定删除记录？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        me.props.batchDelete(selectedRows);
        action.clearSelected();
        action.reload();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  handleoreToolBarVisibleChange = flag => {
    this.setState({ moreToolBarVisible: flag });
  }
  onResetFun = e => {
    let { dispatch, moduleInfo: { modelName } } = this.props;
    dispatch({
      type: modelName + '/setTableStatus',
      payload: {},
    })
  };
  render() {
    let me = this;
    let { columns, moduleInfo, IsView, request, onReset } = this.props;
    const FormPage = this.props.formPage;
    let { recordLogVisible, recordLogData, moreToolBarVisible, UploadExcelVisible, SearchVisible } = this.state;
    let moreToolBar = [];
    if (moduleInfo && moduleInfo.status == "ok" && !moduleInfo.noActions.includes(moduleInfo.moduleId + "ExportExcel"))
      moreToolBar.push('ExportExcel');

    const actionColumn =
      moduleInfo && moduleInfo.status == "ok" && moduleInfo.actionCount > 0 ?
        {
          title: '操作',
          dataIndex: 'option',
          fixed: 'right',
          valueType: 'option',
          width: 150,
          render: (_, record, index, action) => (
            <>
              {
                moduleInfo && moduleInfo.status == "ok" && moduleInfo.beforeActions.length > 0 && record.ID != '2108131534125450674040828132228' ?
                  <>
                    {
                      moduleInfo.beforeActions.map((item, index) => {
                        if (item.id == moduleInfo.moduleId + "Update" && !IsView) {
                          return (
                            <>
                              <Tag rootClassName='table-tag' color="#47a447" onClick={() => {
                                if (moduleInfo.isDetail)
                                  this.props.editPage(record)
                                else
                                  this.props.changePage(<FormPage Id={record.ID} moduleInfo={moduleInfo} />)
                              }} ><a title='编辑'><EditOutlined style={{ color: '#fff' }} /></a></Tag>
                            </>
                          )
                        }
                        else if (item.id == moduleInfo.moduleId + "View") {
                          return (
                            <>
                              <Tag color="#2db7f5" onClick={() => {
                                if (moduleInfo.isDetail)
                                  this.props.viewPage(record)
                                else
                                  this.props.changePage(<FormPage Id={record.ID} IsView={true} />)
                              }} ><a title='查看'><EyeOutlined style={{ color: '#fff' }} /></a></Tag>
                            </>
                          )
                        }
                        else if (item.id == moduleInfo.moduleId + "Delete" && !IsView) {
                          return (
                            <>
                              <Tag color="#f50" onClick={() => {
                                if (this.props.deleteConfirm)
                                  this.props.deleteConfirm(action, record);
                                else
                                  this.showDeleteConfirm(action, record);
                              }
                              } ><a title='删除'><DeleteOutlined style={{ color: '#fff' }} /></a></Tag>
                            </>
                          )
                        }
                        else {
                          for (var i = 0; i < moduleInfo.actionData.length; i++) {
                            var data = moduleInfo.actionData[i];
                            if (item.id == data.ID) {
                              return (
                                <Tag color={data.Color} onClick={() => {
                                  this.props[data.FunctionCode](record.ID)
                                }} >{data.FunctionName}</Tag>
                              )
                              break;
                            }
                          }
                        }
                      })
                    }
                  </> : ''
              }
              {
                moduleInfo && moduleInfo.status == "ok" && moduleInfo.dropActions.length > 0 && record.ID != '2108131534125450674040828132228' ?
                  <Dropdown overlay={
                    <Menu>
                      {
                        moduleInfo.dropActions.map((item, index) => {
                          if (item.id == moduleInfo.moduleId + "Update" && !IsView) {
                            return (
                              <Menu.Item>
                                <a onClick={() => {
                                  if (moduleInfo.isDetail)
                                    this.props.editPage(record)
                                  else
                                    this.props.changePage(<FormPage Id={record.ID} />)
                                }}>修改</a>
                              </Menu.Item>
                            )
                          }
                          else if (item.id == moduleInfo.moduleId + "View") {
                            return (
                              <Menu.Item>
                                <a onClick={() => {
                                  if (moduleInfo.isDetail)
                                    this.props.viewPage(record)
                                  else
                                    this.props.changePage(<FormPage Id={record.ID} IsView={true} />)
                                }}>查看</a>
                              </Menu.Item>
                            )
                          }
                          else if (item.id == moduleInfo.moduleId + "Delete" && !IsView) {
                            return (
                              <Menu.Item>
                                <a onClick={() => {
                                  if (this.props.deleteConfirm)
                                    this.props.deleteConfirm(action, record);
                                  else
                                    this.showDeleteConfirm(action, record);
                                }}>删除</a>
                              </Menu.Item>
                            )
                          }
                          else {
                            for (var i = 0; i < moduleInfo.actionData.length; i++) {
                              var data = moduleInfo.actionData[i];
                              if (item.id == data.ID) {
                                return (
                                  <Menu.Item>
                                    <a onClick={() => { this.props[data.FunctionCode](record.ID) }} >{data.FunctionName}</a>
                                  </Menu.Item>
                                )
                                break;
                              }
                            }
                          }
                        })
                      }
                    </Menu>
                  }>
                    <Tag>更多<DownOutlined /></Tag>
                  </Dropdown> : ''}
            </>
          ),
        } : null
    if (!columns)
      columns = moduleInfo.columns;

    let r = columns.filter(function (s) {
      return s.dataIndex == 'option'; // 注意：IE9以下的版本没有trim()方法
    });

    if (actionColumn) {
      if (r.length > 0)
        columns[columns.length - 1] = actionColumn;
      else
        columns.push(actionColumn);
    }

    return (<>
      <ProTable
        rowKey="ID"
        tableAlertRender={false}
        toolBarRender={(action, { selectedRows }) => [
          <Space style={{ display: 'flex', justifyContent: 'center' }}>
            {
              moduleInfo && moduleInfo.status == "ok" && !moduleInfo.noActions.includes(moduleInfo.moduleId + "Add") && !IsView ?
                <Button type="primary"
                  onClick={() => {
                    if (moduleInfo.isDetail)
                      this.props.addPage()
                    else
                      this.props.changePage(<FormPage moduleInfo={moduleInfo} />)
                  }}
                ><PlusOutlined /> 新建</Button> : null
            }

            {
              moduleInfo && moduleInfo.status == "ok" && !moduleInfo.noActions.includes(moduleInfo.moduleId + "ImportExcel") && !IsView ?
                <Button
                  onClick={() => {
                    tableAction = action
                    this.setState({ UploadExcelVisible: true })
                  }}
                > <CloudUploadOutlined /> 上传</Button> : null
            }
            {
              moduleInfo && moduleInfo.status == "ok" && moduleInfo.menuData.length > 0 ?
                <>
                  {
                    moduleInfo.menuData.map((item, index) => {
                      return (
                        <Button key={item.ID} onClick={() => {
                          this.props[item.FunctionCode](action, selectedRows)
                        }} >{item.Icon ? Utility.getIcon(item.Icon) : null}{item.FunctionName}</Button>
                      )
                    })
                  }
                </> : null
            }

            <a onClick={() => {
              this.setState({ SearchVisible: !SearchVisible })
            }}><Tooltip placement="top" title='查询'>
                <SearchOutlined style={{ fontSize: 16 }} />
              </Tooltip></a>
            {this.props.expendAction ? this.props.expendAction(action, selectedRows) : null}
          </Space>,
          moreToolBar.length > 0 && (
            <Dropdown onVisibleChange={this.handleoreToolBarVisibleChange} open={moreToolBarVisible} overlay={
              <>
                <Menu onClick={(e) => { this.moreToolBarMenuClick(e, action) }}>
                  <Menu.Item key="1" icon={<RedoOutlined />}>刷新</Menu.Item>
                  {
                    moreToolBar.includes("ExportExcel") ? <Menu.Item key="2" icon={<FileExcelOutlined />}>
                      导出Excel
                    </Menu.Item> : null
                  }
                </Menu>
              </>
            }>
              <Button>
                更多 <DownOutlined />
              </Button>
            </Dropdown>),
          selectedRows && selectedRows.length == 1 && (
            <Button
              onClick={() => {
                this.showLogRecord(selectedRows)
              }}
            ><UnorderedListOutlined /> 日志</Button>),
          selectedRows && selectedRows.length > 0 && (
            <Space style={{ display: 'flex', justifyContent: 'center' }}>
              {
                moduleInfo && moduleInfo.status == "ok" && moduleInfo.hideMenu.length > 0 ?
                  <>
                    {
                      moduleInfo.hideMenu.map((item, index) => {
                        return (
                          <Button key={item.ID} onClick={() => {
                            this.props[item.FunctionCode](action, selectedRows)
                          }} >{item.Icon ? Utility.getIcon(item.Icon) : null}{item.FunctionName}</Button>
                        )
                      })
                    }
                  </> : null
              }
              {this.props.expendHideAction ? this.props.expendHideAction(action, selectedRows) : null}
              {
                moduleInfo && moduleInfo.status == "ok" && !moduleInfo.noActions.includes(moduleInfo.moduleId + "Submit") ?
                  <Button onClick={() => { this.submitAudit(action, selectedRows); }}>提交</Button>
                  : null
              }
              {
                moduleInfo && moduleInfo.status == "ok" && !moduleInfo.noActions.includes(moduleInfo.moduleId + "BatchDelete") && !IsView ?
                  <Button onClick={() => { this.batchDelete(action, selectedRows); }}>批量删除</Button>
                  : null
              }
            </Space>
          ),
        ]}
        onRow={record => {
          return {
            // onClick: event => { }, // 点击行
            onDoubleClick: event => {
              if (moduleInfo && moduleInfo.status == "ok" && record.ID != '2108131534125450674040828132228') {
                let actions = moduleInfo.beforeActions;
                let index = actions.findIndex(item => item.id === moduleInfo.moduleId + "Update");
                if (index <= -1)
                  actions = moduleInfo.dropActions;
                index = actions.findIndex(item => item.id === moduleInfo.moduleId + "Update");
                if (index > -1 && !IsView) {
                  if (moduleInfo.isDetail)
                    this.props.editPage(record)
                  else
                    this.props.changePage(<FormPage Id={record.ID} />)
                }
              }
            },
            // onContextMenu: event => { },
            // onMouseEnter: event => { }, // 鼠标移入行
            // onMouseLeave: event => { },
          };
        }}
        options={{
          search: true,
          fullScreen: true,
          reload: moreToolBar.length == 0 ? true : false,
          setting: true,
          density: true,
        }}
        search={SearchVisible}
        rowSelection={{
          fixed: 'left',
          getCheckboxProps: (record) => ({
            disabled: record.ID === '2108131534125450674040828132228'
          })
        }}
        columns={columns}
        request={request}
        onReset={onReset ? onReset : me.onResetFun}
        scroll={{ x: 'max-content' }}
        columnEmptyText={''}
        {...this.props}
      //toolbar={{
      // title: '这里是标题',
      // subTitle: '这里是子标题',
      // tooltip: '这是一个段描述',
      // search: {
      //   onSearch: (value) => {
      //     alert(value);
      //   },
      // },
      // filter: (
      //   <LightFilter>
      //     <ProFormDatePicker name="startdate" label="响应日期" />
      //   </LightFilter>
      // ),
      // actions: [
      //   <Button
      //     key="key"
      //     type="primary"
      //     onClick={() => {
      //       alert('add');
      //     }}
      //   >
      //     添加
      //   </Button>,
      // ],
      // settings: [
      //   {
      //     icon: <SettingOutlined />,
      //     tooltip: '设置',
      //   },
      //   {
      //     icon: <FullscreenOutlined />,
      //     tooltip: '全屏',
      //   },
      // ],
      //}}
      />
      {moduleInfo && moduleInfo.status == "ok" ? <Modal
        title="日志"
        open={recordLogVisible}
        width={1000}
        footer={null}
        onCancel={this.showLogRecordCancel}
      >
        {recordLogData ? <Descriptions title="表信息" bordered>
          <Descriptions.Item label="表名称">{recordLogData.tableName}</Descriptions.Item>
          <Descriptions.Item label="表主键" span={2}>{recordLogData.ID} </Descriptions.Item>
          <Descriptions.Item label="创建人">{recordLogData.CreatedBy} </Descriptions.Item>
          <Descriptions.Item label="最后修改人" span={2}>{recordLogData.UpdateBy} </Descriptions.Item>
          <Descriptions.Item label="创建时间">{recordLogData.CreatedTime} </Descriptions.Item>
          <Descriptions.Item label="最后修改时间" span={2}>{recordLogData.UpdateTime} </Descriptions.Item>
        </Descriptions> : <Skeleton active />}
      </Modal> : null}
      {moduleInfo && moduleInfo.status == "ok" ? <UploadExcel
        modalVisible={UploadExcelVisible}
        moduleInfo={moduleInfo}
        onCancel={() => { this.setState({ UploadExcelVisible: false }) }}
        onReload={() => { tableAction.reload(); }}
      /> : null}
    </>);
  }
}
export default connect(({ }) => ({
}))(SmProTable);
