import { useCallback, useEffect, useReducer, useState } from 'react'
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'
import CertificatesContext from '../context/certificatesContext'
import axios from 'axios'


function CertificatesData({children, ...props}) {

    const navigate = useNavigate()
    const [urlParams] = useSearchParams()

    const [certificates, setCertificates] = useState([])
    const [certificatesFetch, dispatchCertificatesFetch] =
              useReducer((x) => x + 1, 0, (v) => v)

    const [currentPage, setCurrentPage] = useState(urlParams.get('page') === null ? 1 : parseInt(urlParams.get('page')))
    const [noOfPages, setNoOfPages] = useState(0)
    const [pageSize, setPageSize] =
              useState(urlParams.get('total') === null ? 10 : parseInt(urlParams.get('total')))

    const [searchInput, setSearchInput] =
              useState(decodeURIComponent(urlParams.get('search') === null ? '' : urlParams.get('search')))

    const [dateSort, setDateSort] = useState(urlParams.get('dateSort') === null ? 'asc' : urlParams.get('dateSort'))
    const [nameSort, setNameSort] = useState(urlParams.get('nameSort'))

    const createNavigationParams = useCallback(() => {
        const navigationParams = {
            search: encodeURIComponent(searchInput),
            page: currentPage.toString(),
            total: pageSize.toString()
        }
        if (dateSort !== null) {
            navigationParams.dateSort = dateSort
        }
        if (nameSort !== null) {
            navigationParams.nameSort = nameSort
        }

        return navigationParams
    }, [currentPage, dateSort, nameSort, pageSize, searchInput])

    const createRequestParams = useCallback(() => {
        const tagPattern = /#\([^)]*\)/g

        const requestParams = new URLSearchParams()
        requestParams.append('textFilter', searchInput.replaceAll(tagPattern, '').trim())
        requestParams.append('page', currentPage.toString())
        requestParams.append('total', pageSize.toString())

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
    }, [currentPage, dateSort, nameSort, pageSize, searchInput])

    const fetchCertificates = useCallback(() => {
        axios
        .get('/api/gift-certificates', { params: createRequestParams() })
        .then(response => {
            const certificateOnPage = response.data._embedded.giftCertificates.map(c => {
                c.tags = c.tags.map(t => t.name)
                return c
            })
            setCertificates(certificateOnPage)

            if (certificateOnPage.length !== 0) {
                const totalPages = response.data._embedded.totalPages
                setNoOfPages(totalPages)
                if (currentPage > totalPages) {
                    setCurrentPage(totalPages)
                }
                document.getElementById('noItemsMessage').classList.add('d-none')
            }
        })
        .catch(error => props.setErrorMessage(error.response.data.errorMessage))
    }, [certificatesFetch, createRequestParams, currentPage, props])

    useEffect(() => {
        fetchCertificates()
        navigate({
            pathname: '/certificates',
            search:   createSearchParams(createNavigationParams()).toString()
        })
    }, [createNavigationParams, fetchCertificates, navigate])

    return (
        <CertificatesContext.Provider value={{certificates, fetchCertificates: dispatchCertificatesFetch,
            searchInput, setSearchInput, dateSort, setDateSort, nameSort, setNameSort,
            page: currentPage, setPage: setCurrentPage, total: pageSize, setTotal: setPageSize, noOfPages}}>
            {children}
        </CertificatesContext.Provider>
    )
}

export default CertificatesData