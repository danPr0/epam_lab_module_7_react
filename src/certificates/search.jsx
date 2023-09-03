import { useContext, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import CertificatesContext from '../context/certificatesContext'
import styles from '../css/certificates/search.module.scss'


function Search() {
    const { searchInput, setSearchInput } = useContext(CertificatesContext)
    
    useEffect(() => {
        document.getElementById('searchInput').value = searchInput
    }, [searchInput])
    
    return (
        <div className='input-group mb-4'>
            <input className='form-control' id='searchInput' type='text'
                   placeholder='Search...' />
            <div className='input-group-append'>
                <Button className={styles.submitButton}
                        onClick={() => setSearchInput(document.getElementById('searchInput').value)}>Go!
                </Button>
            </div>
        </div>
    )
}

export default Search