import styles from '../css/deleteItemModal.module.css'

function DeleteItemModal(props) {

    if (props.show) {
        return (
            <div className={styles.modalContainer}>
                <div className={styles.modal}>
                    <h1 className={styles.modalHeader}>Delete confirmation</h1>
                    <p className={styles.modalText}>Do you really want to delete certificate with id = {props.certificateId}?</p>
                    <div className={styles.modalActions}>
                        <button className={`btn btn-danger ${styles.confirmButton}`} onClick={props.onConfirm}>Yes</button>
                        <button className={`btn btn-secondary ${styles.cancelButton}`} onClick={props.onCancel}>Cancel</button>
                    </div>
                </div>
            </div>
        )
    } else {
        return null
    }
}

export default DeleteItemModal