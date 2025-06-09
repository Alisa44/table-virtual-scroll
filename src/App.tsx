import './App.css'
import PublicationsTable from "./components/Table/PublicationsTable.tsx";
import { Provider } from './components/ui/provider.tsx'

function App() {
  return (
    <Provider>
      <PublicationsTable/>
    </Provider>
  )
}

export default App
