import { useNavigate } from 'react-router-dom'
import LoginFormInput from './formInputs/loginFormInput'

import axios from 'axios'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { Button } from 'react-bootstrap'

import styles from '../css/login.module.scss'

function LoginForm() {
    const navigate = useNavigate()

    const validationSchema = () =>
        Yup.object({
            email: Yup.string().email('Must be valid email').required('Required'),
            password: Yup.string()
                .min(4, 'Must be 4-30 characters')
                .max(30, 'Must be 4-30 characters')
                .required('Required')
        })

    return (
        <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={(values) => handleFormSubmit(values)}
        >
            {(formik) =>
                <Form className={styles.login__form}>
                    <LoginFormInput className="mb-3" type="text" placeholder="Email" name="email" />
                    <LoginFormInput type="password" placeholder="Password" name="password" />

                    <div className={`text-danger ${styles.form__error}`} id="loginFormError"></div>

                    <Button className={formik.isValid ? '' : 'disabled'} disabled={!formik.isValid} type="submit">
                        Login
                    </Button>
                </Form>
            }
        </Formik>
    )

    function handleFormSubmit(values) {
        axios
            .post('/api/auth/sign-in', values)
            .then(() => {
                localStorage.setItem('email', values.email)
                localStorage.setItem('authenticated', 'true')

                handleAuthExpiration()
                navigate('/certificates')
            })
            .catch(error => {
                    document.getElementById('loginFormError').textContent = error.response.data.errorMessage
                }
            )
    }

    function handleAuthExpiration() {
        const interval = setInterval(
            () => {
                axios.get('/api/check-authentication').catch((error) => {
                    if (error.response.status === 401) {
                        localStorage.setItem('authenticated', 'false')
                        clearInterval(interval)
                        location.reload()
                    }
                })
            }, 15 * 60 * 1000
        )
    }
}

export default LoginForm
