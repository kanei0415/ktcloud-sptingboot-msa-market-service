import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useSignUp } from '@services/rest-api/auth-service';
import { ROUTE_PATHS } from '@libs/route-config';
import { useSnackbar } from '@components/common/Snackbar/snackbar-context';
import SignUp from '../SignUp';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignUpContainer = () => {
  const navigate = useNavigate();
  const { notify } = useSnackbar();
  const { mutate: signUp, isPending } = useSignUp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const emailError = useMemo(
    () => (email.length > 0 && !EMAIL_PATTERN.test(email) ? '올바른 이메일 형식이 아닙니다' : ''),
    [email],
  );
  const passwordError = useMemo(
    () => (password.length > 0 && password.length < 8 ? '비밀번호는 8자 이상이어야 합니다' : ''),
    [password],
  );
  const nameError = useMemo(
    () => (name.length > 0 && name.trim().length === 0 ? '이름을 입력해주세요' : ''),
    [name],
  );

  const canSubmit =
    email.length > 0 &&
    password.length > 0 &&
    name.trim().length > 0 &&
    !emailError &&
    !passwordError &&
    !nameError &&
    !isPending;

  const onSignUpButtonClicked = useCallback(() => {
    if (!canSubmit) return;
    signUp(
      { email, password, name: name.trim() },
      {
        onSuccess: () => {
          notify('회원가입이 완료되었습니다. 로그인해주세요', 'success');
          navigate({ to: ROUTE_PATHS.signIn });
        },
        onError: (error) => {
          notify(`회원가입 실패: ${error.message}`, 'error');
        },
      },
    );
  }, [canSubmit, signUp, email, password, name, notify, navigate]);

  return (
    <SignUp
      email={email}
      password={password}
      name={name}
      emailError={emailError}
      passwordError={passwordError}
      nameError={nameError}
      isSubmitting={isPending}
      canSubmit={canSubmit}
      onSignUpButtonClicked={onSignUpButtonClicked}
      onEmailChanged={setEmail}
      onPasswordChanged={setPassword}
      onNameChanged={setName}
    />
  );
};

export default SignUpContainer;
