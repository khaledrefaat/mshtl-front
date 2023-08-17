import { useEffect, useState } from 'react';
import CustomFormGroup from '../form/CustomFormGroup';
import { Item } from '../../data.types';
import useHttpClient from '../hooks/http-hook';
import { FormSelect } from 'react-bootstrap';
import Modal from '../shared/Modal';
import CustomButton from '../shared/CustomButton';
import Error from '../shared/Error';

interface NewPlantingNoteInterface {
  hideModal: () => void;
}

const NewPlantingNote: React.FC<NewPlantingNoteInterface> = ({ hideModal }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [itemId, setItemId] = useState('');
  const { isLoading, error, clearError, sendRequest } = useHttpClient();

  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [traysCount, setTraysCount] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [plantDate, setPlantDate] = useState('');

  const onQuantityChange = (quantity: string) => setQuantity(quantity);
  const onUnitChange = (unit: string) => setUnit(unit);
  const onLotNumberChange = (LotNumber: string) => setLotNumber(LotNumber);
  const onTraysCountChange = (traysCount: string) => setTraysCount(traysCount);
  const onPlantDateChange = (plantDate: string) => setPlantDate(plantDate);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        clearError();
        const res = await sendRequest(`${import.meta.env.VITE_URI}/item`);
        setItems(res);
      } catch (err) {
        console.log(err);
      }
    };
    fetchItems();
  }, []);

  const onItemSelect = (_id: string) => setItemId(_id);

  const onFormSubmit = async () => {
    try {
      clearError();
      const res = await sendRequest(
        `${import.meta.env.VITE_URI}/seed`,
        'POST',
        JSON.stringify({
          itemId,
          quantity,
          unit,
          lotNumber,
          trays: traysCount,
          plantDate,
        }),
        {
          'Content-Type': 'application/json',
        }
      );
      console.log(res);
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
      <FormSelect className="mb-4" onChange={e => onItemSelect(e.target.value)}>
        <option value="" onSelect={() => onItemSelect('')}>
          اختر الصنف
        </option>
        {items &&
          items.map(({ _id, name }) => (
            <option key={_id} value={_id}>
              {name}
            </option>
          ))}
      </FormSelect>
      {itemId && (
        <>
          <CustomFormGroup
            label=": الكمية"
            type="text"
            onChange={onQuantityChange}
            value={quantity}
            sideLabel
          />
          <CustomFormGroup
            label=": الوحدة"
            type="text"
            onChange={onUnitChange}
            value={unit}
            sideLabel
          />
          <CustomFormGroup
            label=": رقم اللوط"
            type="text"
            onChange={onLotNumberChange}
            value={lotNumber}
            sideLabel
          />
          <CustomFormGroup
            label=": عدد صواني"
            type="text"
            onChange={onTraysCountChange}
            value={traysCount}
            sideLabel
            required
          />
          <CustomFormGroup
            label=": التاريخ"
            type="date"
            onChange={onPlantDateChange}
            value={plantDate}
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

export default NewPlantingNote;
