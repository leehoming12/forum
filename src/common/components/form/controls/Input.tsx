import _ from 'lodash';
import React from 'react';
import { Field, FieldAttributes } from 'formik';
import { FormField } from './Field';

type FormInputProps = FieldAttributes<{}> & {
  label?: string;
  affirm?: boolean;
  warn?: boolean;
  showErr?: boolean;
  innerClassName?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  name,
  id = name,
  className,
  innerClassName,
  children,
  ...props
}) => (
  <FormField className={className} id={id} name={name} {...props}>
    {({ valid, invalid }) => (
      <Field className={_.compact([
        'form-control',
        !!valid && 'is-valid',
        !!invalid && 'is-invalid',
        innerClassName,
      ]).join(' ')} id={id} name={name} {...props} />
    )}
  </FormField>
);