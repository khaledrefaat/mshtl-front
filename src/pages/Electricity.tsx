import Template from '../components/Template';
const Electricity = () => {
  return (
    <Template title="كهرباء" url={`${import.meta.env.VITE_URI}/electricity`} />
  );
};

export default Electricity;
