import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useSignIn } from '@services/rest-api/auth-service';
import { ROUTE_PATHS } from '@libs/route-config';
import { useSnackbar } from '@components/common/Snackbar/snackbar-context';
import Login from '../Login';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginContainer = () => {
  const navigate = useNavigate();
  const { notify } = useSnackbar();
  const { mutate: signIn, isPending } = useSignIn();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const emailError = useMemo(
    () => (email.length > 0 && !EMAIL_PATTERN.test(email) ? '올바른 이메일 형식이 아닙니다' : ''),
    [email],
  );
  const passwordError = useMemo(
    () => (password.length > 0 && password.length < 4 ? '비밀번호는 4자 이상이어야 합니다' : ''),
    [password],
  );

  const canSubmit =
    email.length > 0 && password.length > 0 && !emailError && !passwordError && !isPending;

  const onLoginButtonClicked = useCallback(() => {
    if (!canSubmit) return;
    signIn(
      { email, password },
      {
        onSuccess: () => {
          notify('로그인 되었습니다', 'success');
          navigate({ to: ROUTE_PATHS.products });
        },
        onError: (error) => {
          notify(`로그인 실패: ${error.message}`, 'error');
        },
      },
    );
  }, [canSubmit, signIn, email, password, notify, navigate]);

  return (
    <Login
      email={email}
      password={password}
      emailError={emailError}
      passwordError={passwordError}
      isSubmitting={isPending}
      canSubmit={canSubmit}
      onLoginButtonClicked={onLoginButtonClicked}
      onEmailChanged={setEmail}
      onPasswordChanged={setPassword}
    />
  );
};

export default LoginContainer;
