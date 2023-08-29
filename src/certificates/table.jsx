import React, { useContext } from 'react'
import SortContext from '../context/sortContext'
import { Button } from 'react-bootstrap'
import { ExpandLess, ExpandMore, UnfoldMore } from '@mui/icons-material'
import styles from '../css/certificates.module.scss'
import { isAuthenticated } from '../js/authentication'

function Table(props) {
    const { dateSort, nameSort, setNextDateSort, setNextNameSort } = useContext(SortContext)

    return (
        <table className={`mb-4 ${styles.certificates__table}`}>
            <thead>
                <tr>
                    <th className={`${styles.cursorPointer}`} onClick={setNextDateSort}>
                        <div className="d-flex align-items-center">
                            {getSortIcon(dateSort)}
                            <span>Datetime</span>
                        </div>
                    </th>
                    <th className={`${styles.cursorPointer}`} onClick={setNextNameSort}>
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
    )

    function getCertificateElements() {

        return props.certificates.map(c =>
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
                                <Button className='btn-sm btn-warning' onClick={() => props.onItemEdit(c)}>
                                    Edit
                                </Button>
                                <Button className='btn-sm btn-danger' onClick={() => props.onItemDelete(c)}>
                                    Delete
                                </Button>
                            </>
                            : null
                    }
                </td>
            </tr>
        )
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
