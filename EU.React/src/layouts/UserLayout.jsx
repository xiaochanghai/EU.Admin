import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link, useIntl, connect } from 'umi';
import React from 'react';
import SelectLang from '@/components/SelectLang';
import logo from '../assets/logo.png';
import styles from './UserLayout.less';
import defaultSettings from '../../config/defaultSettings';

const UserLayout = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { formatMessage } = useIntl();
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    formatMessage,
    breadcrumb,
    ...props,
  });

  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.lang}>
          {/* <SelectLang /> */}
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>{defaultSettings.title}</span>
              </Link>
            </div>
            {/* <div className={styles.desc}>Ant Design 是西湖区最具影响力的 Web 设计规范</div> */}
            <div className={styles.desc}></div>
          </div>
          {children}
        </div>
        {/* <DefaultFooter links={[]} copyright='2016-2021 苏州一优信息科技有限公司 技术支持' /> */}
        <DefaultFooter links={[]} copyright='2024 苏州一优信息科技有限公司 版权所有' />
      </div>
    </HelmetProvider>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
