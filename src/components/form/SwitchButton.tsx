interface SwitchButtonType {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}

const SwitchButton: React.FC<SwitchButtonType> = ({
  children,
  active,
  onClick,
}) => {
  return (
    <button
      className={`customer-button ${active ? 'customer-button__active' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default SwitchButton;
