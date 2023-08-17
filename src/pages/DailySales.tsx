import Container from '../components/shared/Container';
import PageHeader from '../components/shared/PageHeader';
import TableData from '../components/table/TableData';
import { ReactNode, useEffect, useState } from 'react';
import { Table, Nav as NavBootstrap, Navbar } from 'react-bootstrap';
import NewRequest from '../components/DailySales/NewRequest';
import NewDailySales from '../components/DailySales/NewDailySales';
import { DailySale } from '../data.types';
import useHttpClient from '../components/hooks/http-hook';
import Modal from '../components/shared/Modal';
import { convertDate, filterByName, monthList, returnUrl } from '../util/util';
import TrashIcon from '../components/shared/TrashIcon';

interface DailySalesHeaderInterface {
  children?: ReactNode;
}

const DailySalesHeader: React.FC<DailySalesHeaderInterface> = ({
  children,
}) => {
  return (
    <th rowSpan={2} className="text-center table-header align-middle">
      {children && children}
    </th>
  );
};

interface DailySalesInterface {
  toggleNav: () => void;
  printMode: boolean;
}

const DailySales: React.FC<DailySalesInterface> = ({
  toggleNav,
  printMode,
}) => {
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [showNewSupplierModal, setShowNewSupplierModal] = useState(false);
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [showNewFertilizerModal, setShowNewFertilizerModal] = useState(false);
  const [showNewDailySalesModal, setShowNewDailySalesModal] = useState(false);
  const { isLoading, clearError, sendRequest } = useHttpClient();
  const [dailySales, setDailySales] = useState<{
    dailySales: DailySale[];
    organizedDailySales: any;
  }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<DailySale[]>([]);

  const fetchDailySales = async () => {
    try {
      clearError();
      const res = await sendRequest(`${import.meta.env.VITE_URI}/daily-sales`);
      setDailySales(res);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchDailySales();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length > 0) {
        setSearchResult(filterByName(searchTerm, dailySales?.dailySales));
      } else {
        setSearchResult(dailySales?.dailySales || []);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, dailySales]);

  const sendDeleteRequest = async (url: string) => {
    try {
      clearError();
      const newData = await sendRequest(url, 'DELETE');
      if (newData) fetchDailySales();
    } catch (err) {
      console.log(err);
    }
  };

  const handelDeleteRequest = async (dailySale: DailySale) => {
    const noteBook = dailySale.noteBook;
    const url = returnUrl(
      noteBook.name,
      noteBook.subName || null,
      noteBook._id,
      noteBook.transactionId
    );
    try {
      if (url) await sendDeleteRequest(url);
    } catch (err) {
      console.log(err);
    }
  };

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
        <PageHeader noItemTitle title="يوميـــــــــــــات مبيعات" />
        {!printMode && (
          <Navbar className="d-flex justify-content-center">
            <NavBootstrap>
              <NavBootstrap.Item
                className="nav-link"
                onClick={() => setShowNewCustomerModal(true)}
              >
                أضف عميل
              </NavBootstrap.Item>
              <NavBootstrap.Item
                className="nav-link"
                onClick={() => setShowNewSupplierModal(true)}
              >
                أضف مورد
              </NavBootstrap.Item>
              <NavBootstrap.Item
                className="nav-link"
                onClick={() => setShowNewItemModal(true)}
              >
                أضف صنف
              </NavBootstrap.Item>
              <NavBootstrap.Item
                className="nav-link"
                onClick={() => setShowNewFertilizerModal(true)}
              >
                أضف سماد او مبيد
              </NavBootstrap.Item>
              <NavBootstrap.Item
                onClick={() => setShowNewDailySalesModal(true)}
                className="nav-link"
              >
                أضف ألي يوميات المبيعــــــــــات
              </NavBootstrap.Item>
            </NavBootstrap>
          </Navbar>
        )}
        {!printMode && (
          <div className="input-group d-flex justify-content-end">
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
        <Table bordered hover className="table-table mt-5">
          <thead>
            <tr>
              {!printMode && (
                <>
                  <DailySalesHeader />
                </>
              )}
              <DailySalesHeader>ملاحظات</DailySalesHeader>
              <DailySalesHeader>التاريخ</DailySalesHeader>
              <DailySalesHeader>البيان</DailySalesHeader>
              <th className="text-center table-header" colSpan={2}>
                بضــــــــــاعة
              </th>
              <DailySalesHeader>
                الأســـــــــــــــــــــــــــــم
              </DailySalesHeader>
              <th className="text-center table-header" colSpan={3}>
                نقديـــــــــــة
              </th>
            </tr>
            <tr>
              <th className="text-center table-header">منصرف</th>
              <th className="text-center table-header">وارد</th>
              <th className="text-center table-header">منصرف</th>
              <th className="text-center table-header">وارد</th>
              <th className="text-center table-header">رصيد</th>
            </tr>
          </thead>
          <tbody>
            {searchResult &&
              searchResult.map(dailySale => (
                <tr key={dailySale._id}>
                  {!printMode && (
                    <TrashIcon onClick={() => handelDeleteRequest(dailySale)} />
                  )}
                  <TableData>{dailySale.notes}</TableData>
                  <TableData>
                    {dailySale.date && convertDate(dailySale.date)}
                  </TableData>
                  <TableData>{dailySale.statement}</TableData>
                  <TableData>{dailySale?.goods?.expense}</TableData>
                  <TableData>{dailySale?.goods?.income}</TableData>
                  <TableData>{dailySale.name}</TableData>
                  <TableData>{dailySale?.money?.expense}</TableData>
                  <TableData>{dailySale?.money?.income}</TableData>
                  <TableData>{dailySale?.money?.balance}</TableData>
                </tr>
              ))}
          </tbody>
        </Table>
      </Container>
      {!printMode && (
        <div className="side-date--bar">
          <div className="years">
            {dailySales?.organizedDailySales &&
              Object.keys(dailySales?.organizedDailySales).map(year => (
                <div className="side-date--year" key={year}>
                  <h3>{year}</h3>
                  <ul>
                    {Object.keys(dailySales.organizedDailySales[year]).map(
                      month => (
                        <li
                          key={month}
                          onClick={() => {
                            setSearchResult(
                              dailySales.organizedDailySales[year][
                                month
                              ].reverse()
                            );
                          }}
                        >
                          {monthList[month]}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              ))}
          </div>
          <h4
            onClick={() => {
              if (dailySales?.dailySales)
                setSearchResult(dailySales?.dailySales);
            }}
          >
            الكل
          </h4>
        </div>
      )}
      {showNewCustomerModal && (
        <NewRequest
          title="أســــــــــــــــــــــــــــم العميـــــــــــــــــــــــل"
          type="customer"
          hideModal={() => setShowNewCustomerModal(false)}
          url={`${import.meta.env.VITE_URI}/customer`}
          secondTitle=" رقــــــــــــــــــــــم الموبايـــــــــــل"
        />
      )}
      {showNewSupplierModal && (
        <NewRequest
          title="أســــــــــــــــــــــــــــم المــــــــــــــــــــورد"
          errorMsg="عذرا  يجب ان يكون اسم المورد اكثر من 2 حرف"
          hideModal={() => setShowNewSupplierModal(false)}
          url={`${import.meta.env.VITE_URI}/supplier`}
        />
      )}
      {showNewItemModal && (
        <NewRequest
          title="أســــــــــــــــــــــــــــم الصنـــــــــــــــــــــــــــــف"
          errorMsg="عذرا  يجب ان يكون اسم الصنف اكثر من 2 حرف"
          hideModal={() => setShowNewItemModal(false)}
          url={`${import.meta.env.VITE_URI}/item`}
          secondTitle="سعـــــــــــــــــــــر الـــــــــــــــوحدة"
        />
      )}
      {showNewFertilizerModal && (
        <NewRequest
          title="أســــــــــــــــــــــــــــم المبيــــــــــــــــــد او السمـــــــــــــــاد"
          errorMsg="عذرا  يجب ان يكون الأسم اكثر من 2 حرف"
          hideModal={() => setShowNewFertilizerModal(false)}
          url={`${import.meta.env.VITE_URI}/fertilizer`}
          secondTitle="سعـــــــــــــــــــــر الـــــــــــــــوحدة"
        />
      )}
      {showNewDailySalesModal && (
        <NewDailySales
          hideModal={() => setShowNewDailySalesModal(false)}
          fetchData={fetchDailySales}
        />
      )}
    </>
  );
};

export default DailySales;
