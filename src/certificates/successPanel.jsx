import { CheckCircle, Close } from '@mui/icons-material'
import styles from '../css/certificates/successPanel.module.scss'

function SuccessPanel() {
    return (
        <div className={`d-none ${styles.success}`} id="success">
            <CheckCircle className={styles.success__icon} />
            <span className={styles.success__message} id="successMessage"></span>
            <Close className={`${styles.success__icon} ${styles.cursorPointer}`} id="successCloseIcon" />
        </div>
    )
}

export default SuccessPanel