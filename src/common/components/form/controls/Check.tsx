import _ from 'lodash';
import React from 'react';
import { Field, FieldAttributes } from 'formik';
import { FormField } from './Field';

type FormCheckProps = FieldAttributes<{}> & {
  label?: string;
  switch?: boolean;
  innerClassName?: string;
}

export const FormCheck: React.FC<FormCheckProps> = ({
  name,
  id = name,
  className,
  innerClassName,
  switch: isSwitch,
  children,
  ...props
}) => {
  return (
    <FormField className={className} id={id} name={name} {...props}>
      {({ valid, invalid }) => (
        <div className={_.compact([
          'form-check',
          !!isSwitch && 'form-switch',
          !!valid && 'is-valid',
          !!invalid && 'is-invalid',
          innerClassName,
        ]).join(' ')}>
          <Field
            className='form-check-input'
            id={id}
            name={name}
            role={isSwitch ? 'switch' : 'checkbox'}
            type='checkbox'
            {...props}
          />
          {children}
        </div>
      )}
    </FormField>
  );
}