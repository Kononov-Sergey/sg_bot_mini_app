import { createFileRoute } from '@tanstack/react-router'
import { AboutPage } from '../route-components'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})
