import './Table.css';

type TableHeaderProps = {
  children: React.ReactNode;
};

const TableHeader: React.FC<TableHeaderProps> = ({ children }) => {
  return <th className="text-center table-header">{children}</th>;
};

export default TableHeader;
