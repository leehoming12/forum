import React from 'react';

import { useField } from 'formik';
import { Summernote } from '../../summernote';
import { useTranslation } from 'react-i18next';

type FormEditorProps = {
  className?: string;
  name: string;
  label?: string;
  disabled?: boolean;
}

export const FormEditor: React.FC<FormEditorProps> = ({
  className,
  name,
  label = name,
  disabled,
}) => {
  const [, { value }, { setTouched, setValue }] = useField(name);
  const { t } = useTranslation();
  return (
    <div
      className={`form-group ${className ?? ''}`}
    >
      {label && <label>{t(label, label)}</label>}
      {!disabled ? (
        <Summernote
          initialValue={value as any}
          onChange={(v) => setValue(v)}
          onBlur={() => setTouched(true)}
        />
      ) : (
        <div className="form-control">
          <div dangerouslySetInnerHTML={{ __html: value || '&nbsp;' }} />
        </div>
      )}
    </div>
  );
};
