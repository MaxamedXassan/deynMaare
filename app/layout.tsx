import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "DeynMaare",
  description: "Loan management app for small businesses",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen text-gray-900">
        <main className="max-w-md mx-auto py-10">{children}</main>
      </body>
    </html>
  )
}
