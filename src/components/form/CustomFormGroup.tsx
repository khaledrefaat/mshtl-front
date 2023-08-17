import { FormControl, FormGroup, FormLabel } from 'react-bootstrap';

interface CustomFormGroupInterface {
  label?: string;
  type: string;
  placeholder?: string;
  onChange: (value: string) => void;
  value: string | number;
  sideLabel?: boolean;
  required?: boolean;
  step?: string;
}

const CustomFormGroup: React.FC<CustomFormGroupInterface> = ({
  type,
  label,
  placeholder,
  onChange,
  value,
  sideLabel,
  required,
}) => {
  return (
    <FormGroup
      className={`mb-3 w-100 ${sideLabel ? 'd-flex flex-row-reverse' : ''}`}
      controlId="decimalInput"
    >
      {label && <FormLabel className="mb-3">{label}</FormLabel>}
      {placeholder ? (
        <FormControl
          type={type}
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          value={value}
          className="mb-2"
          required={required}
          step="0.01"
          autoComplete="off"
        />
      ) : (
        <FormControl
          type={type}
          onChange={e => onChange(e.target.value)}
          value={value}
          className="mb-2"
          required={required}
          step="0.01"
          autoComplete="off"
        />
      )}
    </FormGroup>
  );
};

export default CustomFormGroup;
