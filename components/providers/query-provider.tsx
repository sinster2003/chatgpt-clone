"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export function QueryProvider({ children } : { children : React.ReactNode }) {
    /*
        useState calls the initializer function only on the first render and 
        returns the same queryClient instance on other rerenders
    */
    const [queryClient] = useState(() => 
        new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: 30 * 1000
                }
            }
        }
    ));

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}