import { Navigate} from 'react-router-dom'
import { isAuthenticated } from '../js/authentication'

export default function ProtectedRoute({children}) {
    return isAuthenticated() ? children : <Navigate to="/login"/>;
}