import _ from 'lodash';
import React from 'react';
import { useField } from 'formik';
import { useTranslation } from 'react-i18next';

type FormFieldProps = {
  className?: string;
  id: string;
  name: string;
  label?: string;
  affirm?: boolean | string;
  warn?: boolean;
  showErr?: boolean;
  children: React.ReactNode | ((state: {
    error?: string;
    touched: boolean;
    valid: boolean;
    invalid: boolean;
  }) => React.ReactNode);
};

export const FormField: React.FC<FormFieldProps> = ({
  className,
  id,
  name,
  label = name,
  affirm = false,
  warn = true,
  showErr = true,
  children,
}) => {
  const { t } = useTranslation();
  const [, { error, touched }] = useField(name);
  const valid = affirm && touched && !error;
  const invalid = warn && touched && error;
  return (
    <div
      className={_.compact(['form-group', className]).join(' ')}
    >
      {label && <label htmlFor={id}>{t(label, label)}</label>}
      {_.isFunction(children) ? children({ error, touched, valid: !!valid, invalid: !!invalid }) : children}
      {valid && !!affirm && (
        <div className="valid-feedback">{affirm}</div>
      )}
      {showErr && error && touched && (
        <div className="invalid-feedback d-block">{error}</div>
      )}
    </div>
  );
}