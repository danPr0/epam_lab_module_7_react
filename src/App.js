import { BrowserRouter } from 'react-router-dom'
import Router from './routing/routes'
import 'bootstrap/dist/css/bootstrap.css'

function App() {
    return (
        <BrowserRouter>
            <Router />
        </BrowserRouter>
    )
}

export default App
