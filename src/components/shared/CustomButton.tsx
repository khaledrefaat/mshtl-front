const CustomButton: React.FC<{
  children: React.ReactNode;
  type?: 'submit' | 'reset' | 'button';
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}> = ({ children, type, onClick, disabled, className }) => {
  return (
    <button
      type={type || 'button'}
      className={`custom-button mb-2 ${disabled ? 'button-disabled' : ''} ${
        className ? className : ''
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default CustomButton;
