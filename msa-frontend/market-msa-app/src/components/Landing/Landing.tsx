import { type ReactNode } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Grid,
  Paper,
} from '@mui/material';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SecurityIcon from '@mui/icons-material/Security';
import { ROUTE_PATHS } from '@libs/route-config';
import { useAuthStore, selectIsAuthenticated } from '@store/useAuthStore';
import { palette } from '@libs/theme';
import { ButtonLink } from '@libs/router-link';

function Landing() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  return (
    <Box sx={{ bgcolor: palette.surface, minHeight: '100vh' }}>
      <Box
        sx={{
          background: `linear-gradient(135deg, ${palette.navyDark} 0%, ${palette.navy} 100%)`,
          color: 'white',
          pt: 12,
          pb: 15,
          clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0% 100%)',
        }}
      >
        <Container maxWidth="md">
          <Stack spacing={4} sx={{ alignItems: 'center', textAlign: 'center' }}>
            <CloudQueueIcon sx={{ fontSize: 60, color: palette.sky }} />
            <Typography
              variant="h2"
              sx={{ fontWeight: 800, letterSpacing: -1 }}
            >
              KT Cloud{' '}
              <Box component="span" sx={{ color: palette.sky }}>
                Market
              </Box>{' '}
              MSA
            </Typography>
            <Typography
              variant="h5"
              sx={{ opacity: 0.8, fontWeight: 300, lineHeight: 1.6 }}
            >
              확장 가능한 마이크로서비스 아키텍처를 경험하세요.
              <br />
              기업의 성장을 가속화하는 클라우드 네이티브 솔루션 마켓플레이스입니다.
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
              <ButtonLink
                to={isAuthenticated ? ROUTE_PATHS.products : ROUTE_PATHS.signIn}
                variant="contained"
                size="large"
                sx={{
                  bgcolor: palette.sky,
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': { bgcolor: palette.skyDark },
                }}
              >
                {isAuthenticated ? '대시보드로 이동' : '시작하기'}
              </ButtonLink>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -8, pb: 10 }}>
        <Grid container spacing={4}>
          <FeatureCard
            icon={<RocketLaunchIcon color="primary" />}
            title="고성능 배포"
            description="Docker와 Kubernetes를 기반으로 한 신속한 MSA 환경 배포 시스템"
          />
          <FeatureCard
            icon={<SecurityIcon color="primary" />}
            title="보안 안정성"
            description="KT Cloud의 보안 인프라를 통한 철저한 데이터 암호화 및 격리"
          />
          <FeatureCard
            icon={<CloudQueueIcon color="primary" />}
            title="유연한 확장"
            description="트래픽 변화에 즉각 대응하는 자동 스케일링 인프라 구조"
          />
        </Grid>
      </Container>

      <Box sx={{ py: 5, textAlign: 'center', bgcolor: 'background.paper' }}>
        <Typography variant="body2" color="text.secondary">
          © 2026 KT Cloud Market MSA. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
}

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Grid size={{ xs: 12, md: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 4,
          border: `1px solid ${palette.border}`,
          transition: '0.3s',
          '&:hover': {
            transform: 'translateY(-10px)',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
          },
        }}
      >
        <Box sx={{ mb: 2 }}>{icon}</Box>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Paper>
    </Grid>
  );
}

export default Landing;
