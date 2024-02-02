import Table from '../components/table/Table';
import TableData from '../components/table/TableData';
import Container from '../components/shared/Container';
import PageHeader from '../components/shared/PageHeader';
import { useEffect, useState } from 'react';
import { Item, itemOrder } from '../data.types';
import useHttpClient from '../components/hooks/http-hook';
import Modal from '../components/shared/Modal';
import Error from '../components/shared/Error';
import { Col, Row } from 'react-bootstrap';
import SideBar from '../components/shared/SideBar';
import SideBarItem from '../components/shared/SideBarItem';
import { convertDate, filterByName } from '../util/util';

import { ReactComponent as TrashSvg } from '../components/Icons/trash.svg';
import { ReactComponent as DoneSvg } from '../components/Icons/check-cricle.svg';

const OrderSeedings = () => {
  const [items, setItems] = useState<Item[]>([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [item, setItem] = useState<Item>();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<Item[]>([]);

  const headers = [
    '',
    'ملاحظات',
    'تاريخ أرض',
    'تاريخ مشتل',
    'عدد صواني',
    'إجمالي الصواني',
    'الأســــــــــــــم',
  ];

  useEffect(() => {
    const fetchItems = async () => {
      try {
        clearError;
        const res = await sendRequest(`${import.meta.env.VITE_URI}/item`);
        setItems(res);
      } catch (err) {
        console.log(err);
      }
    };
    fetchItems();
  }, []);

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

  const onItemClick = async (itemId: string) => {
    try {
      const item = items.find(item => item._id === itemId);
      setItem(item as Item);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAndSelectItems = async () => {
    try {
      const items = await sendRequest(`${import.meta.env.VITE_URI}/item`);
      if (items) setItems(items);
      const findItem = items.find((newItem: Item) => newItem._id === item?._id);
      setItem(findItem);
    } catch (err) {
      console.log(err);
    }
  };

  const handelDeleteItemData = async (order: itemOrder) => {
    try {
      const res = await sendRequest(
        `${import.meta.env.VITE_URI}/item/order/${item?._id}/${order._id}`,
        'DELETE'
      );
      if (res) fetchAndSelectItems();
    } catch (err) {
      console.log(err);
    }
  };

  const handelConfirmOrder = async (order: itemOrder) => {
    try {
      const res = await sendRequest(
        `${import.meta.env.VITE_URI}/item/order/${item?._id}/${order._id}`,
        'PUT'
      );
      if (res) fetchAndSelectItems();
    } catch (err) {
      console.log(err);
    }
  };

  const calcTotalOrders = () => {
    let total = 0;
    item?.orders.forEach(order => (total += order.trays));
    return total;
  };

  return (
    <>
      {isLoading && <Modal spinner />}
      <Container>
        <PageHeader
          itemName="أسم الصنف"
          itemTitle={item?.name || ''}
          secondTitle="عدد الصواني"
          secondValue={calcTotalOrders()}
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
                {item?.orders.map(order => {
                  return (
                    <tr key={order._id}>
                      <TableData>
                        <TrashSvg
                          className="action-icon trash-icon"
                          onClick={() => handelDeleteItemData(order)}
                        />
                        <DoneSvg
                          className="action-icon done-icon"
                          onClick={() => handelConfirmOrder(order)}
                        />
                      </TableData>
                      <TableData>{order.notes}</TableData>
                      <TableData>
                        {order.landDate && convertDate(order.landDate)}
                      </TableData>
                      <TableData>
                        {order.seedDate && convertDate(order.seedDate)}
                      </TableData>
                      <TableData>{order.trays}</TableData>
                      <TableData>{order.total}</TableData>
                      <TableData>{order.name}</TableData>
                    </tr>
                  );
                })}
              </Table>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default OrderSeedings;
