import styles from '../css/deleteItemModal.module.scss'

function DeleteItemModal(props) {

    if (props.display) {
        return (
            <div className={styles.modalContainer}>
                <div className={styles.modal}>
                    <h1 className={styles.modal__header}>Delete confirmation</h1>
                    <p className={styles.modal__text}>
                        Do you really want to delete certificate with id = {props.certificate.id}?
                    </p>
                    <div className={styles.modal__actions}>
                        <button className={`btn btn-danger ${styles.actions__confirm}`} onClick={props.onConfirm}>
                            Yes
                        </button>
                        <button className={`btn btn-secondary ${styles.actions__cancel}`} onClick={props.onCancel}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        )
    } else {
        return null
    }
}

export default DeleteItemModal
