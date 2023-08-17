import { useState } from 'react';
import CustomForm from '../form/CustomForm';
import CustomFormGroup from '../form/CustomFormGroup';
import CustomButton from '../shared/CustomButton';
import Modal from '../shared/Modal';
import classes from './styles.module.css';
import { ReactComponent as Svg } from '../Icons/close.svg';
import { FormText } from 'react-bootstrap';
import useHttpClient from '../hooks/http-hook';
import _ from 'lodash';

interface NewRequestInterface {
  hideModal: () => void;
  url: string;
  errorMsg?: string;
  title: string;
  secondTitle?: string;
  type?: string;
  itemId?: string;
}

const NewRequest: React.FC<NewRequestInterface> = ({
  hideModal,
  url,
  errorMsg,
  title,
  secondTitle,
  type,
  itemId,
}) => {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [clientError, setClientError] = useState('');
  const { error, sendRequest, clearError } = useHttpClient();

  const handelFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (name.length < 3) {
      if (errorMsg) return setClientError(errorMsg);
    }

    try {
      let res;

      if (itemId) {
        res = await sendRequest(
          url,
          'PATCH',
          JSON.stringify({ newPrice: value, _id: itemId }),
          {
            'Content-Type': 'application/json',
          }
        );
      } else if (type === 'customer') {
        // i will only suit the Customer Request
        res = await sendRequest(
          url,
          'POST',
          JSON.stringify({ name, phone: value }),
          {
            'Content-Type': 'application/json',
          }
        );
      } else if (secondTitle) {
        // i will only suit the Item Request
        res = await sendRequest(
          url,
          'POST',
          JSON.stringify({ name, unitPrice: value }),
          {
            'Content-Type': 'application/json',
          }
        );
      } else {
        res = await sendRequest(url, 'POST', JSON.stringify({ name }), {
          'Content-Type': 'application/json',
        });
      }

      if (res) return hideModal();
      if (error) return setClientError(error as string);
    } catch (err) {
      console.log(err);
    }
  };

  const handelNameChange = (name: string) => {
    setClientError('');
    clearError();
    setName(name);
  };

  const handelSecondInputChange = (value: string) => setValue(value);

  const debounceSubmit = _.debounce(handelFormSubmit, 1000);

  if (itemId)
    return (
      <Modal onClick={hideModal}>
        <div className={classes.container} onClick={e => e.stopPropagation()}>
          <Svg className={classes['close-icon']} onClick={hideModal} />
          <CustomForm onSubmit={debounceSubmit}>
            <CustomFormGroup
              value={value}
              onChange={handelSecondInputChange}
              type="number"
              label={title}
            />
            <CustomButton type="submit">أرسل</CustomButton>
            {error || clientError ? (
              <FormText className="text-danger">
                {error || clientError}
              </FormText>
            ) : (
              <FormText className="text-danger">&nbsp;</FormText>
            )}
          </CustomForm>
        </div>
      </Modal>
    );

  return (
    <Modal onClick={hideModal}>
      <div className={classes.container} onClick={e => e.stopPropagation()}>
        <Svg className={classes['close-icon']} onClick={hideModal} />
        <CustomForm onSubmit={handelFormSubmit}>
          <CustomFormGroup
            value={name}
            onChange={handelNameChange}
            type="text"
            label={title}
          />
          {secondTitle && (
            <CustomFormGroup
              value={value}
              onChange={handelSecondInputChange}
              type="number"
              label={secondTitle}
            />
          )}
          <CustomButton type="submit">أرسل</CustomButton>
          {error || clientError ? (
            <FormText className="text-danger">{error || clientError}</FormText>
          ) : (
            <FormText className="text-danger">&nbsp;</FormText>
          )}
        </CustomForm>
      </div>
    </Modal>
  );
};

export default NewRequest;
