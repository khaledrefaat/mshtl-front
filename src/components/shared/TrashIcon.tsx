import TableData from '..//table/TableData';
import { ReactComponent as TrashSvg } from '../Icons/trash.svg';

interface TrashIcon {
  onClick: () => void;
}

const TrashIcon: React.FC<TrashIcon> = ({ onClick }) => {
  return (
    <TableData>
      <TrashSvg className="trash-icon" onClick={onClick} />
    </TableData>
  );
};

export default TrashIcon;
