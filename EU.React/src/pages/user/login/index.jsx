import { Alert } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import styles from './style.less';
import LoginFrom from './components/Login';
import { setLocale, getLocale, FormattedMessage, useIntl, formatMessage } from 'umi';
const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginFrom;

// const LoginMessage = ({ content }) => (
//   <Alert
//     style={{
//       marginBottom: 24,
//     }}
//     message={content}
//     type="error"
//     showIcon
//   />
// );

// const locale = getLocale();
// if (!locale || locale === 'zh-CN') {
//   setLocale('en-US');
// } else {
//   setLocale('zh-CN');
// }

const Login = props => {
  const { userAndlogin = {}, submitting } = props;
  const { status, type: loginType } = userAndlogin;
  const [autoLogin, setAutoLogin] = useState(true);
  const [type, setType] = useState('account');
  const handleSubmit = values => {
    const { dispatch } = props;
    dispatch({
      type: 'userAndlogin/login',
      payload: { ...values, type },
    });
  };
  return (
    <div className={styles.main}>
      <LoginFrom activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
        {/* <Tab key="account" tab="账户密码登录">
          {status === 'error' && !submitting && (
            <LoginMessage content="账户或密码错误" />
          )} */}
        <div>
          <UserName
            name="UserAccount"
            placeholder={formatMessage({
              id: 'user.account.placeholder',
            })}
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          <Password
            name="PassWord"
            placeholder="密码"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
        </div>
        {/* </Tab> */}
        {/* <Tab key="mobile" tab="手机号登录">
          {status === 'error' && loginType === 'mobile' && !submitting && (
            <LoginMessage content="验证码错误" />
          )}
          <Mobile
            name="mobile"
            placeholder="手机号"
            rules={[
              {
                required: true,
                message: '请输入手机号！',
              },
              {
                pattern: /^1\d{10}$/,
                message: '手机号格式错误！',
              },
            ]}
          />
          <Captcha
            name="captcha"
            placeholder="验证码"
            countDown={120}
            getCaptchaButtonText=""
            getCaptchaSecondText="秒"
            rules={[
              {
                required: true,
                message: '请输入验证码！',
              },
            ]}
          />
        </Tab> */}
        <div>
          {/* <Checkbox checked={autoLogin} onChange={e => setAutoLogin(e.target.checked)}>
            自动登录
          </Checkbox> */}
          {/* <a
            style={{
              float: 'right',
            }}
          >
            忘记密码
          </a> */}
        </div>
        <Submit loading={submitting}><FormattedMessage id="user.login.submit" /></Submit>

        {/* <div className={styles.other}>
          其他登录方式
          <AlipayCircleOutlined className={styles.icon} />
          <TaobaoCircleOutlined className={styles.icon} />
          <WeiboCircleOutlined className={styles.icon} />
          <Link className={styles.register} to="/user/register">
            注册账户
          </Link>
        </div> */}
      </LoginFrom>
    </div>
  );
};

export default connect(({ userAndlogin, loading }) => ({
  userAndlogin,
  submitting: loading.effects['userAndlogin/login'],
}))(Login);
