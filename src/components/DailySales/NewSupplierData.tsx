import React, { useEffect, useState } from 'react';
import CustomFormGroup from '../form/CustomFormGroup';
import { Fertilizer, Supplier } from '../../data.types';
import useHttpClient from '../hooks/http-hook';
import Modal from '../shared/Modal';
import CustomButton from '../shared/CustomButton';
import Error from '../shared/Error';
import CustomSelect from '../form/CustomSelect';
import SwitchButtonContainer from '../form/SwitchButtonContainer';
import SwitchButton from '../form/SwitchButton';

interface NewSupplierDataInterface {
  hideModal: () => void;
}

const NewSupplierData: React.FC<NewSupplierDataInterface> = ({ hideModal }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierId, setSupplierId] = useState('');
  const [fertilizers, setFertilizers] = useState<Fertilizer[]>([]);
  const [fertilizerId, setFertilizerId] = useState('');
  const { isLoading, error, clearError, sendRequest } = useHttpClient();
  const [switchButton, setSwitchButton] = useState('');

  const [unit, setUnit] = useState('');
  const [paid, setPaid] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [statement, setStatement] = useState('');
  const [notes, setNotes] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const onUnitChange = (unit: string) => setUnit(unit);
  const onPaidChange = (paid: string) => setPaid(paid);
  const onUnitPriceChange = (unitPrice: string) => setUnitPrice(unitPrice);
  const onStatementChange = (statement: string) => setStatement(statement);
  const onNotesChange = (notes: string) => setNotes(notes);

  useEffect(() => {
    const fetchData = async () => {
      try {
        clearError();
        const suppliers = await sendRequest(
          `${import.meta.env.VITE_URI}/supplier`
        );
        const fertilizers = await sendRequest(
          `${import.meta.env.VITE_URI}/fertilizer`
        );
        setSuppliers(suppliers);
        setFertilizers(fertilizers);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const onSupplierSelect = (selectedSupplier: Supplier) =>
    setSupplierId(selectedSupplier._id);

  const onFertilizerSelect = (selectedFertilizer: Fertilizer) =>
    setFertilizerId(selectedFertilizer._id);

  const onFormSubmit = async () => {
    try {
      clearError();
      let res;
      if (switchButton === 'moneyTransaction') {
        res = await sendRequest(
          `${import.meta.env.VITE_URI}/supplier/${supplierId}`,
          'POST',
          JSON.stringify({
            paid,
            unitPrice,
            unit,
            statement,
            notes,
          }),
          {
            'Content-Type': 'application/json',
          }
        );
      } else if (switchButton === 'fertilizer') {
        res = await sendRequest(
          `${import.meta.env.VITE_URI}/supplier/fertilizer/${supplierId}`,
          'POST',
          JSON.stringify({
            paid,
            unitPrice,
            units: unit,
            statement,
            notes,
            fertilizerId,
          }),
          {
            'Content-Type': 'application/json',
          }
        );
      }

      if (res) hideModal();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (paid || (unit && unitPrice) || !statement) setButtonDisabled(false);
    else setButtonDisabled(true);
  }, [unit, paid, unitPrice]);

  return (
    <>
      {isLoading && <Modal spinner />}
      <CustomSelect
        title="اختر المورد"
        list={suppliers}
        onValueChange={onSupplierSelect}
      />
      {supplierId && (
        <>
          <SwitchButtonContainer>
            <SwitchButton
              onClick={() => setSwitchButton('moneyTransaction')}
              active={switchButton === 'moneyTransaction'}
            >
              بضاعة عادية
            </SwitchButton>
            <SwitchButton
              onClick={() => setSwitchButton('fertilizer')}
              active={switchButton === 'fertilizer'}
            >
              سماد او مبيد
            </SwitchButton>
          </SwitchButtonContainer>

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
                label=": سعر الوحده"
                type="number"
                onChange={onUnitPriceChange}
                value={unitPrice}
                sideLabel
              />
              <CustomFormGroup
                label=": عدد"
                type="number"
                onChange={onUnitChange}
                value={unit}
                sideLabel
              />
              <CustomFormGroup
                label=": البيان"
                type="text"
                onChange={onStatementChange}
                value={statement}
                sideLabel
                required
              />
              <CustomFormGroup
                label=": ملاحظات"
                type="text"
                onChange={onNotesChange}
                value={notes}
                sideLabel
              />
            </>
          )}
          {switchButton === 'fertilizer' && (
            <>
              <CustomSelect
                title="اختر السماد"
                list={fertilizers}
                onValueChange={onFertilizerSelect}
              />
              <CustomFormGroup
                label=": المدفوع"
                type="number"
                onChange={onPaidChange}
                value={paid}
                sideLabel
              />
              <CustomFormGroup
                label=": سعر الوحده"
                type="number"
                onChange={onUnitPriceChange}
                value={unitPrice}
                sideLabel
              />
              <CustomFormGroup
                label=": عدد"
                type="number"
                onChange={onUnitChange}
                value={unit}
                sideLabel
              />
              <CustomFormGroup
                label=": البيان"
                type="text"
                onChange={onStatementChange}
                value={statement}
                sideLabel
                required
              />
              <CustomFormGroup
                label=": ملاحظات"
                type="text"
                onChange={onNotesChange}
                value={notes}
                sideLabel
              />
            </>
          )}

          <CustomButton
            type="submit"
            onClick={onFormSubmit}
            disabled={buttonDisabled}
            className="w-100"
          >
            أرســـــــــــــــــل
          </CustomButton>
          {error && <Error>{error}</Error>}
        </>
      )}
    </>
  );
};

export default NewSupplierData;
