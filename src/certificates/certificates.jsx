import React, { useState } from 'react'
import Header from '../pageElements/header'
import Footer from '../pageElements/footer'
import Pagination from './pagination'
import Table from './table'
import CertificatesData from './certificatesData'
import Search from './search'
import ErrorPanel from './errorPanel'
import SuccessPanel from './successPanel'
import AddItemModal from '../modals/addItemModal'
import NoCertificatesHandler from './noCertificatesHandler'
import AddItemModalContext from '../context/addItemModalContext'

import styles from '../css/certificates/certificates.module.scss'
import setErrorMessage from '../js/certificates/setErrorMessage'
import setSuccessMessage from '../js/certificates/setSuccessMessage'

function Certificates() {
    const [addModalDisplay, setAddModalDisplay] = useState(false)

    return (
        <>
            <Header onAddItemClick={() => setAddModalDisplay(true)} />

            <main className={styles.root}>
                <ErrorPanel />
                <SuccessPanel />

                <CertificatesData setErrorMessage={setErrorMessage}>
                    <Search />

                    <NoCertificatesHandler>
                        <Table setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} />
                        <Pagination />
                    </NoCertificatesHandler>
                </CertificatesData>
            </main>

            <AddItemModalContext.Provider
                value={{ presetValues: null, successCallback: handleAddModalSuccess,
                    onCancel: () => setAddModalDisplay(false)
                }}>
                <AddItemModal display={addModalDisplay} />
            </AddItemModalContext.Provider>

            <Footer />
        </>
    )

    function handleAddModalSuccess(message) {
        setAddModalDisplay(false)
        setSuccessMessage(message)
    }
}

export default Certificates