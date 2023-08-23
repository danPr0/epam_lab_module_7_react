import Header from '../pageElements/header'
import Footer from '../pageElements/footer'
import LoginForm from '../forms/loginForm'
import styles from '../css/login.module.css'

function Login() {

    return (
        <>
            <Header/>
            <main className={styles.loginRoot}>
                <h2 className="m-0 py-4 text-center login-header">Login</h2>
                <div className="login-form-container">
                    <LoginForm/>
                </div>
            </main>
            <Footer/>
        </>
    )
}

export default Login