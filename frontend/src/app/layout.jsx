import Navbar from '@/components/Navbar/Navbar'
import '@/styles/globals.css'

export const metadata = {
  title: 'E-Booking - Find Your Perfect Stay',
  description: 'Book accommodations worldwide with E-Booking',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}

