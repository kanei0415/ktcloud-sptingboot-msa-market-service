import { createFileRoute } from '@tanstack/react-router'
import LoginContainer from '@components/Login/containers/LoginContainer'

export const Route = createFileRoute('/sign-in')({
  component: LoginContainer,
})