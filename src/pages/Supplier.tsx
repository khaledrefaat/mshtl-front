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
import { Supplier as SupplierType } from '../data.types';
import { convertDate, filterByName } from '../util/util';
const Supplier = () => {
  const [supplier, setSupplier] = useState<SupplierType>();
  const [suppliers, setSuppliers] = useState<SupplierType[]>([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<SupplierType[]>([]);

  const headers = [
    '',
    'ملاحظات',
    'التاريخ',
    'البيان',
    'سعر الوحدة',
    'الوحدة',
    'الإجمالي',
    'المدفوع',
    'الرصيد',
  ];

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        clearError();
        const data = await sendRequest(`${import.meta.env.VITE_URI}/supplier`);
        setSuppliers(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSuppliers();
  }, []);

  const onSupplierClick = async (supplierId: string) => {
    try {
      clearError();
      const supplier = suppliers.find(supplier => supplier._id == supplierId);
      setSupplier(supplier);
    } catch (err) {
      console.log(err);
    }
  };

  const handelDeleteRequest = async (transactionId: string) => {
    try {
      clearError();
      const newData = await sendRequest(
        `${import.meta.env.VITE_URI}/supplier/${
          supplier?._id
        }/${transactionId}`,
        'DELETE'
      );
      if (newData) {
        const data = await sendRequest(`${import.meta.env.VITE_URI}/supplier`);
        setSuppliers(data);
        const findSupplier = data.find(
          (newSupplier: SupplierType) => newSupplier._id === supplier?._id
        );
        setSupplier(findSupplier);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length > 0) {
        setSearchResult(filterByName(searchTerm, suppliers));
      } else {
        setSearchResult(suppliers);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, suppliers]);

  return (
    <>
      {isLoading && <Modal spinner />}
      <Container>
        <PageHeader
          itemName="أسم ألمورد "
          itemTitle={supplier?.name || ''}
          secondTitle="الرصيد"
          secondValue={supplier?.balance}
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
              <SideBar title="الموردين">
                {searchResult &&
                  searchResult.map(supplier => (
                    <SideBarItem
                      key={supplier._id}
                      id={supplier._id}
                      onClick={onSupplierClick}
                    >
                      {supplier.name}
                    </SideBarItem>
                  ))}
              </SideBar>
            </Col>
            <Col>
              <Table headers={headers}>
                {supplier &&
                  supplier.data.map(
                    ({
                      _id,
                      notes,
                      date,
                      statement,
                      total,
                      balance,
                      unitPrice,
                      unit,
                      paid,
                    }) => (
                      <tr key={_id}>
                        <TrashIcon onClick={() => handelDeleteRequest(_id)} />
                        <TableData>{notes}</TableData>
                        <TableData>{date && convertDate(date)}</TableData>
                        <TableData>{statement}</TableData>
                        <TableData>{unitPrice}</TableData>
                        <TableData>{unit}</TableData>
                        <TableData>{total}</TableData>
                        <TableData>{paid}</TableData>
                        <TableData>{balance}</TableData>
                      </tr>
                    )
                  )}
              </Table>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default Supplier;
