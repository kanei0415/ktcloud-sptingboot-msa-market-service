import { createFileRoute } from '@tanstack/react-router'
import SignUpContainer from '@components/SignUp/containers/SignUpContainer'

export const Route = createFileRoute('/sign-up')({
  component: SignUpContainer,
})