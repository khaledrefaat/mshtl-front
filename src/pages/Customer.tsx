/* /index.html 200 */

import React, { useEffect, useRef, useState } from 'react';
import Container from '../components/shared/Container';
import PageHeader from '../components/shared/PageHeader';
import Table from '../components/table/Table';
import {
  Customer as CustomerType,
  customerData as CustomerData,
} from '../data.types';
import { Button, Col, Row } from 'react-bootstrap';
import SideBar from '../components/shared/SideBar';
import Error from '../components/shared/Error';
import SideBarItem from '../components/shared/SideBarItem';
import TableData from '../components/table/TableData';
import Modal from '../components/shared/Modal';
import { convertDate, filterByName } from '../util/util';
import TrashIcon from '../components/shared/TrashIcon';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sendRequest } from '../util/api';
import { useReactToPrint } from 'react-to-print';

const Customer = () => {
  const {
    status,
    data,
    error,
  }: { status: string; data: CustomerType[] | undefined; error: any } =
    useQuery({
      queryKey: ['customers'],
      queryFn: async () =>
        await sendRequest(`${import.meta.env.VITE_URI}/customer`),
    });

  const [customer, setCustomer] = useState<CustomerType>();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<CustomerType[]>([]);

  const ref = useRef();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (url: string) => await sendRequest(url, true),
    onSuccess: async data => {
      console.log(data);
      const { customer, fertilizer, trays, item } = await data;

      queryClient.invalidateQueries({ queryKey: ['customers'] });

      if (fertilizer)
        queryClient.invalidateQueries({ queryKey: ['fertilizers'] });

      if (item) queryClient.invalidateQueries({ queryKey: ['items'] });

      if (trays) queryClient.invalidateQueries({ queryKey: ['trays'] });

      // update selected customer
      setCustomer(customer);
    },
  });

  const headers = [
    '',
    'التاريخ',
    'سعر الوحدة',
    'البيــــــــــــــــان',
    'خصم',
    'المدفوع',
    'الوحدات',
    'الإجمالي',
    'الرصيد',
  ];

  function onCustomerClick(customerId: string) {
    try {
      if (data) {
        const customer = data.find(customer => customer._id == customerId);
        setCustomer(customer);
      }
    } catch (err) {
      console.log(err);
    }
  }

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

    const trayUrl = `${import.meta.env.VITE_URI}/tray/${customerData.trayId}`;

    const returnUrl = () => {
      if (customerData.itemId) return itemUrl;
      else if (customerData.fertilizerId) return fertilizerUrl;
      else if (customerData.trayId) return trayUrl;
      else return moneyUrl;
    };

    await mutation.mutateAsync(returnUrl());
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (status == 'success' && data) {
        if (searchTerm.length > 0) {
          setSearchResult(filterByName(searchTerm, data));
        } else {
          setSearchResult(data);
        }
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, searchResult, data]);

  const handelPrint = useReactToPrint({
    content: () => ref.current,
  });

  return (
    <>
      {status == 'pending' && <Modal spinner />}
      {mutation.isPending && <Modal spinner />}
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
          <Error>
            {(error && error.message) ||
              (mutation.error && mutation.error.message)}
          </Error>
        ) : (
          <Row>
            <Col sm={2}>
              <SideBar title="العملاء">
                {searchResult.length > 0 &&
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
            <Col>
              <div ref={ref}>
                <Table headers={headers}>
                  {customer &&
                    customer.data.map(customerData => (
                      <React.Fragment key={customerData._id}>
                        <tr>
                          <TrashIcon
                            onClick={() =>
                              handelDeleteCustomerData(customerData)
                            }
                          />
                          <TableData>
                            {customerData.date &&
                              convertDate(customerData.date)}
                          </TableData>
                          <TableData>{customerData.unitPrice}</TableData>
                          <TableData>{customerData.statement}</TableData>
                          <TableData>{customerData.discount}</TableData>
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
              </div>
              <Button onClick={handelPrint}>اطبع</Button>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default Customer;
