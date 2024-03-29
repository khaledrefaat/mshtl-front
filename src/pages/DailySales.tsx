import Container from '../components/shared/Container';
import PageHeader from '../components/shared/PageHeader';
import TableData from '../components/table/TableData';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { Table, Nav as NavBootstrap, Navbar, Button } from 'react-bootstrap';
import NewRequest from '../components/DailySales/NewRequest';
import NewDailySales from '../components/DailySales/NewDailySales';
import { DailySale } from '../data.types';
import useHttpClient from '../components/hooks/http-hook';
import Modal from '../components/shared/Modal';
import { convertDate, returnUrl } from '../util/util';
import TrashIcon from '../components/shared/TrashIcon';
import Pagination from 'react-bootstrap/Pagination';
import { useReactToPrint } from 'react-to-print';

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
  const [showLoanerModal, setShowLoanerModal] = useState(false);
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [showNewFertilizerModal, setShowNewFertilizerModal] = useState(false);
  const [showNewDailySalesModal, setShowNewDailySalesModal] = useState(false);
  const { isLoading, clearError, sendRequest } = useHttpClient();
  const [dailySales, setDailySales] = useState<{
    dailySales: DailySale[];
    pages: number;
  }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<DailySale[]>([]);
  const [page, setPage] = useState(1);
  const [maxPages, setMaxPages] = useState(1);

  const ref = useRef();

  const fetchDailySales = async page => {
    try {
      clearError();
      const res = await sendRequest(
        `${import.meta.env.VITE_URI}/daily-sales/${page}`
      );
      setDailySales(res);
      setMaxPages(res.pages);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchDailySales(1);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDailySales(page);
    }, 300);
    return () => clearTimeout(timer);
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchTerm.length > 0) {
        const res = await sendRequest(
          `${import.meta.env.VITE_URI}/daily-sales/search/${searchTerm}`
        );
        console.log(res);
        setSearchResult(res.dailySales);
        setMaxPages(res.pages);
      } else {
        setSearchResult(dailySales?.dailySales || []);
        setMaxPages(dailySales?.pages || 1);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, dailySales]);

  const sendDeleteRequest = async (url: string) => {
    try {
      clearError();
      const newData = await sendRequest(url, 'DELETE');
      if (newData) setTimeout(fetchDailySales, 500);
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
      console.log(url);
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

  function calculatePageRange(currentPage, totalPages) {
    // Set the total number of pages to display (including the current page).
    const totalPagesToDisplay = 30;

    // Ensure totalPages is a positive integer.
    totalPages = Math.max(1, Math.floor(totalPages));

    // Calculate the middle point of the range (rounded down).
    const middlePage = Math.min(totalPages, Math.floor(currentPage));

    // Determine the lower and upper bounds of the range.
    let lowerBound = Math.max(
      1,
      middlePage - Math.floor((totalPagesToDisplay - 1) / 2)
    );
    let upperBound = Math.min(lowerBound + totalPagesToDisplay - 1, totalPages);

    // Adjust bounds to fit within total pages (if needed)
    if (upperBound - lowerBound + 1 < totalPagesToDisplay) {
      lowerBound = Math.max(
        1,
        lowerBound - (totalPagesToDisplay - (upperBound - lowerBound + 1))
      );
    }

    return { lowerBound, upperBound };
  }

  function renderPages() {
    const items = [];
    const { lowerBound, upperBound } = calculatePageRange(page, maxPages);

    for (let number = lowerBound; number <= upperBound; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === page}
          onClick={() => setPage(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    return (
      <div className="mb-3">
        <Pagination className="justify-content-center">{items}</Pagination>
      </div>
    );
  }

  const handelPrint = useReactToPrint({
    content: () => ref.current,
  });

  return (
    <>
      {isLoading && <Modal spinner />}
      <Container>
        <>
          <PageHeader noItemTitle title="يوميـــــــــــــات مبيعات" />
          <Navbar className="d-flex justify-content-center">
            <NavBootstrap>
              <NavBootstrap.Item
                className="nav-link"
                onClick={() => setShowLoanerModal(true)}
              >
                أضف مستلف
              </NavBootstrap.Item>
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
        </>
        <div className="input-group d-flex justify-content-between">
          <Button onClick={handelPrint} className="daily-sales-button">
            اطبع
          </Button>
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
        <div ref={ref}>
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
                    {!printMode && dailySale.isConfirmed ? (
                      <TableData></TableData>
                    ) : printMode ? (
                      ''
                    ) : (
                      <TrashIcon
                        onClick={() => handelDeleteRequest(dailySale)}
                      />
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
        </div>
        {!searchTerm && renderPages()}
      </Container>
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
      {showLoanerModal && (
        <NewRequest
          title="أســــــــــــــــــــــــــــم المــــــــــــــــــــستلف"
          errorMsg="عذرا  يجب ان يكون اسم المستلف اكثر من 2 حرف"
          hideModal={() => setShowLoanerModal(false)}
          url={`${import.meta.env.VITE_URI}/loan`}
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
