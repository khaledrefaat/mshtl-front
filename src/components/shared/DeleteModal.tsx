import { ReactComponent as CloseIcon } from '../Icons/close.svg';
import classes from './DeleteModal.module.css';
import Modal from './Modal';

interface DeleteModalInterface {
  onDelete: () => void;
  hideModal: () => void;
}

const DeleteModal: React.FC<DeleteModalInterface> = ({
  onDelete,
  hideModal,
}) => {
  return (
    <Modal onClick={hideModal}>
      <div
        className={classes['delete-modal']}
        onClick={(e) => e.stopPropagation()}
      >
        <p>هل تود حذف هذا العنصر؟</p>
        <div className={classes['button-container']}>
          <button className={classes['close-button']} onClick={hideModal}>
            لا
          </button>
          <button className={classes['delete-button']} onClick={onDelete}>
            نعم
          </button>
        </div>
        <CloseIcon className={classes['close-icon']} />
      </div>
    </Modal>
  );
};

export default DeleteModal;
