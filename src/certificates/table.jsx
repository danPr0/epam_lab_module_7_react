import React, { useContext, useState } from 'react'
import { Button } from 'react-bootstrap'
import DeleteItemModal from '../modals/deleteItemModal'
import AddItemModal from '../modals/addItemModal'
import CertificatesContext from '../context/certificatesContext'
import AddItemModalContext from '../context/addItemModalContext'

import axios from 'axios'
import { ExpandLess, ExpandMore, UnfoldMore } from '@mui/icons-material'

import styles from '../css/certificates/table.module.scss'
import { isAuthenticated } from '../js/authentication'

function Table(props) {
    const { certificates, fetchCertificates, dateSort, nameSort, setDateSort, setNameSort } =
              useContext(CertificatesContext)

    const [editModalDisplay, setEditModalDisplay] = useState(false)
    const [editModalPresetValues, setEditModalPresetValues] = useState(null)
    const [deleteModalDisplay, setDeleteModalDisplay] = useState(false)
    const [certificateToDelete, setCertificateToDelete] = useState({})

    return (
        <>
            <table className={`mb-4 ${styles.table}`}>
                <thead>
                <tr>
                    <th className={`${styles.cursorPointer}`} onClick={() => setDateSort(getNextSort(dateSort))}>
                        <div className="d-flex align-items-center">
                            {getSortIcon(dateSort)}
                            <span>Datetime</span>
                        </div>
                    </th>
                    <th className={`${styles.cursorPointer}`} onClick={() => setNameSort(getNextSort(nameSort))}>
                        <div className="d-flex align-items-center">
                            {getSortIcon(nameSort)}
                            <span>Title</span>
                        </div>
                    </th>
                    <th className={`ps-3`}>Tags</th>
                    <th className={`ps-3`}>Description</th>
                    <th className={`ps-1`}>Price</th>
                    <th className={`ps-3`}>Actions</th>
                </tr>
                </thead>
                <tbody>{getCertificateElements()}</tbody>
            </table>

            <AddItemModalContext.Provider
                value={{presetValues: editModalPresetValues, successCallback: handleEditModalSuccess,
                    onCancel: handleEditModalCancel}}>
                <AddItemModal display={editModalDisplay} />
            </AddItemModalContext.Provider>

            <DeleteItemModal display={deleteModalDisplay} certificate={certificateToDelete}
                             onConfirm={() => handleDeleteModalConfirm(certificateToDelete)}
                             onCancel={handleDeleteModalCancel} />
        </>
    )

    function getCertificateElements() {

        return certificates.map(c =>
            <tr key={c.id}>
                <td className={styles.w20}>{c.createdDate.replace('T', ' ')}</td>
                <td className={styles.w15}>{c.name}</td>
                <td className={styles.w20}>{c.tags.map(t => t + ' ')}</td>
                <td className={styles.w20}>{c.description}</td>
                <td className={styles.w10}>{c.price}</td>
                <td className={styles.w15}>
                    <Button className="btn-sm btn-primary">View</Button>
                    {
                        isAuthenticated()
                            ?
                            <>
                                <Button className='btn-sm btn-warning' onClick={() => handleCertificateEdit(c)}>
                                    Edit
                                </Button>
                                <Button className='btn-sm btn-danger' onClick={() => handleCertificateDelete(c)}>
                                    Delete
                                </Button>
                            </>
                            : null
                    }
                </td>
            </tr>
        )
    }

    function handleCertificateEdit(values) {
        setEditModalPresetValues(values)
        setEditModalDisplay(true)
    }

    function handleEditModalSuccess(message) {
        setEditModalDisplay(false)
        setEditModalPresetValues(null)
        props.setSuccessMessage(message)
        fetchCertificates()
    }

    function handleEditModalCancel() {
        setEditModalDisplay(false)
        setEditModalPresetValues(null)
    }

    function handleCertificateDelete(certificate) {
        setDeleteModalDisplay(true)
        setCertificateToDelete(certificate)
    }

    function handleDeleteModalConfirm(certificate) {
        setDeleteModalDisplay(false)

        axios
        .delete(`/api/gift-certificates/${certificate.id}`)
        .then(() => {
            props.setSuccessMessage(`Coupon "${certificate.name}" was deleted.`)
            fetchCertificates()
        })
        .catch(error => {
            props.setErrorMessage(error.response.data.errorMessage)
            fetchCertificates()
        })
    }

    function handleDeleteModalCancel() {
        setDeleteModalDisplay(false)
    }

    function getNextSort(currentSort) {
        if (currentSort === 'asc') {
            return 'desc'
        } else if (currentSort === 'desc') {
            return null
        } else {
            return 'asc'
        }
    }

    function getSortIcon(sort) {
        if (sort === 'asc') {
            return <ExpandLess />
        } else if (sort === 'desc') {
            return <ExpandMore />
        } else {
            return <UnfoldMore />
        }
    }
}

export default Table
