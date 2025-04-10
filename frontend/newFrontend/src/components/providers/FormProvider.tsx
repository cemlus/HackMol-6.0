import React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

type QueryProviderProps = {
  children: React.ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,  // 1 min
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}