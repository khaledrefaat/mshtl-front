import { useEffect, useState } from 'react';
import useHttpClient from '../components/hooks/http-hook';
import Modal from '../components/shared/Modal';
import Container from '../components/shared/Container';
import PageHeader from '../components/shared/PageHeader';
import Error from '../components/shared/Error';
import Table from '../components/table/Table';
import TrashIcon from '../components/shared/TrashIcon';
import TableData from '../components/table/TableData';
import { convertDate } from '../util/util';
import { Loan as LoanType } from '../data.types';
const Loan = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [data, setData] = useState<LoanType[]>([]);

  const headers = ['', 'تاريخ', 'بيان', 'وارد', 'منصرف', 'رصيد'];

  const fetchData = async () => {
    try {
      const res = await sendRequest(`${import.meta.env.VITE_URI}/loan`);
      setData(res);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handelDelete = async (data: LoanType) => {
    try {
      clearError();
      const res = await sendRequest(
        `${import.meta.env.VITE_URI}/loan` + `/${data._id}`,
        'DELETE'
      );
      if (res) fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {isLoading && <Modal spinner />}
      <Container>
        <PageHeader noItemTitle title="سلفه" />
        <div className=""></div>
        {error ? (
          <Error>{error}</Error>
        ) : (
          <Table headers={headers}>
            {data.map(data => {
              return (
                <tr key={data._id}>
                  <TrashIcon onClick={() => handelDelete(data)} />
                  <TableData>{data.date && convertDate(data.date)}</TableData>
                  <TableData>{data.statement}</TableData>
                  <TableData>{data.income}</TableData>
                  <TableData>{data.expense}</TableData>
                  <TableData>{data.balance}</TableData>
                </tr>
              );
            })}
          </Table>
        )}
      </Container>
    </>
  );
};

export default Loan;
