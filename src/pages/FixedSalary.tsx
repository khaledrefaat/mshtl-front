import Template from '../components/Template';
const FixedSalary = () => {
  return (
    <Template
      title="اجور ثابتة"
      url={`${import.meta.env.VITE_URI}/fixed-salary`}
    />
  );
};

export default FixedSalary;
