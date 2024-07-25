import _ from 'lodash';
import React from 'react';
import { FormikProps } from 'formik';
import { useAlert } from '../../../hooks/alert';

const firstErrorMsg = (e: any): string | undefined => {
  if (_.isNil(e)) return;
  if (_.isString(e)) return e;
  if (_.isArray(e)) return firstErrorMsg(_.first(e));
  for (const v of _.values(e)) {
    const error = firstErrorMsg(v);
    if (error) return error;
  }
};
export const FormError = ({ isSubmitting, errors, alertTimeout }: FormikProps<any> & {
  alertTimeout?: number;
}) => {

  const showAlert = useAlert();

  React.useEffect(() => {
    const error = firstErrorMsg(errors);
    if (isSubmitting && error) {
      showAlert('danger', error, alertTimeout);
    }
  }, [isSubmitting]);

  return <></>;
};
