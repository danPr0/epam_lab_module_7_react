import React from 'react'
import {useField} from 'formik'
import {Form} from 'react-bootstrap'

function LoginFormInput({className, ...props}) {
    // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
    // which we can spread on <input>. We can use field meta to show an error
    // message if the field is invalid and it has been touched (i.e. visited)
    const [field, meta] = useField(props)

    return (
        <div className={className}>
            <Form.Control {...field} {...props} className={meta.touched && meta.error ? "is-invalid" : ""}/>
            <div className="invalid-feedback">{meta.touched && meta.error ? meta.error : ''}</div>
        </div>
    )
}

export default LoginFormInput;