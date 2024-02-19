import { useEffect, useState } from 'react';
import CustomFormGroup from '../form/CustomFormGroup';
import { Customer, Fertilizer, Item } from '../../data.types';
import useHttpClient from '../hooks/http-hook';
import Modal from '../shared/Modal';
import CustomButton from '../shared/CustomButton';
import CustomSelect from '../form/CustomSelect';
import Error from '../shared/Error';
import SwitchButtonContainer from '../form/SwitchButtonContainer';
import SwitchButton from '../form/SwitchButton';

interface NewCustomerDataInterface {
  hideModal: () => void;
}

const NewCustomerData: React.FC<NewCustomerDataInterface> = ({ hideModal }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState<string | null>('');

  const [items, setItems] = useState<Item[]>([]);
  const [item, setItem] = useState<Item | null>();

  const [fertilizers, setFertilizers] = useState<Fertilizer[]>([]);
  const [fertilizer, setFertilizer] = useState<Fertilizer | null>();
  const { isLoading, error, clearError, sendRequest } = useHttpClient();

  const [paid, setPaid] = useState('');
  const [discount, setDiscount] = useState('');
  const [trays, setTrays] = useState('');
  const [statement, setStatement] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [switchButton, setSwitchButton] = useState('');

  const onPaidChange = (paid: string) => setPaid(paid);
  const onDiscountChange = (discount: string) => setDiscount(discount);
  const onTraysChange = (trays: string) => setTrays(trays);
  const onStatementChange = (statement: string) => setStatement(statement);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        clearError();
        const customers = await sendRequest(
          `${import.meta.env.VITE_URI}/customer`
        );
        const items = await sendRequest(`${import.meta.env.VITE_URI}/item`);
        const fertilizers = await sendRequest(
          `${import.meta.env.VITE_URI}/fertilizer`
        );
        setCustomers(customers);
        setItems(items);
        setFertilizers(fertilizers);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCustomers();
  }, []);

  const onCustomerSelect = (customer: Customer | null) => {
    if (customer === null) setCustomerId(null);
    else setCustomerId(customer._id);
  };

  const onItemsSelect = (selectedItem: Item | null) => {
    if (selectedItem === null) {
      setItem(null);
    } else {
      const item = items.find(item => item._id === selectedItem._id);
      setItem(item);
    }
  };

  const onFertilizerSelect = (selectedFertilizer: Fertilizer | null) => {
    if (selectedFertilizer === null) {
      setFertilizer(null);
    } else {
      const fertilizer = fertilizers.find(
        fertilizer => fertilizer._id === selectedFertilizer._id
      );
      setFertilizer(fertilizer);
    }
  };

  const onFormSubmit = async () => {
    try {
      clearError();
      let newCustomerTransaction;
      if (switchButton === 'fertilizer') {
        newCustomerTransaction = await sendRequest(
          `${import.meta.env.VITE_URI}/customer/fertilizer/${customerId}`,
          'POST',
          JSON.stringify({
            units: trays,
            paid,
            statement,
            fertilizerId: fertilizer?._id,
          }),
          {
            'Content-Type': 'application/json',
          }
        );
      } else if (switchButton === 'item') {
        newCustomerTransaction = await sendRequest(
          `${import.meta.env.VITE_URI}/customer/item/${customerId}`,
          'POST',
          JSON.stringify({
            trays,
            paid,
            statement,
            itemId: item?._id,
          }),
          {
            'Content-Type': 'application/json',
          }
        );
      } else if (switchButton === 'moneyTransaction') {
        newCustomerTransaction = await sendRequest(
          `${import.meta.env.VITE_URI}/customer/${customerId}`,
          'POST',
          JSON.stringify({
            paid,
            statement,
            discount,
          }),
          {
            'Content-Type': 'application/json',
          }
        );
      }
      if (newCustomerTransaction) hideModal();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if ((trays && item) || (!paid && discount) || (paid && !discount))
      setButtonDisabled(false);
    else setButtonDisabled(true);
  }, [trays, paid, discount, item]);

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
          <SwitchButtonContainer>
            <SwitchButton
              onClick={() => setSwitchButton('moneyTransaction')}
              active={switchButton === 'moneyTransaction'}
            >
              معاملة مالية فقط
            </SwitchButton>
            <SwitchButton
              onClick={() => setSwitchButton('fertilizer')}
              active={switchButton === 'fertilizer'}
            >
              سماد
            </SwitchButton>
            <SwitchButton
              onClick={() => setSwitchButton('item')}
              active={switchButton === 'item'}
            >
              صنف
            </SwitchButton>
          </SwitchButtonContainer>
          {switchButton === 'item' && (
            <>
              <CustomSelect
                title="اختر الصنف"
                list={items}
                onValueChange={onItemsSelect}
              />
              <CustomFormGroup
                label=": عدد الصواني"
                type="number"
                onChange={onTraysChange}
                value={trays}
                sideLabel
              />
              <CustomFormGroup
                label=": المدفوع"
                type="number"
                onChange={onPaidChange}
                value={paid}
                sideLabel
              />
              <CustomFormGroup
                label=": البيان"
                type="text"
                onChange={onStatementChange}
                value={statement}
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
          {switchButton === 'fertilizer' && (
            <>
              <CustomSelect
                title="اختر سماد او مبيد"
                list={fertilizers}
                onValueChange={onFertilizerSelect}
              />
              <CustomFormGroup
                label=": عدد الوحدات"
                type="number"
                onChange={onTraysChange}
                value={trays}
                sideLabel
              />
              <CustomFormGroup
                label=": المدفوع"
                type="number"
                onChange={onPaidChange}
                value={paid}
                sideLabel
              />
              <CustomFormGroup
                label=": البيان"
                type="text"
                onChange={onStatementChange}
                value={statement}
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
          {switchButton === 'moneyTransaction' && (
            <>
              <CustomFormGroup
                label=": المدفوع"
                type="number"
                onChange={onPaidChange}
                value={paid}
                sideLabel
              />
              <CustomFormGroup
                label=": خصم"
                type="number"
                onChange={onDiscountChange}
                value={discount}
                sideLabel
              />
              <CustomFormGroup
                label=": البيان"
                type="text"
                onChange={onStatementChange}
                value={statement}
                sideLabel
              />
              <CustomButton
                type="submit"
                onClick={onFormSubmit}
                disabled={buttonDisabled}
                className="w-100"
              >
                أرســـــــــــــــــل
              </CustomButton>
            </>
          )}
          {error && <Error>{error}</Error>}
        </>
      )}
    </>
  );
};

export default NewCustomerData;
