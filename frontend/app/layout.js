import './globals.css'
import { Nunito, Great_Vibes } from 'next/font/google'

const nunito = Nunito({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-nunito',
  weight: ['400', '600', '700', '800'],
})

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-script',
})

export const metadata = {
  title: 'Wedding RSVP',
  description: 'Xác nhận tham dự đám cưới',
}

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={`${nunito.variable} ${greatVibes.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
