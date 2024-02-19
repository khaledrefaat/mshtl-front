import { useEffect, useState } from 'react';
import useHttpClient from '../components/hooks/http-hook';
import Modal from '../components/shared/Modal';
import Container from '../components/shared/Container';
import PageHeader from '../components/shared/PageHeader';
import Error from '../components/shared/Error';
import Table from '../components/table/Table';
import TrashIcon from '../components/shared/TrashIcon';
import TableData from '../components/table/TableData';
import { convertDate, filterByName } from '../util/util';
import { Loan as LoanType, Loaner } from '../data.types';
import { Col, Row } from 'react-bootstrap';
import SideBar from '../components/shared/SideBar';
import SideBarItem from '../components/shared/SideBarItem';
import _ from 'lodash';

const Loan = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [loaners, setLoaners] = useState<Loaner[]>([]);
  const [loaner, setLoaner] = useState<Loaner>();
  const [searchResult, setSearchResult] = useState<Loaner[]>([]);

  const headers = ['', 'تاريخ', 'بيان', 'وارد', 'منصرف', 'رصيد'];
  const fetchData = async () => {
    try {
      const res = await sendRequest(`${import.meta.env.VITE_URI}/loan`);
      setLoaners(res);
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
        setSearchResult(filterByName(searchTerm, loaners));
      } else {
        setSearchResult(loaners);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, loaners]);

  const handelDelete = async (data: LoanType) => {
    try {
      clearError();
      const res = await sendRequest(
        `${import.meta.env.VITE_URI}/loan` + `/${loaner?._id}/${data._id}`,
        'DELETE'
      );
      if (res) setLoaner(res);
    } catch (err) {
      console.log(err);
    }
  };

  const onLoanerClick = async (loanerId: string) => {
    try {
      const clickedLoaner = loaners.find(loaner => loaner._id == loanerId);
      setLoaner(clickedLoaner);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {isLoading && <Modal spinner />}
      <Container>
        <PageHeader
          itemName="أسم المستلف "
          itemTitle={loaner?.name || ''}
          secondTitle="الرصيد"
          secondValue={loaner?.balance}
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
        <div className=""></div>
        {error ? (
          <Error>{error}</Error>
        ) : (
          <Row>
            <Col sm={2}>
              <SideBar title="العملاء">
                {searchResult &&
                  searchResult.map(customer => (
                    <SideBarItem
                      key={customer._id}
                      id={customer._id}
                      onClick={onLoanerClick}
                    >
                      {customer.name}
                    </SideBarItem>
                  ))}
              </SideBar>
            </Col>
            <Col>
              <Table headers={headers}>
                {loaner?.data.map(data => {
                  return (
                    <tr key={data._id}>
                      <TrashIcon onClick={() => handelDelete(data)} />
                      <TableData>
                        {data.date && convertDate(data.date)}
                      </TableData>
                      <TableData>{data.statement}</TableData>
                      <TableData>{data.income}</TableData>
                      <TableData>{data.expense}</TableData>
                      <TableData>{data.balance}</TableData>
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

export default Loan;
