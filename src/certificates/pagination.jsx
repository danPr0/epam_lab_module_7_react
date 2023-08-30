import React, { useContext } from 'react';
import PaginationContext from '../context/paginationContext'
import styles from '../css/certificates.module.scss'

function Pagination() {

    const { page, total, noOfPages, setPage, setTotal } = useContext(PaginationContext)

    const pagesInLine = 10
    const totalOptions = [10, 20, 50]
    const pages = createPages()

    return (
        <div className={styles.certificates__pagination}>
            <ul className="pagination justify-content-center m-0">
                {createFirstPage()}
                {createPreviousSet()}
                {pages}
                {createNextSet()}
                {createLastPage()}
            </ul>
            <div className={styles.pagination__perPageSelect}>
                <select className="form-select form-select-sm" defaultValue={total}
                        onChange={(e) => {
                            setTotal(parseInt(e.target.value))
                            setPage(1)
                        }}>
                    {
                        totalOptions.map((v) =>
                            <option key={v} disabled={total === v}>{v}</option>
                        )
                    }
                </select>
            </div>
        </div>
    )

    function createPages() {

        const startIndex = Math.floor((page - 1) / pagesInLine) * pagesInLine

        return [...Array(noOfPages).keys()]
            .map((i) => i + 1)
            .slice(startIndex, startIndex + pagesInLine)
            .map((i) =>
                <li className="page-item" key={i.toString()}>
                    <button className={'page-link ' + (page === i ? 'disabled' : '')} onClick={() => setPage(i)}>
                        {i}
                    </button>
                </li>
            )
    }

    function createFirstPage() {
        return (
            <li className="page-item">
                {
                    page === 1
                        ? <button className="page-link disabled">«</button>
                        : <button className="page-link" onClick={() => setPage(1)}>«</button>
                }
            </li>
        )
    }

    function createPreviousSet() {
        const ifDisabled = page <= pagesInLine

        return (
            <li className={`page-item ${ifDisabled ? 'd-none' : ''}`}>
                <button className='page-link'
                        onClick={() => setPage((Math.floor(page / pagesInLine) - 1) * pagesInLine + 1)}>...
                </button>
            </li>
        )
    }

    function createNextSet() {
        const ifDisabled = Math.floor((page - 1) / pagesInLine) === Math.floor(noOfPages / pagesInLine)

        return (
            <li className={`page-item ${ifDisabled ? 'd-none' : ''}`}>
                <button className="page-link"
                        onClick={() => setPage((Math.floor((page - 1) / pagesInLine) + 1) * pagesInLine + 1)}>...
                </button>
            </li>
        )
    }

    function createLastPage() {
        return (
            <li className="page-item">
                {
                    page === noOfPages
                        ?   <button className="page-link disabled">»</button>
                        :   <button className="page-link" onClick={() => setPage(noOfPages)}>»</button>
                }
            </li>
        )
    }
}

export default Pagination
