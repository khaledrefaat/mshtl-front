import Template from '../components/Template';
const Requirements = () => {
  return (
    <Template
      title="مستلزمات مشتل"
      url={`${import.meta.env.VITE_URI}/requirements`}
    />
  );
};

export default Requirements;
