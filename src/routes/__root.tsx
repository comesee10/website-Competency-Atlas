import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { NotFoundPage } from '@/components/error-pages'

import { SiteFooter, SiteHeader } from '@/components/atlas/layout'

import '../styles.css'

const siteName = 'Профессии·2030 — атлас востребованных профессий'
const siteDescription =
  'Опросник по предметам ЕГЭ и ОГЭ, подбор профессий 2027–2030 гг., вузов, колледжей и проходных баллов.'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: siteName,
      },
      {
        name: 'description',
        content: siteDescription,
      },
      {
        property: 'og:title',
        content: siteName,
      },
      {
        property: 'og:description',
        content: siteDescription,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=PT+Serif:ital,wght@0,400;0,700;1,400&display=swap&subset=cyrillic',
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFoundPage,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="grain" aria-hidden />
        <TooltipProvider>
          <SiteHeader />
          <main className="mx-auto max-w-content px-4 sm:px-6">{children}</main>
          <SiteFooter />
        </TooltipProvider>
        <Toaster />
        <Scripts />
      </body>
    </html>
  )
}
