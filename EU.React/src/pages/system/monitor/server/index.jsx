import React, { Component } from 'react';
import { connect } from 'umi';

import { Card, Col, Row } from 'antd';
// import { ChartCard, MiniProgress } from '../../../dashboard/analysis/components/Charts';
import { FormattedMessage } from 'umi';
// import Trend from '../../../dashboard/analysis/components/Trend';
import styles from '../../../dashboard/analysis/style.less';
  // import { Line  } from '@ant-design/plots';
// import Gauge from '@ant-design/plots/es/components/gauge';

// let me;
class smjob extends Component {
  // constructor(props) {
  //   super(props);
  //   me = this;
  // }
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'server/getServerBase'
    });
    dispatch({
      type: 'server/getServerUsed'
    })
  }
  render() {
    const { dispatch, server: { serverBase, serverUsed } } = this.props;
    const config = {
      width: 720,
      height: 720,
      autoFit: true,
      data: {
        target: 139,
        total: 400,
        name: 'score',
        thresholds: [100, 200, 400],
      },
      legend: false,
      scale: {
        color: {
          range: ['#F4664A', '#FAAD14', 'green'],
        },
      },
      style: {
        textContent: (target, total) => `得分：${target}\n占比：${(target / total) * 100}%`,
      },
    };
    return (
      <>
          <Row gutter={16}>
            <Col span={12}>
              <Card title="系统信息" bordered={false}>
                <Row style={{ borderBottom: '1px solid #e8e8e8', padding: '5px 0' }}>
                  <Col span={6} style={{ textAlign: 'center' }}>
                    主机名称：
                  </Col>
                  <Col span={18} style={{ textAlign: 'center' }}>
                    {serverBase != null ? serverBase.HostName : null}
                  </Col>
                </Row>
                <Row style={{ borderBottom: '1px solid #e8e8e8', padding: '5px 0' }}>
                  <Col span={6} style={{ textAlign: 'center' }}>
                    操作系统：
                  </Col>
                  <Col span={18} style={{ textAlign: 'center' }}>
                    {serverBase != null ? serverBase.SystemOs : null}
                  </Col>
                </Row>
                <Row style={{ borderBottom: '1px solid #e8e8e8', padding: '5px 0' }}>
                  <Col span={6} style={{ textAlign: 'center' }}>
                    系统架构：
                  </Col>
                  <Col span={18} style={{ textAlign: 'center' }}>
                    {serverBase != null ? serverBase.OsArchitecture : null}
                  </Col>
                </Row>
                <Row style={{ borderBottom: '1px solid #e8e8e8', padding: '5px 0' }}>
                  <Col span={6} style={{ textAlign: 'center' }}>
                    CPU核数：
                  </Col>
                  <Col span={18} style={{ textAlign: 'center' }}>
                    {serverBase != null ? serverBase.ProcessorCount : null}
                  </Col>
                </Row>
                <Row style={{ borderBottom: '1px solid #e8e8e8', padding: '5px 0' }}>
                  <Col span={6} style={{ textAlign: 'center' }}>
                    运行时长：
                  </Col>
                  <Col span={18} style={{ textAlign: 'center' }}>
                    {serverBase != null ? serverBase.SysRunTime : null}
                  </Col>
                </Row>
                <Row style={{ borderBottom: '1px solid #e8e8e8', padding: '5px 0' }}>
                  <Col span={6} style={{ textAlign: 'center' }}>
                    外网地址：
                  </Col>
                  <Col span={18} style={{ textAlign: 'center' }}>
                    {serverBase != null ? serverBase.RemoteIp : null}
                  </Col>
                </Row>
                <Row style={{ borderBottom: '1px solid #e8e8e8', padding: '5px 0' }}>
                  <Col span={6} style={{ textAlign: 'center' }}>
                    内网地址：
                  </Col>
                  <Col span={18} style={{ textAlign: 'center' }}>
                    {serverBase != null ? serverBase.LocalIp : null}
                  </Col>
                </Row>
                <Row style={{ borderBottom: '1px solid #e8e8e8', padding: '5px 0' }}>
                  <Col span={6} style={{ textAlign: 'center' }}>
                    运行框架：
                  </Col>
                  <Col span={18} style={{ textAlign: 'center' }}>
                    {serverBase != null ? serverBase.FrameworkDescription : null}
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="使用信息" bordered={false}>


                {/* <Row style={{ borderBottom: 0, padding: '0 5px', boxShadow: 0 }}>
                  <Col span={12} style={{ textAlign: 'center' }}>

                  </Col>
                  <Col span={12} style={{ textAlign: 'center' }}>
                    <ChartCard
                      loading={false}
                      bordered={false}
                      title='CPU使用率'
                      // action={
                      //   <Tooltip
                      //     title={
                      //       <FormattedMessage
                      //         id="dashboardandanalysis.analysis.introduce"
                      //         defaultMessage="Introduce"
                      //       />
                      //     }
                      //   >
                      //     <InfoCircleOutlined />
                      //   </Tooltip>
                      // }
                      total="78%"
                      style={{ borderBottom: '1px solid #e8e8e8', padding: 0 }}
                      footer={
                        <div
                          style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                          }}
                        >
                          <Trend
                            style={{
                              marginRight: 16,
                            }}
                          >
                            <FormattedMessage
                              id="dashboardandanalysis.analysis.week"
                              defaultMessage="Weekly Changes"
                            />
                            <span className={styles.trendText}>12%</span>
                          </Trend>
                          <Trend>
                            <FormattedMessage
                              id="dashboardandanalysis.analysis.day"
                              defaultMessage="Weekly Changes"
                            />
                            <span className={styles.trendText}>11%</span>
                          </Trend>
                        </div>
                      }
                      contentHeight={46}
                    >
                      <MiniProgress percent={78} strokeWidth={8} target={78} color="#13C2C2" />
                    </ChartCard>
                  </Col>
                </Row> */}

                <Row style={{ borderBottom: '1px solid #e8e8e8', padding: '5px 0' }}>
                  <Col span={6} style={{ textAlign: 'center' }}>
                    启动时间：
                  </Col>
                  <Col span={18} style={{ textAlign: 'center' }}>
                    {serverUsed != null ? serverUsed.StartTime : null}
                  </Col>
                </Row>
                <Row style={{ borderBottom: '1px solid #e8e8e8', padding: '5px 0' }}>
                  <Col span={6} style={{ textAlign: 'center' }}>
                    运行时长：
                  </Col>
                  <Col span={18} style={{ textAlign: 'center' }}>
                    {serverUsed != null ? serverUsed.RunTime : null}
                  </Col>
                </Row>
                <Row style={{ borderBottom: '1px solid #e8e8e8', padding: '5px 0' }}>
                  <Col span={6} style={{ textAlign: 'center' }}>
                    网站目录：
                  </Col>
                  <Col span={18} style={{ textAlign: 'center' }}>
                    {serverBase != null ? serverBase.Wwwroot : null}
                  </Col>
                </Row>
                <Row style={{ borderBottom: '1px solid #e8e8e8', padding: '5px 0' }}>
                  <Col span={6} style={{ textAlign: 'center' }}>
                    开发环境：
                  </Col>
                  <Col span={18} style={{ textAlign: 'center' }}>
                    {serverBase != null ? serverBase.Environment : null}
                  </Col>
                </Row>
                <Row style={{ borderBottom: '1px solid #e8e8e8', padding: '5px 0' }}>
                  <Col span={6} style={{ textAlign: 'center' }}>
                    环境变量：
                  </Col>
                  <Col span={18} style={{ textAlign: 'center' }}>
                    {serverBase != null ? serverBase.Stage : null}
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
      </>
    )

  }
}

export default connect(({ server }) => ({
  server
  // loading: loading.effects['dashboardAndanalysis/fetch'],
}))(smjob);
