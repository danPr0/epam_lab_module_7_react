import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { useNavigate, createSearchParams, useSearchParams } from 'react-router-dom'
import DeleteItemModal from '../modals/deleteItemModal'
import AddItemModal from '../modals/addItemModal'
import Header from '../pageElements/header'
import Footer from '../pageElements/footer'
import Pagination from './pagination'
import Table from './table'
import SortContext from '../context/sortContext'
import PaginationContext from '../context/paginationContext'
import AddItemModalContext from '../context/addItemModalContext'

import axios from 'axios'
import { Button } from 'react-bootstrap'
import { Close, Error, CheckCircle } from '@mui/icons-material'

import styles from '../css/certificates.module.scss'

function Certificates() {

    const navigate = useNavigate()
    const [urlParams] = useSearchParams()

    const [addModalDisplay, setAddModalDisplay] = useState(false)
    const [addModalPresetValues, setAddModalPresetValues] = useState(null)
    const [deleteModalDisplay, setDeleteModalDisplay] = useState(false)
    const [certificateToDelete, setCertificateToDelete] = useState({})

    const [certificates, setCertificates] = useState([])
    const [certificatesFetch, dispatchCertificatesFetch] =
              useReducer((x) => x + 1, 0, (v) => v)

    const [currentPage, setCurrentPage] = useState(urlParams.get('page') === null ? 1 : parseInt(urlParams.get('page')))
    const [noOfPages, setNoOfPages] = useState(0)
    const [totalPerPage, setTotalPerPage] =
              useState(urlParams.get('total') === null ? 10 : parseInt(urlParams.get('total')))
    const [searchInput, setSearchInput] =
              useState(decodeURIComponent(urlParams.get('search') === null ? '' : urlParams.get('search')))

    const [dateSort, dispatchDateSort] =
              useReducer((sort) => getNextSort(sort), urlParams.get('dateSort'), (v) => v === null ? 'asc' : v)
    const [nameSort, dispatchNameSort] = useReducer((sort) => getNextSort(sort), urlParams.get('nameSort'), (v) => v)

    useEffect(() => {
        document.getElementById('searchInput').value = searchInput
    }, [searchInput])

    const createNavigationParams = useCallback(() => {
        const navigationParams = {
            search: encodeURIComponent(searchInput),
            page: currentPage.toString(),
            total: totalPerPage.toString()
        }
        if (dateSort !== null) {
            navigationParams.dateSort = dateSort
        }
        if (nameSort !== null) {
            navigationParams.nameSort = nameSort
        }

        return navigationParams
    }, [currentPage, dateSort, nameSort, totalPerPage, searchInput])

    const createRequestParams = useCallback(() => {
        const tagPattern = /#\([^)]*\)/g

        const requestParams = new URLSearchParams()
        requestParams.append('textFilter', searchInput.replaceAll(tagPattern, '').trim())
        requestParams.append('page', currentPage.toString())
        requestParams.append('total', totalPerPage.toString())

        let tagsInput = searchInput.match(tagPattern)
        if (tagsInput !== null) {
            tagsInput.forEach((t) => requestParams.append('tagName', t.substring(2, t.length - 1)))
        }

        if (dateSort !== null) {
            requestParams.append('sort', `createDate_${dateSort}`)
        }
        if (nameSort !== null) {
            requestParams.append('sort', `name_${nameSort}`)
        }

        return requestParams
    }, [currentPage, dateSort, nameSort, totalPerPage, searchInput])

    const fetchCertificates = useCallback(() => {
        axios
        .get('/api/gift-certificates', { params: createRequestParams() })
        .then(response => {
            const certificateOnPage = response.data._embedded.giftCertificates.map(c => {
                c.tags = c.tags.map(t => t.name)
                return c
            })
            setCertificates(certificateOnPage)

            if (certificateOnPage.length === 0) {
                document.getElementById('noItemsMessage').classList.remove('d-none')
            } else {
                const totalPages = response.data._embedded.totalPages
                setNoOfPages(totalPages)
                if (currentPage > totalPages) {
                    setCurrentPage(totalPages)
                }
                document.getElementById('noItemsMessage').classList.add('d-none')
            }
        })
        .catch(error => setErrorMessage(error.response.data.errorMessage))
    }, [certificatesFetch, createRequestParams, currentPage])

    useEffect(() => {
        fetchCertificates()
        navigate({
            pathname: '/certificates',
            search:   createSearchParams(createNavigationParams()).toString()
        })
    }, [createNavigationParams, fetchCertificates, navigate])

    return (
        <>
            <Header onAddItemClick={() => setAddModalDisplay(true)} />

            <main className={styles.root}>
                {createErrorPanel()}
                {createSuccessPanel()}

                {createSearchInput()}
                {
                    certificates.length !== 0
                        ?
                        <div className={styles.certificates}>
                            <SortContext.Provider value={{ dateSort, nameSort, setNextDateSort: dispatchDateSort,
                                setNextNameSort: dispatchNameSort }}>
                                <Table certificates={certificates} onItemEdit={handleCertificateEdit}
                                       onItemDelete={handleCertificateDeletion} />
                            </SortContext.Provider>
                            <PaginationContext.Provider
                                value={{ page: currentPage, total: totalPerPage, noOfPages,
                                    setPage: setCurrentPage, setTotal: setTotalPerPage }}>
                                <Pagination />
                            </PaginationContext.Provider>
                        </div>
                        : null
                }
                <div className="d-none text-center" id="noItemsMessage">No certificates found</div>
            </main>

            <AddItemModalContext.Provider
                value={{presetValues: addModalPresetValues, successCallback: handleAddModalSuccess,
                    onCancel: handleAddModalCancel}}>
                <AddItemModal display={addModalDisplay} />
            </AddItemModalContext.Provider>

            <DeleteItemModal display={deleteModalDisplay} certificateId={certificateToDelete.id}
                             onConfirm={() => handleDeleteModalConfirm(certificateToDelete)}
                             onCancel={handleDeleteModalCancel} />
            <Footer />
        </>
    )

    function createErrorPanel() {
        return (
            <div className={`d-none text-danger ${styles.error}`} id="error">
                <Error className={styles.error__icon} />
                <span className={styles.error__message} id="errorMessage"></span>
                <Close className={`${styles.cursorPointer} ${styles.error__icon}`}
                       onClick={(e) => e.currentTarget.parentNode.classList.add('d-none')} />
            </div>
        )
    }

    function createSuccessPanel() {
        return (
            <div className={`d-none ${styles.success}`} id="success">
                <CheckCircle className={styles.success__icon} />
                <span className={styles.success__message} id="successMessage"></span>
                <Close
                    className={`${styles.cursorPointer} ${styles.success__icon}`}
                    onClick={(e) => e.currentTarget.parentNode.classList.add('d-none')} />
            </div>
        )
    }

    function createSearchInput() {
        return (
            <div className="input-group mb-4 search">
                <input className="form-control search__input" id="searchInput" type="text"
                       placeholder="Search..." />
                <div className="input-group-append">
                    <Button className={styles.search__submitButton}
                            onClick={() => setSearchInput(document.getElementById('searchInput').value)}>Go!
                    </Button>
                </div>
            </div>
        )
    }

    function handleCertificateEdit(values) {
        setAddModalPresetValues(values)
        setAddModalDisplay(true)
    }

    function handleCertificateDeletion(certificate) {
        setDeleteModalDisplay(true)
        setCertificateToDelete(certificate)
    }

    function handleAddModalSuccess(message) {
        setAddModalDisplay(false)
        setAddModalPresetValues(null)
        setSuccessMessage(message)
        dispatchCertificatesFetch()
    }

    function handleAddModalCancel() {
        setAddModalDisplay(false)
        setAddModalPresetValues(null)
    }

    function handleDeleteModalConfirm(certificate) {
        setDeleteModalDisplay(false)

        axios
            .delete(`/api/gift-certificates/${certificate.id}`)
            .then(() => {
                setSuccessMessage(`Coupon "${certificate.name}" was deleted.`)
                dispatchCertificatesFetch()
            })
            .catch((error) => {
                setErrorMessage(error.response.data.errorMessage)
                dispatchCertificatesFetch()
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

    function setErrorMessage(message) {
        document.getElementById('success').classList.add('d-none')
        document.getElementById('error').classList.remove('d-none')
        document.getElementById('errorMessage').textContent = message

        setTimeout(() => document.getElementById('error').classList.add('d-none'), 10 * 1000)
    }

    function setSuccessMessage(message) {
        document.getElementById('error').classList.add('d-none')
        document.getElementById('success').classList.remove('d-none')
        document.getElementById('successMessage').textContent = message

        setTimeout(() => document.getElementById('success').classList.add('d-none'), 3 * 1000)
    }
}

export default Certificates