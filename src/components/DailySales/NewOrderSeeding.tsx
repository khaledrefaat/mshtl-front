import { useEffect, useState } from 'react';
import CustomFormGroup from '../form/CustomFormGroup';
import { Customer, Item } from '../../data.types';
import useHttpClient from '../hooks/http-hook';
import Modal from '../shared/Modal';
import CustomButton from '../shared/CustomButton';
import Error from '../shared/Error';
import CustomSelect from '../form/CustomSelect';

interface NewOrderSeedingInterface {
  hideModal: () => void;
}
const NewOrderSeedingInterface: React.FC<NewOrderSeedingInterface> = ({
  hideModal,
}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [itemId, setItemId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const { isLoading, error, clearError, sendRequest } = useHttpClient();

  const [traysCount, setTraysCount] = useState('');
  const [seedDate, setSeedDate] = useState('');
  const [landDate, setLandDate] = useState('');
  const [notes, setNotes] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const onNotesChange = (notes: string) => setNotes(notes);
  const onTraysCountChange = (traysCount: string) => setTraysCount(traysCount);
  const onSeedDateChange = (seedDate: string) => setSeedDate(seedDate);
  const onLandDateChange = (landDate: string) => setLandDate(landDate);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        clearError();
        const items = await sendRequest(`${import.meta.env.VITE_URI}/item`);
        const customers = await sendRequest(
          `${import.meta.env.VITE_URI}/customer`
        );
        setItems(items);
        setCustomers(customers);
      } catch (err) {
        console.log(err);
      }
    };
    fetchItems();
  }, []);

  const onItemSelect = (item: Item) => setItemId(item._id);
  const onCustomerSelect = (customer: Customer) =>
    setCustomerName(customer.name);

  const onFormSubmit = async () => {
    try {
      clearError();
      const res = await sendRequest(
        `${import.meta.env.VITE_URI}/item/order/${itemId}`,
        'POST',
        JSON.stringify({
          name: customerName,
          trays: traysCount,
          seedDate,
          landDate,
          notes,
        }),
        {
          'Content-Type': 'application/json',
        }
      );
      if (res) hideModal();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (traysCount) setButtonDisabled(false);
    else setButtonDisabled(true);
  }, [traysCount]);

  return (
    <>
      {isLoading && <Modal spinner />}
      <CustomSelect
        title="اختر الصنف"
        list={items}
        onValueChange={onItemSelect}
      />
      <CustomSelect
        title="اختر العميل"
        list={customers}
        onValueChange={onCustomerSelect}
      />
      {itemId && customerName && (
        <>
          <CustomFormGroup
            label=": عدد صواني"
            type="number"
            onChange={onTraysCountChange}
            value={traysCount}
            sideLabel
            required
          />
          <CustomFormGroup
            label=": تاريخ مشتل"
            type="date"
            onChange={onSeedDateChange}
            value={seedDate}
            sideLabel
          />
          <CustomFormGroup
            label=": تاريخ ارض"
            type="date"
            onChange={onLandDateChange}
            value={landDate}
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
          {error && <Error>{error}</Error>}
        </>
      )}
    </>
  );
};

export default NewOrderSeedingInterface;
