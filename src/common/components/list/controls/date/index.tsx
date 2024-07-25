import _ from 'lodash';
import React from 'react';
import { useList } from '../../utils/context';
import { Form, InputGroup } from 'react-bootstrap';
import { FaArrowRight } from 'react-icons/fa';
import { DateTime as dt } from 'luxon';

type ListDateProps = {
  className?: string;
  name: string;
  range?: boolean;
};

export const ListDate: React.FC<ListDateProps> = ({
  className,
  name,
  range = false,
}) => {

  const { options, setOptions } = useList();

  return (
    <InputGroup className={className}>
      {!range ? (
        <Form.Control
          type='date'
          value={`${options.filter?.[name]}`}
          onChange={({ target: { value: val } }) => {
            const date = dt.fromISO(val);
            setOptions(o => ({
              ...o,
              filter: {
                ...o.filter ?? {},
                [name]: date.isValid ? val : '',
              },
            }));
          }}
        />
      ) : (
          <>
            <Form.Control
              type='date'
              value={`${options.filter?.[name]?.from}`}
              onChange={({ target: { value: val } }) => {
                const date = dt.fromISO(val);
                setOptions(o => ({
                  ...o,
                  filter: {
                    ...o.filter ?? {},
                    [name]: {
                      from: date.isValid ? val : '',
                      to: date.isValid && val <= o.filter?.[name]?.to ? o.filter?.[name]?.to : '',
                    },
                  },
                }));
              }}
            />
            <span className='input-group-text px-0'>
              <FaArrowRight />
            </span>
            <Form.Control
              type='date'
              value={`${options.filter?.[name]?.to}`}
              onChange={({ target: { value: val } }) => {
                const date = dt.fromISO(val);
                setOptions(o => ({
                  ...o,
                  filter: {
                    ...o.filter ?? {},
                    [name]: {
                      from: date.isValid && val >= o.filter?.[name]?.from ? o.filter?.[name]?.from : '',
                      to: date.isValid ? val : '',
                    },
                  },
                }));
              }}
            />
          </>
      )}
    </InputGroup>
  );
}
