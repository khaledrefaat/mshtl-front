import { useEffect, useState } from 'react';
import useHttpClient from './hooks/http-hook';
import Modal from './shared/Modal';
import Container from './shared/Container';
import PageHeader from './shared/PageHeader';
import Error from './shared/Error';
import Table from './table/Table';
import TrashIcon from './shared/TrashIcon';
import TableData from './table/TableData';
import { convertDate } from '../util/util';
import { NewNoteBooks } from '../data.types';

interface TemplateInterface {
  title: string;
  url: string;
}

const Template: React.FC<TemplateInterface> = ({ title, url }) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [data, setData] = useState<NewNoteBooks[]>([]);

  const headers = ['', 'تاريخ', 'بيان', 'منصرف', 'رصيد'];

  const fetchData = async () => {
    try {
      const res = await sendRequest(url);
      setData(res);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handelDelete = async (data: NewNoteBooks) => {
    try {
      clearError();
      const res = await sendRequest(url + `/${data._id}`, 'DELETE');
      if (res) fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {isLoading && <Modal spinner />}
      <Container>
        <PageHeader noItemTitle title={title} />
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

export default Template;
