import { createPortal } from 'react-dom';
import { ReactComponent as SVG } from '../Icons/spinner.svg';
import classes from './Modal.module.css';

interface ModalTypes {
  spinner?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
}

const Modal: React.FC<ModalTypes> = ({ spinner, children, onClick }) => {
  const modal = (
    <div
      className={`${classes.modal} ${spinner && classes.spinner}`}
      onClick={onClick}
    >
      {spinner && <SVG />}
      {children && children}
    </div>
  );

  return createPortal(
    modal,
    document.getElementById('modal') as HTMLDivElement
  );
};

export default Modal;
