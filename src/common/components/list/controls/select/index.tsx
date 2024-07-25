import _ from 'lodash';
import React from 'react';
import { useList } from '../../utils/context';
import { Form } from 'react-bootstrap';

type ListSelectOption = string | {
  label: string;
  value: any;
};

type ListSelectProps = {
  className?: string;
  name: string;
  options: ListSelectOption[];
};

const labelOf = (opt: ListSelectOption) => _.isString(opt) ? opt : opt.label;
const valueOf = (opt: ListSelectOption) => _.isString(opt) ? opt : opt.value;

export const ListSelect: React.FC<ListSelectProps> = ({
  className,
  name,
  options: opts,
}) => {

  const { options, setOptions } = useList();

  React.useEffect(() => {
    if (_.isNil(options.filter?.[name])) {
      setOptions(o => ({
        ...o,
        filter: {
          ...o.filter ?? {},
          [name]: valueOf(_.first(opts)!),
        },
      }));
    }
  }, [options]);

  return (
    <Form.Select
      className={className}
      value={`${options.filter?.[name]}`}
      onChange={(e) => {
        const { selectedIndex } = e.target;
        setOptions(o => ({
          ...o,
          filter: {
            ...o.filter ?? {},
            [name]: valueOf(opts[selectedIndex]),
          },
        }));
      }}
    >
      {opts.map((l) => (
        <option value={`${valueOf(l)}`} key={valueOf(l)}>{labelOf(l)}</option>
      ))}
    </Form.Select>
  );
}
