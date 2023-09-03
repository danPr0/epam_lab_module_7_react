import { useRoutes } from 'react-router-dom'
import ErrorPage from './errorPage'
import Login from '../auth/login'
import Certificates from '../certificates/certificates'
import IfNotAuthenticated from '../filterRoutes/ifNotAuthenticated'


export default function Router() {
    return useRoutes([
        { path: '/login', element: <IfNotAuthenticated><Login /></IfNotAuthenticated>, errorElement: <ErrorPage /> },
        { path: '/certificates', element: <Certificates />, errorElement: <ErrorPage /> }
    ])
}
