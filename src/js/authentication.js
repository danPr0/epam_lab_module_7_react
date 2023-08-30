export function isAuthenticated() {
    return localStorage.getItem('authenticated') === 'true'
}
