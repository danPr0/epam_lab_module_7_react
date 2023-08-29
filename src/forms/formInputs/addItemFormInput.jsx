import React from 'react'
import { useField } from 'formik'
import styles from '../../css/addItemModal.module.scss'

function AddItemFormInput({ label, inputTag, ...props }) {

    const [field, meta] = useField(props)

    return (
        <div className={styles.inputGroupContainer}>
            <label className={styles.inputGroup}>
                <span className={styles.inputGroup__label}>{label}</span>
                {
                    inputTag === 'textarea'
                        ? <textarea {...field} {...props} className={styles.inputGroup__textarea} />
                        : <input {...field} {...props} className={styles.inputGroup__input} />
                }
            </label>
            <div className={`text-danger ${styles.inputGroup__error}`}>
                {meta.touched && meta.error ? meta.error : ''}
            </div>
        </div>
    )
}

export default AddItemFormInput
