import { Form } from 'react-bootstrap';

interface CustomFormInterface {
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
}

const CustomForm: React.FC<CustomFormInterface> = ({ children, onSubmit }) => {
  return <Form onSubmit={(e) => onSubmit(e)}>{children}</Form>;
};

export default CustomForm;
