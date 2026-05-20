import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Stack,
  InputAdornment,
  Divider,
} from '@mui/material';
import {
  EmailOutlined,
  LockOutlined,
  PersonOutlined,
  AppRegistrationOutlined,
} from '@mui/icons-material';
import { ROUTE_PATHS } from '@libs/route-config';
import { palette } from '@libs/theme';
import { ButtonLink } from '@libs/router-link';

interface Props {
  email: string;
  password: string;
  name: string;
  emailError: string;
  passwordError: string;
  nameError: string;
  isSubmitting: boolean;
  canSubmit: boolean;
  onSignUpButtonClicked: () => void;
  onEmailChanged: (email: string) => void;
  onPasswordChanged: (password: string) => void;
  onNameChanged: (name: string) => void;
}

const SignUp = ({
  email,
  password,
  name,
  emailError,
  passwordError,
  nameError,
  isSubmitting,
  canSubmit,
  onSignUpButtonClicked,
  onEmailChanged,
  onPasswordChanged,
  onNameChanged,
}: Props) => {
  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper
          elevation={4}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 3,
            borderTop: `6px solid ${palette.sky}`,
          }}
        >
          <Stack spacing={1} sx={{ alignItems: 'center', mb: 3 }}>
            <AppRegistrationOutlined sx={{ fontSize: 40, color: palette.sky }} />
            <Typography variant="h5" color={palette.navy} sx={{ fontWeight: 700 }}>
              계정 생성
            </Typography>
            <Typography variant="body2" color="text.secondary">
              KT Cloud Market MSA 서비스에 가입하세요
            </Typography>
          </Stack>

          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              onSignUpButtonClicked();
            }}
          >
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label="이름"
                placeholder="홍길동"
                value={name}
                error={Boolean(nameError)}
                helperText={nameError}
                onChange={(e) => onNameChanged(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlined color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                fullWidth
                label="이메일 주소"
                type="email"
                placeholder="example@kt.com"
                value={email}
                error={Boolean(emailError)}
                helperText={emailError}
                onChange={(e) => onEmailChanged(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                fullWidth
                label="비밀번호"
                type="password"
                placeholder="8자 이상"
                value={password}
                error={Boolean(passwordError)}
                helperText={passwordError}
                onChange={(e) => onPasswordChanged(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={!canSubmit}
                sx={{
                  py: 1.5,
                  mt: 1,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  bgcolor: palette.navy,
                  '&:hover': { bgcolor: palette.navyDark },
                }}
              >
                {isSubmitting ? '가입 중…' : '회원가입 하기'}
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" component="span">
              이미 계정이 있으신가요?{' '}
            </Typography>
            <ButtonLink
              to={ROUTE_PATHS.signIn}
              variant="text"
              sx={{ fontWeight: 'bold', color: palette.sky }}
            >
              로그인
            </ButtonLink>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignUp;
