import { createFileRoute } from '@tanstack/react-router';
import LoginContainer from '@components/Login/containers/LoginContainer';

interface SignInSearch {
  redirect?: string;
}

export const Route = createFileRoute('/sign-in')({
  validateSearch: (search: Record<string, unknown>): SignInSearch => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  component: LoginContainer,
});
