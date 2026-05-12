import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Stack,
  InputAdornment,
  Divider
} from '@mui/material';
import {
  EmailOutlined,
  LockOutlined,
  PersonOutlined,
  AppRegistrationOutlined
} from '@mui/icons-material';
import { Link } from '@tanstack/react-router';
import { ROUTE_PATHS } from '@libs/route-config';

type Props = {
  onSignUpButtonClicked: () => void;
  onEmailChanged: (email: string) => void;
  onPasswordChanged: (password: string) => void;
  onNameChanged: (name: string) => void;
};

const SignUp = ({
  onSignUpButtonClicked,
  onEmailChanged,
  onPasswordChanged,
  onNameChanged
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
            borderTop: '6px solid #38bdf8'
          }}
        >
          <Stack spacing={1} alignItems="center" sx={{ mb: 3 }}>
            <AppRegistrationOutlined sx={{ fontSize: 40, color: '#38bdf8' }} />
            <Typography variant="h5" fontWeight="700" color="#102a43">
              계정 생성
            </Typography>
            <Typography variant="body2" color="text.secondary">
              KT Cloud Market MSA 서비스에 가입하세요
            </Typography>
          </Stack>

          <Stack spacing={2.5}>
            <TextField
              fullWidth
              label="이름"
              placeholder="홍길동"
              onChange={(e) => onNameChanged(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlined color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="이메일 주소"
              placeholder="example@kt.com"
              onChange={(e) => onEmailChanged(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="비밀번호"
              type="password"
              placeholder="비밀번호"
              onChange={(e) => onPasswordChanged(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={onSignUpButtonClicked}
              sx={{
                py: 1.5,
                mt: 1,
                fontSize: '1rem',
                fontWeight: 'bold',
                bgcolor: '#102a43', // Dark Navy
                '&:hover': { bgcolor: '#061727' }
              }}
            >
              회원가입 하기
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary">OR</Typography>
          </Divider>

          <Box component={Link} to={ROUTE_PATHS.signIn} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              이미 계정이 있으신가목?{' '}
              <Button variant="text" sx={{ fontWeight: 'bold', color: '#38bdf8' }}>
                로그인
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignUp;