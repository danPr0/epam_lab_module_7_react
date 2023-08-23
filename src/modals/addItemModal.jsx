import styles from '../css/addItemModal.module.css'
import modalStyles from '../css/elements/modal.module.css'
import {Form} from 'formik'
import AddItemForm from '../forms/addItemForm'

function AddItemModal(props) {

    if (props.show) {
        return (
            <div className={modalStyles.modalContainer}>
                <div className={modalStyles.modal}>
                    <h1 className={modalStyles.modalHeader}>Add new certificate</h1>
                    <AddItemForm/>
                    {/*<Form>*/}
                    {/*    <div className={styles.inputGroupContainer} >*/}
                    {/*        <label className={styles.inputGroup}>*/}
                    {/*            <span>Title</span>*/}
                    {/*            <input className={styles.inputGroup__input} type='text' name='title'/>*/}
                    {/*        </label>*/}
                    {/*    </div>*/}
                    {/*</Form>*/}
                </div>
            </div>
        )
    } else {
        return null
    }
}

export default AddItemModal