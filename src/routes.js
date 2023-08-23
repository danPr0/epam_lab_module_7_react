import {useRoutes} from "react-router-dom"
import ErrorPage from './errorPage'
import Login from './auth/login'
import Certificates from './certificates/certificates'

export default function Router() {
    return useRoutes([
        {path: "/login", element: <Login/>, errorElement: <ErrorPage/>},
        {path: "/certificates", element: <Certificates/>, errorElement: <ErrorPage/>}
    ])
}
