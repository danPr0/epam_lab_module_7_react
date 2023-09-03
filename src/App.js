import { BrowserRouter } from 'react-router-dom'
import Router from './routing/routes'
import 'bootstrap/dist/css/bootstrap.css'
import './css/elements/root.scss'


function App() {
    return (
        <BrowserRouter>
            <Router />
        </BrowserRouter>
    )
}

export default App
