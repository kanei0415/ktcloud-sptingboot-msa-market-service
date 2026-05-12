import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Stack
} from '@mui/material';
import { ROUTE_PATHS } from '@libs/route-config';
import { Link } from '@tanstack/react-router';

type Props = {
  onLoginButtonClicked: () => void;
  onEmailChanged: (email: string) => void;
  onPasswordChanged: (password: string) => void;
};

const Login = ({ onLoginButtonClicked, onEmailChanged, onPasswordChanged }: Props) => {
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
        <Paper
          elevation={3}
          sx={{ p: 4, width: '100%', borderRadius: 2 }}
        >
          <Typography component="h1" variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
            로그인
          </Typography>

          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              required
              fullWidth
              label="이메일 주소"
              name="email"
              autoComplete="email"
              autoFocus
              variant="outlined"
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
              onChange={(e) => onPasswordChanged(e.target.value)}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 1, py: 1.5, fontWeight: 'bold' }}
              onClick={onLoginButtonClicked}
            >
              로그인
            </Button>
          </Stack>

          <Box component={Link} to={ROUTE_PATHS.signUp} sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              계정이 없으신가요? <Button variant="text" size="small">회원가입</Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;