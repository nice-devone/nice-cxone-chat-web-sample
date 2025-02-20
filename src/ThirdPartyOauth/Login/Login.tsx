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

  const providerUrl = import.meta.env.REACT_APP_OAUTH_PROVIDER_URL;
  // Redirect to OAuth provider
  const onLoginClick = useCallback(() => {
    const clientId = encodeURIComponent(
      import.meta.env.REACT_APP_OAUTH_CLIENT_ID as string,
    );
    const redirectUri = encodeURIComponent(
      (import.meta.env.REACT_APP_OAUTH_REDIRECT_URI as string) ??
        window.location.href,
    );

    window.location.href = `${providerUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&grant_type=authorization_code&response_type=code`;
  }, []);

  return (
    <div className="login-dialog">
      <h2 className="login-title">{'Please login'}</h2>
      <p className="login-text">
        The oAuth authentication is currently enabled and you need to log in
        first.
      </p>
      {providerUrl ? (
        <p>
          The button below will redirect you to the configured oAuth provider:
          <br />
          <small>{providerUrl}</small>
        </p>
      ) : (
        <p className="login-error">The oAuth provider URL is not configured.</p>
      )}
      <button
        className="login-btn"
        onClick={onLoginClick}
        disabled={!providerUrl}
      >
        {'Log in'}
      </button>
    </div>
  );
};
