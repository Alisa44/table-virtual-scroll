import './App.css'
import PublicationsTable from "./components/Table/PublicationsTable.tsx";
import { Provider } from './components/ui/provider.tsx'
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Provider>
                <PublicationsTable/>
            </Provider>
        </QueryClientProvider>
    )
}

export default App
