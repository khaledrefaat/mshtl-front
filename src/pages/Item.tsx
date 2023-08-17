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
import { Item, itemData } from '../data.types';
import { convertDate, filterByName } from '../util/util';
import NewRequest from '../components/DailySales/NewRequest';
const Seed = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [item, setItem] = useState<Item>();
  const [items, setItems] = useState<Item[]>([]);
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

  useEffect(() => {
    const fetchItems = async () => {
      try {
        clearError();
        const res = await sendRequest(import.meta.env.VITE_URI + '/item');
        setItems(res);
      } catch (err) {
        console.log(err);
      }
    };
    fetchItems();
  }, []);

  const onItemClick = async (itemId: string) => {
    try {
      const item = items.find(item => item._id === itemId);
      setItem(item);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAndSelectItem = async () => {
    const items = await sendRequest(`${import.meta.env.VITE_URI}/item`);
    setItems(items);
    let newItem = items.find((newItem: Item) => newItem._id === item?._id);
    setItem(newItem);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length > 0) {
        setSearchResult(filterByName(searchTerm, items));
      } else {
        setSearchResult(items);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, items]);

  const handelDeleteItemData = async (data: itemData) => {
    if (data.customerTransactionId) {
      try {
        clearError();
        const newData = await sendRequest(
          `${import.meta.env.VITE_URI}/customer/item/${data.customerId}/${
            data.customerTransactionId
          }`,
          'DELETE'
        );
        if (newData) fetchAndSelectItem();
      } catch (err) {
        console.log(err);
      }
    } else if (data.seedingId) {
      try {
        clearError();
        const res = await sendRequest(
          `${import.meta.env.VITE_URI}/seed/${data.seedingId}`,
          'DELETE'
        );
        if (res) fetchAndSelectItem();
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
        {error ? (
          <Error>{error}</Error>
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
                    <>
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
                    </>
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
