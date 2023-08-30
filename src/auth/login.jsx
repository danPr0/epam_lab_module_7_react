import Header from '../pageElements/header'
import Footer from '../pageElements/footer'
import LoginForm from '../forms/loginForm'
import styles from '../css/login.module.scss'

function Login() {
    return (
        <>
            <Header />
            <main className={styles.login}>
                <h2 className={`m-0 py-4 text-center ${styles.login__header}`}>Login</h2>
                <div className={styles.login__formContainer}>
                    <LoginForm />
                </div>
            </main>
            <Footer />
        </>
    )
}

export default Login
