import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import VerificationPage from "./pages/verification";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <VerificationPage />
    </QueryClientProvider>
  );
};

export default App;
