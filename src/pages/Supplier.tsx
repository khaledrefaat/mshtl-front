import { useContext, useEffect, useState } from 'react';
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
import { Supplier as SupplierType } from '../data.types';
import { convertDate, filterByName } from '../util/util';
import { AuthContext } from '../components/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sendRequest } from '../util/api';

const Supplier = () => {
  const {
    status,
    data,
    error,
  }: { status: string; data: SupplierType[] | undefined; error: any } =
    useQuery({
      queryKey: ['suppliers'],
      queryFn: () => sendRequest(`${import.meta.env.VITE_URI}/supplier`),
    });

  const [supplier, setSupplier] = useState<SupplierType>();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<SupplierType[]>([]);
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  if (!context.isAdmin) {
    navigate('/');
  }

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
  const queryClient = useQueryClient();

  const mutation = useMutation({
    async mutationFn(url: string) {
      return await sendRequest(url, true);
    },
    async onSuccess(data) {
      const { supplier, fertilizer } = await data;

      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      if (fertilizer)
        queryClient.invalidateQueries({ queryKey: ['fertilizers'] });

      // update supplier
      setSupplier(supplier);
    },
  });

  const onSupplierClick = async (supplierId: string) => {
    try {
      const supplier = data.find(supplier => supplier._id == supplierId);
      setSupplier(supplier);
    } catch (err) {
      console.log(err);
    }
  };

  const handelDeleteRequest = async (transactionId: string) => {
    await mutation.mutateAsync(
      `${import.meta.env.VITE_URI}/supplier/${supplier?._id}/${transactionId}`
    );
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
        {error || mutation.isError ? (
          <Error>{error.message || mutation.error.message}</Error>
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
