import React from "react";
import { QueryCache, QueryClient, QueryClientProvider } from "react-query";

// PROVIDERS and THEME Config
function ReactQueryConfig(props: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (query.state.data !== undefined) {
          // alert
        }
      },
    }),
  });
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  );
}

export default ReactQueryConfig;
