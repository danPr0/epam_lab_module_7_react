import React from 'react'
import { useField } from 'formik'
import { Form } from 'react-bootstrap'
import styles from '../../css/login.module.scss'

function LoginFormInput({ className, ...props }) {
    const [field, meta] = useField(props)

    return (
        <div className={`${className} ${styles.form__inputGroup}`}>
            <Form.Control {...field} {...props} className={meta.touched && meta.error ? 'is-invalid' : ''} />
            <div className="invalid-feedback">{meta.touched && meta.error ? meta.error : ''}</div>
        </div>
    )
}

export default LoginFormInput
