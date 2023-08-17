import { Container as BootstrapContainer } from 'react-bootstrap';

const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BootstrapContainer className="mx-auto pt-4">{children}</BootstrapContainer>
  );
};

export default Container;
