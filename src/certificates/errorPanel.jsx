import { Close, Error } from '@mui/icons-material'
import styles from '../css/certificates/errorPanel.module.scss'


function ErrorPanel() {
    return (
        <div className={`d-none text-danger ${styles.error}`} id="error">
            <Error className={styles.error__icon} />
            <span className={styles.error__message} id="errorMessage"></span>
            <Close className={`${styles.error__icon} ${styles.cursorPointer}`} id="errorCloseIcon" />
        </div>
    )
}

export default ErrorPanel