import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Stack,
} from '@mui/material';
import { ROUTE_PATHS } from '@libs/route-config';
import { ButtonLink } from '@libs/router-link';

interface Props {
  email: string;
  password: string;
  emailError: string;
  passwordError: string;
  isSubmitting: boolean;
  canSubmit: boolean;
  onLoginButtonClicked: () => void;
  onEmailChanged: (email: string) => void;
  onPasswordChanged: (password: string) => void;
}

const Login = ({
  email,
  password,
  emailError,
  passwordError,
  isSubmitting,
  canSubmit,
  onLoginButtonClicked,
  onEmailChanged,
  onPasswordChanged,
}: Props) => {
  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
          <Typography
            component="h1"
            variant="h5"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            로그인
          </Typography>

          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              onLoginButtonClicked();
            }}
          >
            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField
                required
                fullWidth
                label="이메일 주소"
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                variant="outlined"
                value={email}
                error={Boolean(emailError)}
                helperText={emailError}
                onChange={(e) => onEmailChanged(e.target.value)}
              />

              <TextField
                required
                fullWidth
                name="password"
                label="비밀번호"
                type="password"
                autoComplete="current-password"
                variant="outlined"
                value={password}
                error={Boolean(passwordError)}
                helperText={passwordError}
                onChange={(e) => onPasswordChanged(e.target.value)}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                sx={{ mt: 1, py: 1.5, fontWeight: 'bold' }}
                disabled={!canSubmit}
              >
                {isSubmitting ? '로그인 중…' : '로그인'}
              </Button>
            </Stack>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" component="span">
              계정이 없으신가요?{' '}
            </Typography>
            <ButtonLink to={ROUTE_PATHS.signUp} variant="text" size="small">
              회원가입
            </ButtonLink>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
