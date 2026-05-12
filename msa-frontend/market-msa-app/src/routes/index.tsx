import { createFileRoute } from '@tanstack/react-router'
import Landing from '@components/Landing/Landing'

export const Route = createFileRoute('/')({
  component: Landing,
})