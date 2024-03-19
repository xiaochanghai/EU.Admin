/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { DefaultFooter, SettingDrawer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { Link, useIntl, connect, Redirect } from 'umi';
// import { HomeOutlined, BarsOutlined, BookOutlined, SmileOutlined, HeartOutlined, AppstoreOutlined, AppstoreAddOutlined, TeamOutlined, FileAddOutlined, FileOutlined, UserSwitchOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
import { Result, Button, ConfigProvider } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { getAuthorityFromRouter } from '@/utils/utils';
import logo from '../assets/logo.png';
// import SecurityLayout from '../layouts/SecurityLayout';
// import Analysis from '../pages/dashboard/analysis';
import signalr from '@/utils/signalr';
import SwitchTabsLayout from './SwitchTabsLayout';
import styles from './BasicLayout.less';
import utility from '@/utils/utility';
import defaultSettings from '../../config/defaultSettings';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'antd/locale/zh_CN';
const noMatch = (
  // <Redirect to="/user/login" />
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);
/**
 * use Authorized check all menu item
 */
const menuDataRender = menuList =>
  menuList.map(item => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
    return Authorized.check(item.authority, localItem, null);
  });

const loopMenuItem = menus =>
  menus.map(({ icon, children, ...item }) => ({
    ...item,
    icon: icon && utility.getIcon(icon),
    children: children && loopMenuItem(children),
  }));
const defaultFooterDom = (
  <DefaultFooter
    // copyright="2022 苏州一优信息技术有限公司提供技术支持"
    copyright="2024 苏州一优信息技术有限公司版权所有"
    links={[
      // {
      //   key: 'Ant Design Pro',
      //   title: 'Ant Design Pro',
      //   href: 'https://pro.ant.design',
      //   blankTarget: true,
      // },
      // {
      //   key: 'github',
      //   title: <GithubOutlined />,
      //   href: 'https://github.com/ant-design/ant-design-pro',
      //   blankTarget: true,
      // },
      // {
      //   key: 'Ant Design',
      //   title: 'Ant Design',
      //   href: 'https://ant.design',
      //   blankTarget: true,
      // },
    ]}
  />
);

const BasicLayout = props => {
  const [menuData, setMenuData] = useState([]);
  const {
    dispatch,
    children,
    settings,
    user,
    location = {
      pathname: '/',
    },
  } = props;

  /**
   * constructor
   */
  const connect = () => {
    signalr.start().catch((err) => {
      console.error('signalr 连接失败', err)
      setTimeout(() => connect(), 5000)
    })
  };
  useEffect(() => {
    connect()

    // 监听连接成功事件
    signalr.on('OnConnected', (connectionId) => {
      // let userId = Utility.getCache("userId");

      const encodedMsg = new Date().toLocaleString() + ' ' + connectionId
      console.log('OnConnected', encodedMsg)

      // 使用sessionid注册
      let userId = localStorage.getItem("userId");
      if (userId)
        signalr.invoke('SendRegister', userId).catch((err) => console.log(err.toString()))
    })
    // 监听心跳包
    signalr.on('OnHeartbeat', (message) => {
      console.log('OnHeartbeat：', message)
    });
    // 监听接收消息
    // signalr.on('OnReceiveMessage', (message) => {
    //   console.log('监听接收消息:', message)
    //   const msg = JSON.parse(message)
    //   const html = sanitizeHtml(msg.Content, {
    //     allowedTags: [],
    //     allowedAttributes: {}
    //   })
    //   this.$notification.info({
    //     message: msg.Title,
    //     description: html
    //   })
    // })
    // 监听OnConsole
    signalr.on('OnConsole', (message) => {
      console.log('OnConsole：', message)
    })

    // const vm = this
    // signalr.onclose(() => {
    //   if (vm.$store.state.app.enableHub) {
    //     console.log('signalr 断开准备重新连接...')
    //     if (signalr.connectionState !== 'Disconnected') {
    //       signalr.stop()
    //     }
    //     this.connect()
    //   }
    // })

    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
      dispatch({
        type: 'user/getMenuData',
      }).then((result) => {
        setMenuData(result || []);
      });
    }
  }, []);

  /**
   * init variables
   */

  const handleMenuCollapse = payload => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };
  const { formatMessage } = useIntl();
  return (
    <>
      <ConfigProvider  locale={locale}
        theme={{
          token: {
            colorPrimary: defaultSettings.primaryColor,
          },
        }}
      >
        <ProLayout
          className={settings.switchTabs?.mode && styles.customByPageTabs}
          logo={logo}
          formatMessage={formatMessage}
          {...props}
          {...settings}
          onCollapse={(collapsed) => {
            handleMenuCollapse(collapsed);
          }}
          onMenuHeaderClick={() => history.push('/')}
          menuItemRender={(menuItemProps, defaultDom) => {
            if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
              return defaultDom;
            }

            return <Link to={menuItemProps.path}>{defaultDom}</Link>;
          }}
          breadcrumbRender={(routers = []) => [
            {
              path: '/',
              breadcrumbName: '首页',
            },
            ...routers,
          ]}
          itemRender={(route, params, routes, paths) => {
            const first = routes.indexOf(route) === 0;
            return first ? (
              <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
            ) : (
              <span>{route.breadcrumbName}</span>
            );
          }}
          footerRender={() => defaultFooterDom}
          // menuDataRender={menuDataRender}
          // route={() => loopMenuItem(menuData)}
          rightContentRender={() => <RightContent />}
          {...props}
          {...settings}
          // route={{ routes: loopMenuItem(menuData) }}
          route={{
            routes: loopMenuItem(menuData),
          }}
        >
          <Authorized authority={authorized.authority} noMatch={noMatch}>
            <SwitchTabsLayout
              mode={settings?.switchTabs?.mode}
              persistent={settings?.switchTabs?.persistent}
              fixed={settings?.switchTabs?.fixed}
              routes={props.route.routes}
            // footerRender={() => {
            //   if (settings.footerRender || settings.footerRender === undefined) {
            //     return defaultFooterDom;
            //   }
            //   return null;
            // }}
            >
              {children}
            </SwitchTabsLayout>
          </Authorized>
        </ProLayout>
        {/* <SettingDrawer
        settings={settings}
        onSettingChange={config =>
          dispatch({
            type: 'settings/changeSetting',
            payload: config,
          })
        }
      /> */}
      </ConfigProvider>
    </>
  );
};

export default connect(({ global, settings, user }) => ({
  collapsed: global.collapsed,
  settings,
  user
}))(BasicLayout);
