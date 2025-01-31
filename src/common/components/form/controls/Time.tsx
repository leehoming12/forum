import _ from 'lodash';
import React from 'react';
import { Field, FieldAttributes, useField } from 'formik';
import { FormField } from './Field';

type FormTimeProps = FieldAttributes<{}> & {
  label?: string;
  affirm?: boolean;
  warn?: boolean;
  showErr?: boolean;
  innerClassName?: string;
}

export const FormTime: React.FC<FormTimeProps> = ({
  name,
  id = name,
  className,
  innerClassName,
  children,
  ...props
}) => {
  const [, { value }, { setTouched, setValue }] = useField(name);
  return (
    <FormField className={className} id={id} name={name} {...props}>
      {({ valid, invalid }) => (
        <Field
          type='time'
          className={_.compact([
            'form-control',
            !!valid && 'is-valid',
            !!invalid && 'is-invalid',
            innerClassName,
          ]).join(' ')}
          id={id}
          name={name}
          value={value ?? ''}
          onChange={(e: any) => {
            const { value } = e.target;
            setValue(value);
          }}
          onBlur={() => setTouched(true)}
          {...props}
        />
      )}
    </FormField>
  );
}