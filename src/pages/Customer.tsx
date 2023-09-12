import React, { useEffect, useState } from 'react';
import Container from '../components/shared/Container';
import PageHeader from '../components/shared/PageHeader';
import useHttpClient from '../components/hooks/http-hook';
import Table from '../components/table/Table';
import {
  Customer as CustomerType,
  customerData as CustomerData,
} from '../data.types';
import { Col, Row } from 'react-bootstrap';
import SideBar from '../components/shared/SideBar';
import Error from '../components/shared/Error';
import SideBarItem from '../components/shared/SideBarItem';
import TableData from '../components/table/TableData';
import Modal from '../components/shared/Modal';
import { convertDate, filterByName } from '../util/util';
import TrashIcon from '../components/shared/TrashIcon';

interface CustomerInterface {
  toggleNav: () => void;
  printMode: boolean;
}

const Customer: React.FC<CustomerInterface> = ({ toggleNav, printMode }) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [customer, setCustomer] = useState<CustomerType>();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<CustomerType[]>([]);

  const headers = [
    'التاريخ',
    'سعر الوحدة',
    'البيــــــــــــــــان',
    'المدفوع',
    'الوحدات',
    'الإجمالي',
    'الرصيد',
  ];

  const headersWithTrashIcon = ['', ...headers];

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        clearError();
        const res = await sendRequest(`${import.meta.env.VITE_URI}/customer`);
        setCustomers(res);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCustomers();
  }, []);

  const onCustomerClick = async (customerId: string) => {
    try {
      const customer = customers.find(customer => customer._id == customerId);
      setCustomer(customer);
    } catch (err) {
      console.log(err);
    }
  };

  const handelDeleteCustomerData = async (customerData: CustomerData) => {
    const itemUrl = `${import.meta.env.VITE_URI}/customer/item/${
      customer?._id
    }/${customerData._id}`;

    const fertilizerUrl = `${import.meta.env.VITE_URI}/customer/fertilizer/${
      customer?._id
    }/${customerData._id}`;

    const moneyUrl = `${import.meta.env.VITE_URI}/customer/${customer?._id}/${
      customerData._id
    }`;

    const returnUrl = () => {
      if (customerData.itemId) return itemUrl;
      else if (customerData.fertilizerId) return fertilizerUrl;
      else return moneyUrl;
    };

    try {
      clearError();
      const newData = await sendRequest(returnUrl(), 'DELETE');
      setCustomer(newData.customer);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length > 0) {
        setSearchResult(filterByName(searchTerm, customers));
      } else {
        setSearchResult(customers);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, customers]);

  useEffect(() => {
    const timer = setTimeout(() => {
      document.addEventListener('keydown', e => {
        if (e.key === 'p') {
          toggleNav();
        }
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && <Modal spinner />}
      <Container>
        <PageHeader
          itemName="أسم العميل"
          itemTitle={customer?.name || ''}
          secondTitle="الرصيد"
          secondValue={customer?.balance}
          thirdTitle="الصواني"
          thirdValue={customer?.trays}
          fourthTitle="رقم الموبايل"
          fourthValue={customer?.phone}
        />
        {!printMode && (
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
        )}
        {error ? (
          <Error>{error}</Error>
        ) : (
          <Row>
            {!printMode && (
              <Col sm={2}>
                <SideBar title="العملاء">
                  {searchResult &&
                    searchResult.map(customer => (
                      <SideBarItem
                        key={customer._id}
                        id={customer._id}
                        onClick={onCustomerClick}
                      >
                        {customer.name}
                      </SideBarItem>
                    ))}
                </SideBar>
              </Col>
            )}
            <Col>
              <Table headers={printMode ? headers : headersWithTrashIcon}>
                {customer &&
                  customer.data.map(customerData => (
                    <React.Fragment key={customerData._id}>
                      <tr>
                        {!printMode && (
                          <TrashIcon
                            onClick={() =>
                              handelDeleteCustomerData(customerData)
                            }
                          />
                        )}
                        <TableData>
                          {customerData.date && convertDate(customerData.date)}
                        </TableData>
                        <TableData>{customerData.unitPrice}</TableData>
                        <TableData>{customerData.statement}</TableData>
                        <TableData>{customerData.paid}</TableData>
                        <TableData>
                          {customerData.trays || customerData.units}
                        </TableData>
                        <TableData>{customerData.total}</TableData>
                        <TableData>{customerData.balance}</TableData>
                      </tr>
                    </React.Fragment>
                  ))}
              </Table>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default Customer;
