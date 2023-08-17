import { useEffect, useState } from 'react';
import Container from '../components/shared/Container';
import Error from '../components/shared/Error';
import PageHeader from '../components/shared/PageHeader';
import useHttpClient from '../components/hooks/http-hook';
import Table from '../components/table/Table';
import TableData from '../components/table/TableData';
import { Tray } from '../data.types';
import Modal from '../components/shared/Modal';
import { convertDate, filterByName } from '../util/util';
import TrashIcon from '../components/shared/TrashIcon';

const Trays = () => {
  const [trays, setTrays] = useState<Tray[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<Tray[]>([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [traysCount, setTraysCount] = useState<number>(0);

  const headers = [
    '',
    'ملاحظات',
    'التاريخ',
    'عدد الصواني الباقية',
    'عدد الصواني الوردة',
    'عدد الصواني المنصرفة',
    'الأســــــــــــــم',
  ];

  const fetchTrays = async () => {
    try {
      const res = await sendRequest(import.meta.env.VITE_URI + '/tray');
      setTrays(res.trays);
      setTraysCount(res.count);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchTrays();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length > 0) {
        setSearchResult(filterByName(searchTerm, trays));
      } else {
        setSearchResult(trays);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [searchTerm, trays]);

  const handelDelete = async (tray: Tray) => {
    console.log(tray.customerId);
    console.log(tray.income);
    if (tray.customerId && tray.transactionId) {
      try {
        clearError();
        const newData = await sendRequest(
          `${import.meta.env.VITE_URI}/customer/${tray.customerId}/${
            tray.transactionId
          }`,
          'DELETE'
        );
        if (newData) fetchTrays();
      } catch (err) {
        console.log(err);
      }
    } else if (tray.customerId && tray.income) {
      try {
        clearError();
        const res = await sendRequest(
          `${import.meta.env.VITE_URI}/tray/${tray._id}`,
          'DELETE'
        );
        if (res) fetchTrays();
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      {isLoading && <Modal spinner />}
      <Container>
        <PageHeader
          title="صوانـــــــــــــــــــــي"
          titleValue={traysCount}
          noMargin
        />

        {error ? (
          <Error>{error}</Error>
        ) : (
          <>
            <div className="input-group d-flex justify-content-end">
              <div className="form-outline">
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Table headers={headers}>
              {searchResult.map(item => {
                return (
                  <tr key={item._id}>
                    <TrashIcon onClick={() => handelDelete(item)} />
                    <TableData>{item.notes}</TableData>
                    <TableData>{item.date && convertDate(item.date)}</TableData>
                    <TableData>{item.left}</TableData>
                    <TableData>{item.income}</TableData>
                    <TableData>{item.expense}</TableData>
                    <TableData>{item.name}</TableData>
                  </tr>
                );
              })}
            </Table>
          </>
        )}
      </Container>
    </>
  );
};

export default Trays;
