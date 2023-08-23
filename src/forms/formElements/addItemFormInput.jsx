import React from 'react'
import {useField} from 'formik'
import styles from '../../css/addItemModal.module.css'

function AddItemFormInput({className, label, ...props}) {
    const [field, meta] = useField(props)

    return (
        <div className={styles.inputGroupContainer}>
            <label className={styles.inputGroup}>
                <span className={styles.inputGroup__label}>{label}</span>
                <input {...field} {...props} className={styles.inputGroup__input}/>
            </label>
            <div className={`text-danger ${styles.inputGroup__error}`}>{meta.touched && meta.error ? meta.error : ''}</div>
        </div>
    )
}

export default AddItemFormInput;