import { useState } from 'react';
import { FormControl, FormGroup, ListGroup } from 'react-bootstrap';

interface CustomSelectInterface {
  title: string;
  list: any;
  onValueChange: (value: any) => void;
}

const CustomSelect: React.FC<CustomSelectInterface> = ({
  list,
  onValueChange,
  title,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openSelect, setOpenSelect] = useState(false);

  const handelSelectData = (data: any) => {
    if (typeof data === 'string') {
      setSearchTerm(data);
      onValueChange(null);
    } else {
      setSearchTerm(data.name);
      onValueChange(data);
    }
  };

  const setSelectValue = (data: any) => {
    handelSelectData(data);
    setOpenSelect(false);
  };

  return (
    <FormGroup
      className="w-100 position-relative"
      onClick={e => e.stopPropagation()}
    >
      <FormControl
        type="text"
        value={searchTerm}
        onChange={e => handelSelectData(e.target.value)}
        className="mb-3 w-100"
        placeholder={title}
        onFocus={() => setOpenSelect(true)}
        onBlur={() => setTimeout(() => setOpenSelect(false), 300)}
      />
      <ListGroup
        className={`w-100 custom-list custom-select ${
          openSelect ? 'show-select' : ''
        }`}
      >
        {list &&
          list
            .filter((data: any) => data.name.includes(searchTerm))
            .map((data: any) => (
              <ListGroup.Item
                onClick={() => setSelectValue(data)}
                className="custom-item"
                key={data._id}
              >
                {data.name}
              </ListGroup.Item>
            ))}
      </ListGroup>
    </FormGroup>
  );
};

export default CustomSelect;
