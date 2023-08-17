import { useEffect, useState } from 'react';
import CustomFormGroup from '../form/CustomFormGroup';
import CustomButton from '../shared/CustomButton';
import Error from '../shared/Error';
import useHttpClient from '../hooks/http-hook';
import Modal from '../shared/Modal';

interface NewNoteDataInterface {
  hideModal: () => void;
  url: string;
}

const NewLoanData: React.FC<NewNoteDataInterface> = ({ hideModal, url }) => {
  const { isLoading, error, clearError, sendRequest } = useHttpClient();

  const [expense, setExpense] = useState('');
  const [income, setIncome] = useState('');
  const [statement, setStatement] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const onExpenseChange = (expense: string) => setExpense(expense);
  const onIncomeChange = (income: string) => setIncome(income);
  const onStatementChange = (statement: string) => setStatement(statement);

  const onFormSubmit = async () => {
    try {
      clearError();
      const res = await sendRequest(
        url,
        'POST',
        JSON.stringify({
          expense,
          income,
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
    if ((expense && statement) || (income && statement))
      setButtonDisabled(false);
    else setButtonDisabled(true);
  }, [expense, statement]);

  return (
    <>
      {isLoading && <Modal spinner />}
      <>
        <CustomFormGroup
          label=": الوارد"
          type="number"
          onChange={onIncomeChange}
          value={income}
          sideLabel
        />
        <CustomFormGroup
          label=": الصادر"
          type="number"
          onChange={onExpenseChange}
          value={expense}
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
        >
          أرســـــــــــــــــل
        </CustomButton>
        {error && <Error>{error}</Error>}
      </>
    </>
  );
};

export default NewLoanData;
