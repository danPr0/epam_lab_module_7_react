import Header from '../pageElements/header'
import Footer from '../pageElements/footer'
import styles from '../css/certificates.module.css'
import {Button} from 'react-bootstrap'
import axios from 'axios'
import {useCallback, useEffect, useReducer, useRef, useState} from 'react'
import MaterialIcon from 'react-google-material-icons'
import {Map} from 'react-lodash'
import {useNavigate, useSearchParams} from 'react-router-dom'
import DeleteItemModal from '../modals/deleteItemModal'
import AddItemModal from '../modals/addItemModal'

function Certificates() {

    const navigate = useNavigate();
    const [forcedFetch, forceFetch] = useReducer(x => x + 1, 0, v => v);
    const [urlParams] = useSearchParams()

    const [addModalShow, setAddModalShow] = useState(true)
    const [idToAdd, setIdToAdd] = useState(null)
    const [deleteModalShow, setDeleteModalShow] = useState(false)
    const [idToDelete, setIdToDelete] = useState(null)

    const [certificates, setCertificates] = useState([])
    const [certificatesElements, setCertificatesElements] = useState([])
    const [curPage, setCurPage] = useState(urlParams.get('page') === null ? 1 : parseInt(urlParams.get('page')))
    const [noOfPages, setNoOfPages] = useState(25)
    const [perPage, setPerPage] = useState(urlParams.get('total') === null ? 10 : parseInt(urlParams.get('total')))
    const [searchInput, setSearchInput] = useState(urlParams.get('search') === null ? '' : urlParams.get('search'))
    const [dateSort, setDateSort] = useState(urlParams.get('dateSort') === null ? 'asc' : urlParams.get('dateSort'))
    const [nameSort, setNameSort] = useState(urlParams.get('nameSort'))

    const pagesInLine = 10
    const pages = useRef([])

    useEffect(() => {
        document.getElementById('searchInput').value = urlParams.get('search') === null ? '' : urlParams.get('search')
    }, [urlParams])

    useEffect(() => {
        const start = Math.floor((curPage - 1) / pagesInLine) * pagesInLine
        pages.current = [...Array(noOfPages).keys()].map(i => i + 1).slice(start, start + pagesInLine).map((i, index) =>
            <li className="page-item" key={index}>
                <button className={"page-link " + (curPage === i ? "disabled" : "")}
                        onClick={() => setCurPage(i)}>{i}</button>
            </li>)
    }, [noOfPages, curPage])

    useEffect(() => {
        (async function() {
            fetchCertificates().then(r => setCertificates(r))
        })()
        async function fetchCertificates() {
            let result = []

            let tagNames = searchInput.match(/#\([^)]*\)/g)
            let url = `/gift-certificates?descriptionPart=${searchInput.replaceAll(/#\([^)]*\)/g, '').trim()}` +
                `&page=${curPage}&total=${perPage}`
            let navigateUrl = `/certificates?search=${encodeURIComponent(searchInput)}&page=${curPage}&total=${perPage}`
            if (tagNames != null) {
                tagNames = tagNames.map(t => t.substring(2, t.length - 1))
                url += tagNames.reduce((accumulator, curValue) => accumulator + '&tagName=' + curValue, '')
            }
            if (dateSort != null) {
                url += `&sort=createDate_${dateSort}`
                navigateUrl += `&dateSort=${dateSort}`
            }
            if (nameSort != null) {
                url += `&sort=name_${nameSort}`
                navigateUrl += `&nameSort=${nameSort}`
            }

            navigate(navigateUrl)

            await axios
            .get(url)
            .then((response) => {
                if (response.data._embedded === undefined) {
                    document.getElementById('errorMessage').textContent = 'No certificates found'
                } else {
                    result = response.data._embedded.giftCertificates
                }
            })
            .catch(error => {
                document.getElementById('errorMessage').textContent = error.response.data.errorMessage
                document.getElementById('error').style.display = 'flex'
            })

            return result
        }
    }, [searchInput, curPage, perPage, dateSort, nameSort, forcedFetch, navigate])

    useEffect(() => {
        setCertificatesElements(certificates.map((c, index) =>
            <tr key={index}>
                <td className={styles.w20}>{c.createdDate}</td>
                <td className={styles.w20}>{c.name}</td>
                <td className={styles.w20}>{c.tags.map(t => t.name + ' ')}</td>
                <td className={styles.w20}>{c.description}</td>
                <td className={styles.w5}>{c.price}</td>
                <td className={styles.w15}>
                    <Button className="btn-sm btn-primary">View</Button>
                    <Button className="btn-sm btn-warning">Edit</Button>
                    <Button className="btn-sm btn-danger" onClick={() => {
                        setDeleteModalShow(true)
                        setIdToDelete(c.id)
                    }
                    }>Delete</Button>
                </td>
            </tr>
        ))
    }, [certificates])

    return (
        <>
            <Header/>
            <main className={styles.certificatesRoot}>
                <div className={`mb-2 text-danger ${styles.error}`} id="error">
                    <span style={{height: '32px'}}><MaterialIcon icon="error" size={32}/></span>
                    <span className={styles.error__message} id="errorMessage">Error message</span>
                    <span style={{height: '32px', cursor: 'pointer'}} onClick={(e) => e.currentTarget.parentNode.style.display = 'none'}><MaterialIcon icon="close" size={32}/></span>
                </div>
                <div className="input-group mb-4 search">
                    <input className="form-control search__input" id="searchInput" type="text" placeholder="Search..."/>
                    <div className="input-group-append">
                        <Button className={styles.search__submitButton}
                                onClick={() => setSearchInput(document.getElementById('searchInput').value)}>Go!</Button>
                    </div>
                </div>
                <div className={styles.certificates}>
                    <table className={`mb-4 ${styles.certificates__table}`}>
                        <thead>
                        <tr>
                            <th className={styles.w20 + ' ' + styles.cursorPointer}
                                onClick={() => {
                                    const nextSort = getNextSort(dateSort)
                                    setDateSort(nextSort)
                                    document.getElementById('dateSortIcon').textContent = getSortIconName(nextSort)
                                }}>

                                <div className={styles.tableSortHeader}>
                                    <span className="material-icons" id="dateSortIcon">{getSortIconName(dateSort)}</span>
                                    <span>Datetime</span>
                                </div>
                            </th>
                            <th className={styles.w20 + ' ' + styles.cursorPointer}
                                onClick={() => {
                                    const nextSort = getNextSort(nameSort)
                                    setNameSort(nextSort)
                                    document.getElementById('titleSortIcon').textContent = getSortIconName(nextSort)
                                }}>

                                <div className={styles.tableSortHeader}>
                                    <span className="material-icons" id="titleSortIcon">{getSortIconName(nameSort)}</span>
                                    <span>Title</span>
                                </div>
                            </th>
                            <th className={`ps-3 ${styles.w20}`}>Tags</th>
                            <th className={`ps-3 ${styles.w20}`}>Description</th>
                            <th className={`ps-1 ${styles.w5}`}>Price</th>
                            <th className={`ps-3 ${styles.w15}`}>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {certificatesElements}
                        </tbody>
                    </table>
                    <div className={styles.certificates__pagination}>
                        <ul className="pagination justify-content-center m-0">
                            <li className="page-item">
                                {
                                    curPage === 1
                                        ? <button className="page-link disabled">«</button>
                                        : <button className="page-link" onClick={() => setCurPage(1)}>«</button>
                                }
                            </li>

                            <li className="page-item" style={
                                curPage <= pagesInLine
                                    ? {display: 'none'}
                                    : {}
                            }>
                                <button className="page-link"
                                        onClick={() => setCurPage((Math.floor(curPage / pagesInLine) - 1) * pagesInLine + 1)}>...
                                </button>
                            </li>

                            {pages.current}

                            <li className="page-item" style={
                                Math.floor((curPage - 1) / pagesInLine) === Math.floor(noOfPages / pagesInLine)
                                    ? {display: 'none'}
                                    : {}
                            }>
                                <button className="page-link"
                                        onClick={() => setCurPage((Math.floor((curPage - 1) / pagesInLine) + 1) * pagesInLine + 1)}>...
                                </button>
                            </li>

                            <li className="page-item">
                                {
                                    curPage === noOfPages
                                        ? <button className="page-link disabled">»</button>
                                        : <button className="page-link" onClick={() => setCurPage(noOfPages)}>»</button>
                                }
                            </li>
                        </ul>
                        <div className={styles.perPageSelect}>
                            <select className="form-select form-select-sm" defaultValue={perPage}
                                    onChange={(e) => setPerPage(parseInt(e.target.value))}>
                                {
                                    [10, 20, 50].map(v => <option key={v} disabled={perPage === v}>{v}</option>)
                                }
                            </select>
                        </div>
                    </div>
                </div>
            </main>
            <AddItemModal show={addModalShow}/>
            <DeleteItemModal show={deleteModalShow} certificateId={idToDelete} onConfirm={() => onDeleteModalConfirm(idToDelete)}
                             onCancel={() => onDeleteModalCancel()}/>
            <Footer/>
        </>
    )



    function onDeleteModalConfirm(certificateId) {
        setDeleteModalShow(false)

        axios
        .delete(`/gift-certificates/${certificateId}`)
        .then(() => {
            forceFetch()
            // setCertificates([])
        })
        .catch(error => {
            forceFetch()
            // setCertificates([])
            document.getElementById('errorMessage').textContent = error.response.data.errorMessage
            document.getElementById('error').style.display = 'flex'
        })
    }

    function onDeleteModalCancel() {
        console.log('cancel here')
        setDeleteModalShow(false)
    }

    // function handleSort(currentSort, sortIconElement) {
    //     let resultSort = currentSort === 'asc'
    //         ? 'expand_more'
    //         : currentSort === 'desc'
    //             ? 'expand_less'
    //             : 'unfold_more'
    //     // if (currentSort === 'asc') {
    //     //     resultSort = 'desc'
    //     // } else if (currentSort === 'desc') {
    //     //     resultSort = null
    //     // } else {
    //     //     resultSort = 'asc'
    //     // }
    //     sortIconElement.textContent = getSortIconName(resultSort)
    //
    //     return resultSort
    // }

    function getNextSort(currentSort) {
        return currentSort === 'asc'
            ? 'desc'
            : currentSort === 'desc'
                ? null
                : 'asc'
    }

    function getSortIconName(sort) {
        return sort === 'asc'
            ? 'expand_less'
            : sort === 'desc'
                ? 'expand_more'
                : 'unfold_more'
    }
}

async function getNoOfPages() {
    let result

    await axios
    .get('/gift-certificates/count')
    .then(response => result = response.data._embedded.count)


    return result
}

export default Certificates