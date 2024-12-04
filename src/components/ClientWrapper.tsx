"use client"; 

import { QueryClient, QueryClientProvider } from "react-query";
import JobTracker from "./JobTracker";


const queryClient = new QueryClient();

const ClientWrapper: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <JobTracker />
    </QueryClientProvider>
  );
};

export default ClientWrapper;
