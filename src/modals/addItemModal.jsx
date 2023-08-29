import AddItemForm from '../forms/addItemForm'
import styles from '../css/addItemModal.module.scss'
import { useContext } from 'react'
import AddItemModalContext from '../context/addItemModalContext'

function AddItemModal(props) {
    const { presetValues } = useContext(AddItemModalContext)

    if (props.display) {
        return (
            <div className={styles.modalContainer}>
                <div className={styles.modal}>
                    <h1 className={styles.modal__header}>
                        {presetValues === null ? 'Add new certificate' : 'Edit certificate'}
                    </h1>
                    <AddItemForm />
                </div>
            </div>
        )
    } else {
        return null
    }
}

export default AddItemModal
