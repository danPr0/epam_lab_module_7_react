import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../js/authentication'

export default function IfNotAuthenticated({children}) {
    return isAuthenticated() ? <Navigate to="/certificates"/> : children;
}
