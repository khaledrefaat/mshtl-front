import Template from '../components/Template';
const Hospitality = () => {
  return (
    <Template title="ضيافة" url={`${import.meta.env.VITE_URI}/hospitality`} />
  );
};

export default Hospitality;
