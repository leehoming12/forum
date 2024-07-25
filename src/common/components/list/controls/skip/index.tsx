import _ from 'lodash';
import React from 'react';
import { useList } from '../../utils/context';
import { InputGroup, Button } from 'react-bootstrap';

type ListPaginationProps = {
  className?: string;
};

export const ListPagination: React.FC<ListPaginationProps> = ({
  className,
}) => {

  const { options: { skip, limit }, setOptions, totalCount } = useList();

  const [input, setInput] = React.useState<string>();
  const current = !_.isNil(skip) && limit ? Math.round(skip / limit) + 1 : 1;
  const totalPage = Math.max(1, Math.ceil(totalCount / (limit ?? 1)));

  const to = (page: number) => {
    if (limit && page > 0 && page <= totalCount) {
      setOptions(o => ({ ...o, skip: limit * (page - 1) }));
    }
  };

  return (
    <InputGroup className={className}>

      <Button
        variant='outline-secondary border'
        aria-label='Previous'
        disabled={!totalCount || current === 1}
        onClick={() => to(current - 1)}
      >
        &lt;
      </Button>

      <input
        className='form-control border-end-0'
        type='text'
        inputMode='numeric'
        pattern='\d*'
        size={2}
        value={input ?? current}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        onBlur={(e) => {
          setInput(undefined);
          to(parseInt(e.target.value, 10));
        }}
      />

      <span className='input-group-text bg-transparent ps-0'>/ {totalPage}</span>

      <Button
        variant='outline-secondary border'
        aria-label='Next'
        disabled={!totalCount || current === totalPage}
        onClick={() => to(current + 1)}
      >
        &gt;
      </Button>
    </InputGroup>
  );
}
