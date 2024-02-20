import { useEffect, useState } from 'react';
import CustomFormGroup from '../form/CustomFormGroup';
import CustomButton from '../shared/CustomButton';
import useHttpClient from '../hooks/http-hook';
import Modal from '../shared/Modal';
import Error from '../shared/Error';
import { Customer } from '../../data.types';
import CustomSelect from '../form/CustomSelect';

interface NewTraysInterface {
  hideModal: () => void;
}

const NewTrays: React.FC<NewTraysInterface> = ({ hideModal }) => {
  const { isLoading, error, clearError, sendRequest } = useHttpClient();

  const [income, setIncome] = useState('');
  const [insurance, setInsurance] = useState('');
  const [notes, setNotes] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [buttonDisabled, setButtonDisabled] = useState(false);

  const onIncomeChange = (income: string) => setIncome(income);
  const onInsuranceChange = (insurance: string) => setInsurance(insurance);
  const onNotesChange = (notes: string) => setNotes(notes);

  const onFormSubmit = async () => {
    try {
      clearError();
      const res = await sendRequest(
        `${import.meta.env.VITE_URI}/tray`,
        'POST',
        JSON.stringify({ customerId, income, insurance, notes }),
        {
          'Content-Type': 'application/json',
        }
      );
      if (res) hideModal();
    } catch (err) {
      console.log(err);
    }
  };

  const onCustomerSelect = (customer: Customer) => setCustomerId(customer._id);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        clearError();
        const customers = await sendRequest(
          `${import.meta.env.VITE_URI}/customer`
        );
        setCustomers(customers);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (income) setButtonDisabled(false);
    else setButtonDisabled(true);
  }, [income]);

  return (
    <>
      {isLoading && <Modal spinner />}
      <CustomSelect
        title="اختر العميل"
        list={customers}
        onValueChange={onCustomerSelect}
      />
      {customerId && (
        <>
          <CustomFormGroup
            label=": صواني واردة"
            type="number"
            onChange={onIncomeChange}
            value={income}
            sideLabel
          />
          <CustomFormGroup
            label=": تأمين منصرف"
            type="number"
            onChange={onInsuranceChange}
            value={insurance}
            sideLabel
          />
          <CustomFormGroup
            label=": ملاحظات"
            type="text"
            onChange={onNotesChange}
            value={notes}
            sideLabel
          />
          <CustomButton
            type="submit"
            onClick={onFormSubmit}
            disabled={buttonDisabled}
          >
            أرســـــــــــــــــل
          </CustomButton>
        </>
      )}

      {error && <Error>{error}</Error>}
    </>
  );
};

export default NewTrays;
