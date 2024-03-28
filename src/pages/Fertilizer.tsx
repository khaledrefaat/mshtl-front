import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
const FertilizerPage = () => {
  const {
    status,
    data,
    error,
  }: { status: string; data: Fertilizer[] | undefined; error: any } = useQuery({
    queryKey: ['fertilizers'],
    queryFn: fetchFertilizers,
  });

  const [selectedFertilizer, setSelectedFertilizer] = useState<
    Fertilizer | undefined
  >();
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

  async function fetchFertilizers() {
    try {
      const res = await fetch(`${import.meta.env.VITE_URI}/fertilizer`);
      return await res.json();
    } catch (err) {
      console.log(err);
    }
  }
  const onFertilizerClick = async (fertilizerId: string) => {
    try {
      const selectedFertilizer = data.find(
        fertilizer => fertilizer._id === fertilizerId
      );
      setSelectedFertilizer(selectedFertilizer);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const searchTimer = setTimeout(() => {
      if (searchTerm.length > 0) {
        setSearchResult(filterByName(searchTerm, data));
      } else {
        setSearchResult(data);
      }
    }, 200);
    return () => clearTimeout(searchTimer);
  }, [searchTerm, data]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (url: string) => {
      return await fetch(url, {
        method: 'DELETE',
      });
    },
    onSuccess: async data => {
      const { customer, fertilizer, supplier } = await data.json();

      queryClient.invalidateQueries({ queryKey: ['fertilizers'] });

      if (customer) queryClient.invalidateQueries({ queryKey: ['customers'] });
      if (supplier) queryClient.invalidateQueries({ queryKey: ['suppliers'] });

      // update selected fertilizer
      setSelectedFertilizer(fertilizer);
    },
  });

  const handleDeleteFertilizerData = async (data: fertilizerData) => {
    if (data.supplierId) {
      mutation.mutate(
        `${import.meta.env.VITE_URI}/supplier/${data.supplierId}/${
          data.supplierTransactionId
        }`
      );
    } else if (data.customerId) {
      mutation.mutate(
        `${import.meta.env.VITE_URI}/customer/fertilizer/${data.customerId}/${
          data.customerTransactionId
        }`
      );
    } else if (data.dailySaleId) {
      mutation.mutate(
        `${import.meta.env.VITE_URI}/fertilizer/${selectedFertilizer?._id}/${
          data._id
        }`
      );
    }
  };

  return (
    <>
      {status == 'pending' && <Modal spinner />}
      {mutation.isPending && !mutation.isSuccess && <Modal spinner />}
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
          <Error>{error.message}</Error>
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
