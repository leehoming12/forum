import _ from 'lodash';
import React from 'react';
import { Field, FieldAttributes } from 'formik';
import { FormField } from './Field';

type FormSelectProps = FieldAttributes<{}> & {
  label?: string;
  innerClassName?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  name,
  id = name,
  className,
  innerClassName,
  children,
  ...props
}) => (
  <FormField className={className} id={id} name={name} {...props}>
    {({ valid, invalid }) => (
      <Field as='select' className={_.compact([
        'form-select',
        !!valid && 'is-valid',
        !!invalid && 'is-invalid',
        innerClassName,
      ]).join(' ')} id={id} name={name} {...props}>
        {children}
      </Field>
    )}
  </FormField>
);