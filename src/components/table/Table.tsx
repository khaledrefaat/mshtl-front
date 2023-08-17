import './Table.css';
import { Table as BootstrapTable } from 'react-bootstrap';
import TableHeader from './TableHeader';

type TableProps = {
  headers: string[];
  children?: React.ReactNode;
  noMargin?: boolean;
};

const Table: React.FC<TableProps> = ({ headers, children, noMargin }) => {
  return (
    <BootstrapTable
      bordered
      className={`table-table position-relative ${!noMargin && 'mt-5'}`}
    >
      <thead>
        <tr>
          {headers.map(header => (
            <TableHeader key={header}>{header}</TableHeader>
          ))}
        </tr>
        {children}
      </thead>
    </BootstrapTable>
  );
};

export default Table;
