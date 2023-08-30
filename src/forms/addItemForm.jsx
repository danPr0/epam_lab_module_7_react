import React, { useContext, useReducer } from 'react'
import AddItemFormInput from './formInputs/addItemFormInput'
import AddItemModalContext from '../context/addItemModalContext'

import axios from 'axios'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { Button } from 'react-bootstrap'
import { Error } from '@mui/icons-material'

import styles from '../css/addItemModal.module.scss'

function AddItemForm() {
    const { presetValues, successCallback, onCancel } = useContext(AddItemModalContext)

    const tagsReducer = (tags, action) => {
        switch (action.type) {
            case 'add':
                return [...tags, action.payload]
            case 'remove':
                return tags.filter((t) => t !== action.payload)
            default:
                break
        }
    }
    const [tags, dispatchTags] = useReducer(
        (state, action) => tagsReducer(state, action),
        presetValues !== null ? presetValues.tags : []
    )

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
                   .typeError('Must be number')
                   .positive('Must be positive number')
                   .required('Required'),
            duration: Yup.number()
                      .typeError('Must be number')
                      .integer('Must be non-negative integer number')
                      .min(0, 'Must be non-negative integer number')
                      .required('Required')
        })

    const initialFormValues =
        presetValues !== null
            ? {
                  name: presetValues.name,
                  description: presetValues.description,
                  price: presetValues.price,
                  duration: presetValues.duration
              }
            : { name: '', description: '', price: '', duration: '' }

    return (
        <Formik
            initialValues={initialFormValues}
            validationSchema={validationSchema}
            onSubmit={(values) => handleFormSubmit(values, successCallback)}
        >
            {(formik) =>
                <Form>
                    <div className={`text-danger d-none ${styles.error}`} id="addItemError">
                        <Error className={styles.error__icon} />
                        <span className={styles.error__message} id="addItemErrorMessage"></span>
                    </div>

                    <AddItemFormInput type="text" name="name" label="Title" />
                    <AddItemFormInput type="text" name="description" label="Description" inputTag="textarea" />
                    <AddItemFormInput type="text" name="duration" label="Duration" />
                    <AddItemFormInput type="text" name="price" label="Price" />

                    <div className={styles.inputGroupContainer}>
                        <label className={styles.inputGroup}>
                            <span className={styles.inputGroup__label}>Tags</span>
                            <input type="text" className={styles.inputGroup__input} id="tagNameInput" />
                            <Button className={`btn-primary ${styles.addTagButton}`} onClick={handleTagInputSubmit}>
                                Add
                            </Button>
                        </label>
                        <div className={`text-danger ${styles.inputGroup__error}`} id="tagValidationError"></div>
                    </div>

                    <div className={styles.tagList}>
                        {tags.map((t) =>
                            <button className="btn btn-outline-dark" key={t} onClick={() => deleteTag(t)}>
                                {t + ' X'}
                            </button>
                        )}
                    </div>

                    <div className={styles.formActions}>
                        <Button className={`${formik.isValid ? '' : 'disabled'} ${styles.formActions__submit}`}
                                type="submit">Submit
                        </Button>
                        <Button className="btn-secondary" onClick={onCancel}>
                            Cancel
                        </Button>
                    </div>
                </Form>
            }
        </Formik>
    )

    function handleTagInputSubmit() {
        const tagToAdd = document.getElementById('tagNameInput').value
        const tagErrorElement = document.getElementById('tagValidationError')

        if (!validateTag(tagToAdd)) {
            tagErrorElement.textContent = 'Must be 3-15 characters'
        } else if (tags.indexOf(tagToAdd) !== -1) {
            tagErrorElement.textContent = 'Such tag already exists'
        } else {
            tagErrorElement.textContent = ''
            dispatchTags({ type: 'add', payload: tagToAdd })
        }

        function validateTag(tagName) {
            return tagName.length >= 3 && tagName.length <= 15
        }
    }

    function deleteTag(tagName) {
        dispatchTags({ type: 'remove', payload: tagName })
    }

    function handleFormSubmit(values, successCallback) {
        values.tags = tags
        if (presetValues === null) {
            addCertificate(values, successCallback)
        } else {
            editCertificate(values, successCallback)
        }
    }

    function addCertificate(values, successCallback) {
        axios
        .post('/api/gift-certificates', values)
        .then(() => {
            document.getElementById('addItemError').classList.add('d-none')
            successCallback(`Coupon "${values.name}" was added.`)
        })
        .catch((error) => {
            document.getElementById('addItemError').classList.remove('d-none')
            document.getElementById('addItemErrorMessage').textContent = error.response.data.errorMessage
        })
    }

    function editCertificate(values, successCallback) {
        axios
        .patch(`/api/gift-certificates/${presetValues.id}`, values)
        .then(() => {
            document.getElementById('addItemError').classList.add('d-none')
            successCallback(`Coupon "${values.name}" was edited.`)
        })
        .catch((error) => {
            document.getElementById('addItemError').classList.remove('d-none')
            document.getElementById('addItemErrorMessage').textContent = error.response.data.errorMessage
        })
    }
}

export default AddItemForm
