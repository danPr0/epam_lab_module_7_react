import React, { useContext } from 'react'
import CertificatesContext from '../context/certificatesContext'

function NoCertificatesHandler({ children }) {
    const { certificates } = useContext(CertificatesContext)

    return (
        certificates.length === 0
            ? <div className='text-center' id='noItemsMessage'>No certificates found</div>
            : children
    )
}

export default NoCertificatesHandler