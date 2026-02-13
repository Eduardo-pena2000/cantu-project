"use client";

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { signOut } from "next-auth/react";

let isRedirecting = false;

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: async function (error) {
      if (isRedirecting) return;

      if (error.status === 401) {
        isRedirecting = true;
        await signOut();
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: async function (error) {
      if (isRedirecting) return;

      if (error.status === 401) {
        isRedirecting = true;
        await signOut();
      }
    },
  }),
});

export function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
