import { useEffect, useState } from 'react';
import CustomFormGroup from '../form/CustomFormGroup';
import { Customer, Fertilizer, Item } from '../../data.types';
import Modal from '../shared/Modal';
import CustomButton from '../shared/CustomButton';
import CustomSelect from '../form/CustomSelect';
import Error from '../shared/Error';
import SwitchButtonContainer from '../form/SwitchButtonContainer';
import SwitchButton from '../form/SwitchButton';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface NewCustomerDataInterface {
  hideModal: () => void;
}

const NewCustomerData: React.FC<NewCustomerDataInterface> = ({ hideModal }) => {
  const {
    status: customerStatus,
    data: customerData,
  }: { status: string; data: Customer[] | undefined; error: any } = useQuery({
    queryKey: ['customers'],
    queryFn: () => fetchData(`${import.meta.env.VITE_URI}/customer`),
  });

  const {
    status: itemStatus,
    data: itemData,
  }: { status: string; data: Item[] | undefined; error: any } = useQuery({
    queryKey: ['items'],
    queryFn: () => fetchData(`${import.meta.env.VITE_URI}/item`),
  });

  const {
    status: fertilizerStatus,
    data: fertilizerData,
  }: { status: string; data: Fertilizer[] | undefined; error: any } = useQuery({
    queryKey: ['fertilizers'],
    queryFn: () => fetchData(`${import.meta.env.VITE_URI}/fertilizer`),
  });

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState<string | null>('');

  const [items, setItems] = useState<Item[]>([]);
  const [item, setItem] = useState<Item | null>();

  const [fertilizers, setFertilizers] = useState<Fertilizer[]>([]);
  const [fertilizer, setFertilizer] = useState<Fertilizer | null>();

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

  async function fetchData(url: string) {
    try {
      const res = await fetch(url);
      return res.json();
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (customerStatus == 'success') setCustomers(customerData);
    if (itemStatus == 'success') setItems(itemData);
    if (fertilizerStatus == 'success') setFertilizers(fertilizerData);
  }, [customerData, itemData, fertilizerData]);

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

  const queryClient = useQueryClient();

  const mutation = useMutation({
    async mutationFn(data: any) {
      const res = await fetch(data.url, {
        method: 'POST',
        body: JSON.stringify(data.body),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await res.json();
      if (!res.ok) throw result;
      return result;
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['customers', 'fertilizers', 'items'],
      });
      hideModal();
    },
  });
  const onFormSubmit = async () => {
    try {
      if (switchButton === 'fertilizer') {
        await mutation.mutateAsync({
          url: `${import.meta.env.VITE_URI}/customer/fertilizer/${customerId}`,
          body: {
            units: trays,
            paid,
            statement,
            fertilizerId: fertilizer?._id,
          },
        });
      } else if (switchButton === 'item') {
        await mutation.mutateAsync({
          url: `${import.meta.env.VITE_URI}/customer/item/${customerId}`,
          body: {
            trays,
            paid,
            statement,
            itemId: item?._id,
          },
        });
      } else if (switchButton === 'moneyTransaction') {
        await mutation.mutateAsync({
          url: `${import.meta.env.VITE_URI}/customer/${customerId}`,
          body: {
            paid,
            statement,
            discount,
          },
        });
      }
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
      {customerStatus == 'pending' && <Modal spinner />}
      {itemStatus == 'pending' && <Modal spinner />}
      {fertilizerStatus == 'pending' && <Modal spinner />}
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
          {mutation.isError && <Error>{mutation.error.message}</Error>}
        </>
      )}
    </>
  );
};

export default NewCustomerData;
