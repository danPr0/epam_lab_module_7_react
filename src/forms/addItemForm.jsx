import {Form, Formik, useField} from 'formik'
import styles from '../css/addItemModal.module.css'
import AddItemFormInput from './formElements/addItemFormInput'
import React, {useState} from 'react'
import {Button} from 'react-bootstrap'
import * as Yup from 'yup'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import MaterialIcon from 'react-google-material-icons'

function AddItemForm() {

    const navigate = useNavigate()
    const [tags, setTags] = useState([])
    const [declinedRequestMessage, setDeclinedRequestMessage] = useState('')

    const validationSchema = () =>
        Yup.object({
            name: Yup.string()
                   .min(6, 'Must be 6-30 characters')
                   .max(30, 'Must be 6-30 characters')
                   .required('Required'),
            description: Yup.string()
                   .min(12, 'Must be 12-1000 characters')
                   .max(1000, 'Must be 12-1000 characters')
                   .required('Required'),
            price: Yup.number()
                   .min(0)
                   .required('Required'),
            duration: Yup.number()
                   .min(0)
                   .required('Required')
        })

    function validateTag(tagName) {
        return tagName.length >= 3 && tagName.length <= 15
    }

    return (
        <Formik initialValues={{
            name: '',
            description: '',
            price: '',
            duration: ''
        }}
                validationSchema={validationSchema}
                onSubmit={values => onFormSubmit(values)}>
            {formik => (
                <Form>
                    <div className={`text-danger ${styles.error}`}>
                        <span style={{height: '24px'}}><MaterialIcon icon="error" size={24}/></span>
                        <span className={styles.error__message}>dfsdfdlk fjsdklfjkl{declinedRequestMessage}</span>
                    </div>
                    <AddItemFormInput type='text' name='name' label='Title'/>
                    <div className={styles.inputGroupContainer}>
                        <label className={styles.inputGroup}>
                            <span className={styles.inputGroup__label}>Description</span>
                            <textarea className={styles.inputGroup__input + ' ' + styles.inputGroup__textarea} name='description' {...formik.getFieldProps('description')}/>
                        </label>
                        <div className={`text-danger ${styles.inputGroup__error}`}>{formik.touched.description && formik.errors.description ? formik.errors.description : ''}</div>
                    </div>
                    <AddItemFormInput type='text' name='duration' label='Duration'/>
                    <AddItemFormInput type='text' name='price' label='Price'/>
                    <div className={styles.inputGroupContainer}>
                        <label className={styles.inputGroup}>
                            <span className={styles.inputGroup__label}>Tags</span>
                            <input type='text' name='description' className={styles.inputGroup__input} id="tagNameInput"/>
                            <Button className={`btn-primary ${styles.addTagButton}`} onClick={() => {
                                const tagToAdd = document.getElementById('tagNameInput').value
                                const tagErrorElement = document.getElementById('tagValidationError')

                                if (!validateTag(tagToAdd)) {
                                    tagErrorElement.textContent = 'Must be 3-15 characters'
                                } else if (tags.indexOf(tagToAdd) !== -1) {
                                    tagErrorElement.textContent = 'Such tag already exists'
                                } else {
                                    tagErrorElement.textContent = ''
                                    setTags([...tags, tagToAdd])
                                }
                            }}>Add</Button>
                        </label>
                        <div className={`text-danger ${styles.inputGroup__error}`} id="tagValidationError"></div>
                    </div>
                    <div className={styles.tagList}>
                        {
                            tags.map((t, index) => <button className={`btn btn-outline-dark`} key={index} onClick={() => {
                                setTags(tags => tags.filter(t1 => t1 !== t))
                            }}>{t + ' X'}</button>)
                        }
                    </div>
                    <div className={styles.formActions}>
                        <Button className={styles.submitButton} type="submit">Submit</Button>
                        <Button className="btn-secondary">Cancel</Button>
                    </div>
                </Form>
            )
            }
        </Formik>
    )

    function onFormSubmit(values) {
        console.log('here')
        console.log(tags)
        values.tags = tags
        console.log(values)

        axios
        .post('/gift-certificates', values)
        .then(() => {
            // sessionStorage.setItem('email', values.email)
            // navigate('/certificates')
            console.log('success')
        })
        .catch(error => setDeclinedRequestMessage(error.response.data.errorMessage))
    }
}

export default AddItemForm
