"use client";

import "@/styles/globals.scss"
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react"
import { QueryClient, QueryClientProvider } from "react-query"

const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <ColorModeScript/>
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider>
            {children}
          </ChakraProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}

