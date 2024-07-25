import _ from 'lodash';
import React from 'react';
import { FieldAttributes, useField } from 'formik';
import { FormField } from './Field';
import { FileUploader } from '../file';

type FormFileProps = FieldAttributes<{}> & React.ComponentPropsWithoutRef<typeof FileUploader> & {
  label?: string;
  affirm?: boolean;
  warn?: boolean;
  showErr?: boolean;
}

export const FormFile: React.FC<FormFileProps> = ({
  name,
  id = name,
  className,
  children,
  ...props
}) => {
  const [, { value: _value }, { setValue: _setValue }] = useField(name);
  const value = React.useMemo(() => {
    return _.sortBy(_value, x => x?.get('sort_order'))
  }, [_value])

  const setValue = React.useCallback(async (x: any[]) => {
    for (const [index, item] of x.entries()) {
      item.set('sort_order', index)
    }
    await Promise.all(_.map(x, item => item.save()))
    _setValue(x)
  }, [_setValue])
  return (
    <FormField className={className} id={id} name={name} {...props}>
      <FileUploader id={id} name={name} value={value} onChange={setValue} {...props}>
        {children}
      </FileUploader>
    </FormField>
  );
}