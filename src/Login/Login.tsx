import { FC, useCallback, useEffect } from 'react';
import './Login.css';

interface LoginProps {
  onLogin: (code: string) => void;
}

export const Login: FC<LoginProps> = ({ onLogin }) => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  // Handle OAuth callback
  useEffect(() => {
    if (code) {
      console.log('OAuth code received:', code);
      window.history.replaceState({}, '', window.location.pathname);
      onLogin(code);
    }
  }, [onLogin, code]);

  // Redirect to OAuth provider
  const onLoginClick = useCallback(() => {
    const providerUrl = process.env.REACT_APP_OAUTH_PROVIDER_URL;
    const clientId = encodeURIComponent(
      process.env.REACT_APP_OAUTH_CLIENT_ID as string,
    );
    const redirectUri = encodeURIComponent(
      process.env.REACT_APP_OAUTH_REDIRECT_URI as string,
    );

    window.location.href = `${providerUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&grant_type=authorization_code&response_type=code`;
  }, [onLogin]);

  return (
    <div className="login-dialog">
      <h2 className="login-title">{'Please login'}</h2>
      <p className="login-text">
        The oAuth authentication is currently enabled and you need to log in
        first.
        <br />
        The button below will redirect you to the configured oAuth provider:
        <br />
        <small>{process.env.REACT_APP_OAUTH_PROVIDER_URL}</small>
      </p>
      <button className="login-btn" onClick={onLoginClick}>
        {'Log in'}
      </button>
    </div>
  );
};
