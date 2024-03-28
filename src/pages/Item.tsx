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
import { Item, itemData } from '../data.types';
import { convertDate, filterByName } from '../util/util';
import NewRequest from '../components/DailySales/NewRequest';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sendRequest } from '../util/api';
const Seed = () => {
  const { data, status, error } = useQuery({
    queryKey: ['items'],
    queryFn: async () => await sendRequest(`${import.meta.env.VITE_URI}/item`),
  });

  const [item, setItem] = useState<Item>();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<Item[]>([]);
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

  async function onItemClick(itemId: string) {
    try {
      const item = data.find(item => item._id === itemId);
      setItem(item);
    } catch (err) {
      console.log(err);
    }
  }

  const queryClient = useQueryClient();

  const mutation = useMutation({
    async mutationFn(url: string) {
      return await sendRequest(url, true);
    },
    async onSuccess(data) {
      const { item, customer } = await data;
      queryClient.invalidateQueries({ queryKey: ['items'] });
      if (customer) queryClient.invalidateQueries({ queryKey: ['customers'] });

      // update selected Item
      setItem(item);
    },
  });

  const handelDeleteItemData = async (data: itemData) => {
    if (data.customerTransactionId) {
      await mutation.mutateAsync(
        `${import.meta.env.VITE_URI}/customer/item/${data.customerId}/${
          data.customerTransactionId
        }`
      );
    } else if (data.seedingId) {
      await mutation.mutateAsync(
        `${import.meta.env.VITE_URI}/seed/${data.seedingId}`
      );
    } else if (data.dailySaleId) {
      await mutation.mutateAsync(
        `${import.meta.env.VITE_URI}/item/${item?._id}/${data._id}`
      );
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length > 0) {
        setSearchResult(filterByName(searchTerm, data));
      } else {
        setSearchResult(data);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, data]);

  return (
    <>
      {status == 'pending' && <Modal spinner />}
      {mutation.isPending && <Modal spinner />}
      <Container>
        <PageHeader
          itemName="أسم الصنف "
          itemTitle={item?.name || ''}
          secondTitle="الرصيد"
          secondValue={item?.balance}
          hasInput
          onClick={() => setModal(true)}
        />
        <div className="input-group d-flex justify-content-start">
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
        {error || mutation.isError ? (
          <Error>{error.message || mutation.error.message}</Error>
        ) : (
          <Row>
            <Col sm={2}>
              <SideBar title="الاصناف">
                {searchResult &&
                  searchResult.map(item => (
                    <SideBarItem
                      key={item._id}
                      id={item._id}
                      onClick={onItemClick}
                    >
                      {item.name}
                    </SideBarItem>
                  ))}
              </SideBar>
            </Col>
            <Col>
              <Table headers={headers}>
                {item &&
                  item.data.map(item => (
                    <tr key={item._id}>
                      <TrashIcon onClick={() => handelDeleteItemData(item)} />
                      <TableData>{item.notes}</TableData>
                      <TableData>
                        {item.date && convertDate(item.date)}
                      </TableData>
                      <TableData>{item.statement}</TableData>
                      <TableData>{item.expense}</TableData>
                      <TableData>{item.income}</TableData>
                      <TableData>{item.balance}</TableData>
                    </tr>
                  ))}
                {modal && (
                  <NewRequest
                    title="سعـــــــــــــــــــــر الـــــــــــــــوحدة"
                    hideModal={() => setModal(false)}
                    url={`${import.meta.env.VITE_URI}/item`}
                    itemId={item?._id}
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

export default Seed;
