import _ from 'lodash';
import React from 'react';
import { useFormikContext } from 'formik';
import Spinner from 'react-bootstrap/Spinner';

export const FormButton: React.FC<React.ComponentPropsWithoutRef<'button'>> = ({
  type,
  disabled,
  children,
  ...props
}) => {
  const { isSubmitting } = useFormikContext();
  return (
    <button
      type={type}
      disabled={disabled || isSubmitting}
      {...props}
    >
      {children}
      {type === 'submit' && isSubmitting && <>
        {' '}
        <Spinner
          as='span'
          size='sm'
          animation='border'
          role='status'
          aria-hidden='true'
        />
      </>}
    </button>
  );
}