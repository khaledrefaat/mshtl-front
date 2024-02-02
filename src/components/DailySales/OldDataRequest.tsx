import { useEffect, useState } from 'react';
import CustomFormGroup from '../form/CustomFormGroup';
import { Fertilizer, Item } from '../../data.types';
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

const OldDataRequest: React.FC<NewCustomerDataInterface> = ({ hideModal }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [item, setItem] = useState<Item | null>();

  const [fertilizers, setFertilizers] = useState<Fertilizer[]>([]);
  const [fertilizer, setFertilizer] = useState<Fertilizer | null>();
  const { isLoading, error, clearError, sendRequest } = useHttpClient();

  const [amount, setAmount] = useState('');
  const [statement, setStatement] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [switchButton, setSwitchButton] = useState('');

  const onAmountChange = (paid: string) => setAmount(paid);
  const onStatementChange = (statement: string) => setStatement(statement);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        clearError();
        const items = await sendRequest(`${import.meta.env.VITE_URI}/item`);
        const fertilizers = await sendRequest(
          `${import.meta.env.VITE_URI}/fertilizer`
        );
        setItems(items);
        setFertilizers(fertilizers);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCustomers();
  }, []);

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
      let newTransaction;
      if (switchButton === 'fertilizer') {
        newTransaction = await sendRequest(
          `${import.meta.env.VITE_URI}/fertilizer/${fertilizer?._id}`,
          'POST',
          JSON.stringify({
            amount,
            statement,
          }),
          {
            'Content-Type': 'application/json',
          }
        );
      } else if (switchButton === 'item') {
        newTransaction = await sendRequest(
          `${import.meta.env.VITE_URI}/item/${item?._id}`,
          'POST',
          JSON.stringify({
            amount,
            statement,
          }),
          {
            'Content-Type': 'application/json',
          }
        );
      }
      if (newTransaction) hideModal();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if ((item && amount) || (fertilizer && amount)) setButtonDisabled(false);
    else setButtonDisabled(true);
  }, [amount, fertilizer, item]);

  return (
    <>
      {isLoading && <Modal spinner />}

      <>
        <SwitchButtonContainer>
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
              label=": الكمية"
              type="number"
              onChange={onAmountChange}
              value={amount}
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
              label=": الكمية"
              type="number"
              onChange={onAmountChange}
              value={amount}
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
        {error && <Error>{error}</Error>}
      </>
    </>
  );
};

export default OldDataRequest;
