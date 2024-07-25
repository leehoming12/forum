import _ from 'lodash';
import React from 'react';
import { useList } from '../../utils/context';
import { InputGroup, Form } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

type ListSearchOption = string | { label: string; value: string; };

type ListSearchProps = {
  className?: string;
  options?: ListSearchOption[];
};

export const ListSearch: React.FC<ListSearchProps> = ({
  className,
  options,
}) => {

  const { options: { search, searchBy }, setOptions } = useList();

  return (
    <InputGroup className={className}>
      <span className='input-group-text'><FaSearch /></span>
      {!_.isEmpty(options) && (
        <Form.Select
          style={{ maxWidth: 'fit-content' }}
          value={searchBy}
          onChange={(e) => setOptions(o => ({ ...o, searchBy: e.target.value }))}
        >
          {_.map(options, by => (
            <option
              key={_.isString(by) ? by : by.value}
              value={_.isString(by) ? by : by.value}
            >
              {_.isString(by) ? by : by.label}
            </option>
          ))}
        </Form.Select>
      )}
      <input
        className='form-control'
        type='text'
        value={search ?? ''}
        onChange={(e) => setOptions(o => ({ ...o, search: e.target.value }))}
      />
    </InputGroup>
  );
}
