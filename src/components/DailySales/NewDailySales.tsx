import { FormSelect } from 'react-bootstrap';
import CustomForm from '../form/CustomForm';
import { useState } from 'react';
import NewTrays from './NewTrays';
import NewSupplierData from './NewSupplierData';
import NewPlantingNote from './NewPlantingNote';
import NewCustomerData from './NewCustomerData';
import NewOrderSeeding from './NewOrderSeeding';
import Modal from '../shared/Modal';

import classes from './styles.module.css';
import NewNoteData from './NewNoteData';
import OldDataRequest from './OldDataRequest';
import NewLoan from './NewLoan';

interface NewDailySalesInterface {
  hideModal: () => void;
  fetchData: (page: number) => void;
}

const NewDailySales: React.FC<NewDailySalesInterface> = ({
  hideModal,
  fetchData,
}) => {
  const [selectValue, setSelectValue] = useState('');

  const handelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // the only job of this onSubmit function is to call the fetchDataFunction instead of passing it to each component
  const onSubmit = () => {
    hideModal();
    setTimeout(() => fetchData(1), 500);
  };

  const returnComponent = (value: string) => {
    if (value === 'trays') return <NewTrays hideModal={onSubmit} />;
    else if (value === 'supplier')
      return <NewSupplierData hideModal={onSubmit} />;
    else if (value === 'seeding')
      return <NewPlantingNote hideModal={onSubmit} />;
    else if (value === 'client')
      return <NewCustomerData hideModal={onSubmit} />;
    else if (value === 'orderSeeding')
      return <NewOrderSeeding hideModal={onSubmit} />;
    else if (value === 'loan') return <NewLoan hideModal={onSubmit} />;
    else if (value === 'electricity')
      return (
        <NewNoteData
          hideModal={onSubmit}
          url={`${import.meta.env.VITE_URI}/electricity`}
        />
      );
    else if (value === 'fixed-salary')
      return (
        <NewNoteData
          hideModal={onSubmit}
          url={`${import.meta.env.VITE_URI}/fixed-salary`}
        />
      );
    else if (value === 'employment')
      return (
        <NewNoteData
          hideModal={onSubmit}
          url={`${import.meta.env.VITE_URI}/employment`}
        />
      );
    else if (value === 'forks')
      return (
        <NewNoteData
          hideModal={onSubmit}
          url={`${import.meta.env.VITE_URI}/forks`}
        />
      );
    else if (value === 'gas')
      return (
        <NewNoteData
          hideModal={onSubmit}
          url={`${import.meta.env.VITE_URI}/gas`}
        />
      );
    else if (value === 'hospitality')
      return (
        <NewNoteData
          hideModal={onSubmit}
          url={`${import.meta.env.VITE_URI}/hospitality`}
        />
      );
    else if (value === 'requirements')
      return (
        <NewNoteData
          hideModal={onSubmit}
          url={`${import.meta.env.VITE_URI}/requirements`}
        />
      );
    else if (value === 'water')
      return (
        <NewNoteData
          hideModal={onSubmit}
          url={`${import.meta.env.VITE_URI}/water`}
        />
      );
    else if (value === 'item')
      return (
        <NewNoteData
          hideModal={onSubmit}
          url={`${import.meta.env.VITE_URI}/item`}
        />
      );
    else if (value == 'item - fertilizer') {
      return <OldDataRequest hideModal={onSubmit} />;
    }
  };

  return (
    <Modal onClick={hideModal}>
      <div
        className={`${classes.container} ${classes['daily-sales__container']}`}
        onClick={e => e.stopPropagation()}
      >
        {/* <Svg className={classes['close-icon']} onClick={hideModal} /> */}
        <CustomForm onSubmit={e => handelSubmit(e)}>
          <FormSelect
            className="mb-4"
            onChange={e => setSelectValue(e.target.value)}
          >
            <option>اختر الدفتر</option>
            <option value="trays">صوانـــــــــــــــــــــي</option>
            <option value="supplier">المــــــــــــــــــورد</option>
            <option value="seeding">دفتــــــــــــــــــــر الزرعة</option>
            <option value="client">العمـــــــــــــــــــــيل</option>
            <option value="orderSeeding">
              حجــــــــــــــــــــــز شتـــــلات
            </option>
            <option value="electricity">كهرباء</option>
            <option value="employment">عمالة</option>
            <option value="fixed-salary">أجور ثابتة</option>
            <option value="gas">بنزين</option>
            <option value="hospitality">ضيافة</option>
            <option value="requirements">مستلزمات مشتل</option>
            <option value="water">مياه</option>
            <option value="loan">سلفة</option>
            <option value="item - fertilizer">صنف و مبيد</option>
          </FormSelect>
          {selectValue && returnComponent(selectValue)}
        </CustomForm>
      </div>
    </Modal>
  );
};

export default NewDailySales;
