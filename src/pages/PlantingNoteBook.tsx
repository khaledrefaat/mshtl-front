import { useEffect, useState } from 'react';
import useHttpClient from '../components/hooks/http-hook';
import Container from '../components/shared/Container';
import Error from '../components/shared/Error';
import Modal from '../components/shared/Modal';
import PageHeader from '../components/shared/PageHeader';
import TrashIcon from '../components/shared/TrashIcon';
import Table from '../components/table/Table';
import TableData from '../components/table/TableData';
import { Seeding } from '../data.types';
import { convertDate, filterByName } from '../util/util';
const PlantingNoteBook = () => {
  const [data, setData] = useState<Seeding[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<Seeding[]>([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const headers = [
    '',
    'الإجمالي',
    'ع الصواني ق.ع',
    'رقم اللوط',
    'تاريخ الزراعة',
    'الوحدة',
    'الكمية',
    'الصنف',
  ];

  const fetchData = async () => {
    clearError();
    try {
      const res = await sendRequest(`${import.meta.env.VITE_URI}/seed`);
      setData(res);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length > 0) {
        setSearchResult(filterByName(searchTerm, data, true));
      } else {
        setSearchResult(data);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [searchTerm, data]);

  const handelDelete = async (seed: Seeding) => {
    try {
      const res = await sendRequest(
        `${import.meta.env.VITE_URI}/seed/${seed._id}`,
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
        <PageHeader noItemTitle title="دفـــــتر زراعــــة" />
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
              {searchResult.map(seed => (
                <tr key={seed._id}>
                  <TrashIcon onClick={() => handelDelete(seed)} />
                  <TableData>{seed.total}</TableData>
                  <TableData>{seed.trays}</TableData>
                  <TableData>{seed.lotNumber}</TableData>
                  <TableData>
                    {seed.plantDate && convertDate(seed.plantDate)}
                  </TableData>
                  <TableData>{seed.unit}</TableData>
                  <TableData>{seed.quantity}</TableData>
                  <TableData>{seed.itemName}</TableData>
                </tr>
              ))}
            </Table>
          </>
        )}
      </Container>
    </>
  );
};

export default PlantingNoteBook;
