import {Button} from 'react-bootstrap'
import {Form, Formik} from 'formik'
import * as Yup from "yup";
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import {useState} from 'react'
import LoginFormInput from './formElements/loginFormInput'

function LoginForm() {

    const [declinedRequestMessage, setDeclinedRequestMessage] = useState('')
    const navigate = useNavigate()

    const validationSchema = () =>
        Yup.object({
            email: Yup.string()
                      .min(3, 'Must be 3-30 characters')
                      .max(30, 'Must be 3-30 characters')
                      .required('Required'),
            password: Yup.string()
                      .min(4, 'Must be 4-30 characters')
                      .max(30, 'Must be 4-30 characters')
                      .required('Required')
        })

    return (
        <Formik initialValues={{
            email: '',
            password: ''
        }}
                validationSchema={validationSchema}
                onSubmit={values => handleSubmit(values)}
        >
            {formik => (
                <Form className="login-form">
                    <div className="login-form__inputs-group">
                        <LoginFormInput className="mb-3" type="text" placeholder="Email" name="email"/>
                        <LoginFormInput type="password" placeholder="Password" name="password"/>
                    </div>

                    <div className="text-danger login-error-msg">{declinedRequestMessage}</div>

                    <Button className={formik.isValid ? "" : "disabled"} disabled={!formik.isValid}
                            type="submit">
                        Login
                    </Button>
                </Form>
            )}
        </Formik>
    )

    function handleSubmit(values) {
        axios
        .post('/auth/sign-in', values)
        .then(() => {
            sessionStorage.setItem('email', values.email)
            navigate('/certificates')
        })
        .catch(error => setDeclinedRequestMessage(error.response.data.errorMessage))
    }
}

export default LoginForm