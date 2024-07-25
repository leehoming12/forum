import _ from 'lodash';
import React from 'react';
import { useList } from '../../utils/context';
import { useTranslation } from 'react-i18next';
import { Form } from 'react-bootstrap';

type ListPageLimitProps = {
  className?: string;
  limits?: number[];
};

export const ListPageLimit: React.FC<ListPageLimitProps> = ({
  className,
  limits = [20, 40, 60],
}) => {

  const { options, setOptions } = useList();
  const { t } = useTranslation();

  React.useEffect(() => {
    if (!options.limit) {
      setOptions(o => ({ ...o, limit: _.first(limits), skip: 0 }));
    }
  }, [options]);

  return (
    <Form.Select
      className={className}
      value={options.limit}
      onChange={(e) => {
        const { value } = e.target;
        setOptions(o => ({ ...o, limit: parseInt(value, 10), skip: 0 }));
      }}
    >
      {limits.map((l) => (
        <option value={l} key={l}>
          {t('perPage', { page: l })}
        </option>
      ))}
    </Form.Select>
  );
}
