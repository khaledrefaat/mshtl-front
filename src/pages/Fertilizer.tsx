import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import useHttpClient from '../components/hooks/http-hook';
import Container from '../components/shared/Container';
import Error from '../components/shared/Error';
import Modal from '../components/shared/Modal';
import PageHeader from '../components/shared/PageHeader';
import SideBar from '../components/shared/SideBar';
import SideBarItem from '../components/shared/SideBarItem';
import TrashIcon from '../components/shared/TrashIcon';
import Table from '../components/table/Table';
import TableData from '../components/table/TableData';
import { Fertilizer, fertilizerData } from '../data.types';
import { convertDate, filterByName } from '../util/util';
import NewRequest from '../components/DailySales/NewRequest';
const FertilizerPage = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [selectedFertilizer, setSelectedFertilizer] = useState<
    Fertilizer | undefined
  >();
  const [fertilizers, setFertilizers] = useState<Fertilizer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<Fertilizer[]>([]);
  const [modal, setModal] = useState(false);

  const headers = [
    '',
    'ملاحظات',
    'التاريخ',
    'البيــــــــــــــــان',
    'المنصرف',
    'الوارد',
    'الرصيد',
  ];

  useEffect(() => {
    const fetchFertilizers = async () => {
      try {
        clearError();
        const res = await sendRequest(`${import.meta.env.VITE_URI}/fertilizer`); // Update endpoint
        setFertilizers(res);
      } catch (err) {
        console.log(err);
      }
    };
    fetchFertilizers();
  }, []);

  const onFertilizerClick = async (fertilizerId: string) => {
    try {
      const selectedFertilizer = fertilizers.find(
        fertilizer => fertilizer._id === fertilizerId
      );
      console.log(selectedFertilizer);
      setSelectedFertilizer(selectedFertilizer);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const searchTimer = setTimeout(() => {
      if (searchTerm.length > 0) {
        setSearchResult(filterByName(searchTerm, fertilizers));
      } else {
        setSearchResult(fertilizers);
      }
    }, 300);
    return () => clearTimeout(searchTimer);
  }, [searchTerm, fertilizers]);

  const fetchAndSelectFertilizer = async () => {
    const fertilizers = await sendRequest(
      `${import.meta.env.VITE_URI}/fertilizer`
    ); //
    setFertilizers(fertilizers);
    const newFertilizer = fertilizers.find(
      (newFertilizer: Fertilizer) =>
        newFertilizer._id === selectedFertilizer?._id
    );
    setSelectedFertilizer(newFertilizer);
  };

  const handleDeleteFertilizerData = async (data: fertilizerData) => {
    if (data.supplierId) {
      try {
        clearError();
        let newData;
        if (data.supplierId) {
          newData = await sendRequest(
            `${import.meta.env.VITE_URI}/supplier/${data.supplierId}/${
              data.supplierTransactionId
            }`,
            'DELETE'
          );
        } else if (data.customerId) {
          newData = await sendRequest(
            `${import.meta.env.VITE_URI}/customer/fertilizer/${
              data.customerId
            }/${data.customerTransactionId}`,
            'DELETE'
          );
        }
        if (newData) fetchAndSelectFertilizer();
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
          itemName="اسم السماد أو المبيد"
          itemTitle={selectedFertilizer?.name || ''}
          secondTitle="الرصيد"
          secondValue={selectedFertilizer?.balance}
          hasInput
          onClick={() => setModal(true)}
        />
        <div className="input-group d-flex justify-content-start">
          <div className="form-outline">
            <input
              type="search"
              className="form-control"
              placeholder="بحث"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {error ? (
          <Error>{error}</Error>
        ) : (
          <Row>
            <Col sm={2}>
              <SideBar title="الأسمدة والمبيدات">
                {searchResult &&
                  searchResult.map(fertilizer => (
                    <SideBarItem
                      key={fertilizer._id}
                      id={fertilizer._id}
                      onClick={() => onFertilizerClick(fertilizer._id)}
                    >
                      {fertilizer.name}
                    </SideBarItem>
                  ))}
              </SideBar>
            </Col>
            <Col>
              <Table headers={headers}>
                {selectedFertilizer &&
                  selectedFertilizer.data.map(transaction => (
                    <tr key={transaction._id}>
                      <TrashIcon
                        onClick={() => handleDeleteFertilizerData(transaction)}
                      />
                      <TableData>{transaction.notes}</TableData>
                      <TableData>
                        {transaction.date && convertDate(transaction.date)}
                      </TableData>
                      <TableData>{transaction.statement}</TableData>
                      <TableData>{transaction.expense}</TableData>
                      <TableData>{transaction.income}</TableData>
                      <TableData>{transaction.balance}</TableData>
                    </tr>
                  ))}
                {modal && (
                  <NewRequest
                    title="سعر الوحدة"
                    hideModal={() => setModal(false)}
                    url={`${import.meta.env.VITE_URI}/fertilizer`}
                    itemId={selectedFertilizer?._id}
                  />
                )}
              </Table>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default FertilizerPage;
