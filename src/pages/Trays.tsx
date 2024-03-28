import { useEffect, useState } from 'react';
import Container from '../components/shared/Container';
import Error from '../components/shared/Error';
import PageHeader from '../components/shared/PageHeader';
import Table from '../components/table/Table';
import TableData from '../components/table/TableData';
import { Tray } from '../data.types';
import Modal from '../components/shared/Modal';
import { convertDate, filterByName } from '../util/util';
import TrashIcon from '../components/shared/TrashIcon';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sendRequest } from '../util/api';

const Trays = () => {
  const { status, data, error } = useQuery({
    queryKey: ['trays'],
    queryFn: async () => await sendRequest(`${import.meta.env.VITE_URI}/tray`),
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<Tray[]>([]);
  const [traysCount, setTraysCount] = useState<number>(0);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    async mutationFn(url: string) {
      return await sendRequest(url, true);
    },
    async onSuccess(data) {
      const { trays, traysCount } = await data;
      queryClient.invalidateQueries({ queryKey: ['trays', 'customers'] });
      console.log(trays);
      console.log(traysCount);
      setSearchResult(trays);
      setTraysCount(traysCount);
    },
  });

  const headers = [
    '',
    'ملاحظات',
    'التاريخ',
    'عدد الصواني الباقية',
    'عدد الصواني الوردة',
    'عدد الصواني المنصرفة',
    'الأســــــــــــــم',
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (status == 'success') {
        setTraysCount(data.count);
        if (searchTerm.length > 0) {
          setSearchResult(filterByName(searchTerm, data.trays));
        } else {
          setSearchResult(data.trays);
        }
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [searchTerm, data]);

  const handelDelete = async (tray: Tray) => {
    if (tray.customerId && tray.income) {
      await mutation.mutateAsync(
        `${import.meta.env.VITE_URI}/tray/${tray._id}`
      );
    } else if (tray.customerId && tray.transactionId) {
      await mutation.mutateAsync(
        `${import.meta.env.VITE_URI}/customer/item/${tray.customerId}/${
          tray.transactionId
        }`
      );
    }
  };

  return (
    <>
      {status == 'pending' && <Modal spinner />}
      {mutation.isPending && <Modal spinner />}
      <Container>
        <PageHeader
          title="صوانـــــــــــــــــــــي"
          titleValue={traysCount}
          noMargin
        />

        {error || mutation.isError ? (
          <Error>{error.message || mutation.error.message}</Error>
        ) : (
          <>
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
            <Table headers={headers}>
              {searchResult.map(item => {
                return (
                  <tr key={item._id}>
                    <TrashIcon onClick={() => handelDelete(item)} />
                    <TableData>{item.notes}</TableData>
                    <TableData>{item.date && convertDate(item.date)}</TableData>
                    <TableData>{item.left}</TableData>
                    <TableData>{item.income}</TableData>
                    <TableData>{item.expense}</TableData>
                    <TableData>{item.name}</TableData>
                  </tr>
                );
              })}
            </Table>
          </>
        )}
      </Container>
    </>
  );
};

export default Trays;
