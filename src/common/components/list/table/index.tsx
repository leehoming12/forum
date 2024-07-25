import _ from 'lodash';
import React from 'react';
import { ListColumnInfo } from '../utils/types';
import { ListTableCell } from './cell';
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useList } from '../utils/context';
import { useNavigate } from 'react-router-dom';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

export type ListTableProps<Item> = {
  className?: string;
  rowIndex?: boolean;
  rowLink?: (item: Item, idx: number, list: Item[]) => string;
  defaultSort?: Record<string, 1 | -1>;
  list: Item[];
  columns: ListColumnInfo<Item>[];
};

export const ListTable = <Item extends any>({
  className,
  rowIndex,
  rowLink,
  defaultSort,
  list,
  columns,
}: ListTableProps<Item>) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { options: { skip, sort }, setOptions } = useList();
  const sortBy = Object.keys(sort ?? {});

  React.useEffect(() => {
    if (_.isEmpty(sort) && !_.isEmpty(defaultSort)) {
      setOptions(o => ({ ...o, sort: defaultSort }));
    }
  }, [sort]);

  return (
    <Table className={`table-hover ${className ?? ''}`}>
      <thead>
        <tr>
          {rowIndex && <th></th>}
          {_.map(columns, col => (
            <th
              key={col.name}
              style={col.sortable ? { cursor: 'pointer' } : {}}
              onClick={(e) => {
                if (!col.sortable) return;
                if (e.shiftKey) {
                  const s = sort ? { ...sort } : {};
                  s[col.key] = s[col.key] ? -s[col.key] as any : -1;
                  setOptions(o => ({ ...o, sort: s }));
                } else {
                  setOptions(o => ({
                    ...o,
                    sort: {
                      [col.key]: o.sort?.[col.key] ? -o.sort[col.key] as any : -1,
                    },
                  }));
                }
              }}
            >
              {col.label ?? t(col.name, _.startCase(col.name))}
              {col.sortable && sortBy.includes(col.key) && (
                <span className="ms-1">
                  {sort?.[col.key] === 1 && <FaAngleUp />}
                  {sort?.[col.key] === -1 && <FaAngleDown />}
                </span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {_.map(list, (item, idx) => (
          <tr
            key={idx}
            style={_.isFunction(rowLink) ? { cursor: 'pointer' } : {}}
            onClick={_.isFunction(rowLink) ? () => { navigate(rowLink(item, idx, list)); } : undefined}
          >
            {rowIndex && <td>{idx + 1 + (skip ?? 0)}</td>}
            {_.map(columns, col => (
              <td key={col.name}>
                <ListTableCell list={list} idx={idx} item={item} column={col} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
