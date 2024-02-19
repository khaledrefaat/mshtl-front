import React, { useEffect, useState } from 'react';
import CustomFormGroup from '../form/CustomFormGroup';
import { Loaner } from '../../data.types';
import useHttpClient from '../hooks/http-hook';
import Modal from '../shared/Modal';
import CustomButton from '../shared/CustomButton';
import Error from '../shared/Error';
import CustomSelect from '../form/CustomSelect';

interface NewLoanInterface {
  hideModal: () => void;
}

const NewLoan: React.FC<NewLoanInterface> = ({ hideModal }) => {
  const [loaner, setLoaner] = useState<Loaner[]>([]);
  const [loanerId, setLoanerId] = useState('');
  const { isLoading, error, clearError, sendRequest } = useHttpClient();

  const [expense, setExpense] = useState('');
  const [income, setIncome] = useState('');
  const [statement, setStatement] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const onExpenseChange = (expense: string) => setExpense(expense);
  const onIncomeChange = (income: string) => setIncome(income);
  const onStatementChange = (statement: string) => setStatement(statement);

  useEffect(() => {
    const fetchData = async () => {
      try {
        clearError();
        const loaner = await sendRequest(`${import.meta.env.VITE_URI}/loan`);
        setLoaner(loaner);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const onLoanerSelect = (selectedSupplier: Loaner) =>
    setLoanerId(selectedSupplier._id);

  const onFormSubmit = async () => {
    try {
      clearError();
      let res;
      res = await sendRequest(
        `${import.meta.env.VITE_URI}/loan/${loanerId}`,
        'POST',
        JSON.stringify({
          expense,
          income,
          unitPrice: income,
          statement,
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
    if ((!expense && income && statement) || (expense && !income && statement))
      setButtonDisabled(false);
    else setButtonDisabled(true);
  }, [expense, income, statement]);

  return (
    <>
      {isLoading && <Modal spinner />}
      <CustomSelect
        title="اختر المستلف"
        list={loaner}
        onValueChange={onLoanerSelect}
      />
      {loanerId && (
        <>
          <CustomFormGroup
            label=": الصادر"
            type="number"
            onChange={onExpenseChange}
            value={expense}
            sideLabel
          />
          <CustomFormGroup
            label=": الوارد"
            type="number"
            onChange={onIncomeChange}
            value={income}
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

export default NewLoan;
