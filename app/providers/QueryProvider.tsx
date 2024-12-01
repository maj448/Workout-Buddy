//This code was taken from https://notjust.notion.site/React-Native-Supabase-Masterclass-47a69a60bc464c399b5a0df4d3c4a630
// a tutorial made to connect a react native expo app to supabase

//This code allows the Query client to be used in all files contained in the query provider without having to wrap the code in the QueryClientProvider each time

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';

const client = new QueryClient();

export default function QueryProvider({ children }: PropsWithChildren) {
  return <QueryClientProvider client={client}>
    {children}</QueryClientProvider>;
}