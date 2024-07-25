import _ from 'lodash';
import React from 'react';
import { Formik, Form as _Form, FormikValues, FormikConfig, FormikProps } from 'formik';
import { useAlert } from '../../hooks/alert';
import { FormError } from './controls/Error';
import { FormButton } from './controls/Button';
import { FormInput } from './controls/Input';
import { FormCheck } from './controls/Check';
import { FormEditor } from './controls/Editor';
import { FormSelect } from './controls/Select';
import { FormFile } from './controls/File';
import { FormDate } from './controls/Date';
import { FormTime } from './controls/Time';
import { FormDateTime } from './controls/DateTime';
import { FormEventListenerContext } from './action';
import { FormRecaptcha } from './controls/Recaptcha';

export const decodeParseObject = (obj: Parse.Object) => {
  const {
    objectId,
    createdAt,
    updatedAt,
    ACL,
    sessionToken,
    ...values
  } = obj.toJSON();
  return values;
}

type NextTickHandlerProps<Values> = {
  values: Values;
  callbacks: ((values: Values) => void)[];
  setCallbacks: React.Dispatch<React.SetStateAction<((values: Values) => void)[]>>;
}
const NextTickHandler = <Values extends FormikValues = FormikValues>({
  values,
  callbacks,
  setCallbacks,
}: NextTickHandlerProps<Values>) => {

  React.useEffect(() => {
    if (_.isEmpty(callbacks)) return;
    for (const callback of callbacks) callback(values);
    setCallbacks(v => _.filter(v, x => _.every(callbacks, c => c !== x)));
  }, [callbacks]);

  return <></>
}

type FormProps<Values extends FormikValues, ExtraProps> = Omit<FormikConfig<Values>, 'onReset' | 'onSubmit'> & ExtraProps & {
  className?: string;
  alertTimeout?: number;
  onReset?: ((values: Values, formik: FormikProps<Values>) => void);
  onSubmit: ((values: Values, formik: FormikProps<Values>) => void);
}

export const Form = _.assign(<Values extends FormikValues = FormikValues, ExtraProps = {}>({
  className,
  alertTimeout = 5000,
  initialValues,
  onReset,
  onSubmit,
  children,
  ...props
}: FormProps<Values, ExtraProps>) => {

  const ref = React.createRef<FormikProps<Values>>();
  const showAlert = useAlert();

  const [listeners, setListeners] = React.useState<{ action: string; callback: () => void; }[]>([]);
  const [nextTick, setNextTick] = React.useState<((values: Values) => void)[]>([]);

  const resetHandler = React.useCallback(async () => {
    try {
      await Promise.all(_.flatMap(listeners, x => x.action === 'reset' ? x.callback() : []));
      setNextTick(v => [...v, async (values) => {
        try {
          if (onReset) await onReset(values, ref.current!);
        } catch (e: any) {
          showAlert('danger', e, alertTimeout);
        }
      }])
    } catch (e: any) {
      showAlert('danger', e, alertTimeout);
    }
  }, [onReset, listeners]);

  const submitHandler = React.useCallback(async () => {
    try {
      await Promise.all(_.flatMap(listeners, x => x.action === 'submit' ? x.callback() : []));
      setNextTick(v => [...v, async (values) => {
        try {
          await onSubmit(values, ref.current!);
        } catch (e: any) {
          showAlert('danger', e, alertTimeout);
        }
      }])
    } catch (e: any) {
      showAlert('danger', e, alertTimeout);
    }
  }, [onSubmit, listeners]);

  const formAction = React.useMemo(() => ({
    addEventListener: (action: string, callback: () => void) => setListeners(v => [...v, { action, callback }]),
    removeEventListener: (action: string, callback: () => void) => setListeners(v => _.filter(v, x => x.action !== action || x.callback !== callback)),
  }), []);

  return (
    <Formik
      initialValues={initialValues instanceof Parse.Object ? decodeParseObject(initialValues) as Values : initialValues}
      onReset={resetHandler}
      onSubmit={submitHandler}
      innerRef={ref}
      {...props}
    >
      {(p) => (
        <FormEventListenerContext.Provider value={formAction}>
          <_Form className={className}>
            <NextTickHandler values={p.values} callbacks={nextTick} setCallbacks={setNextTick} />
            <FormError alertTimeout={alertTimeout} {...p} />
            {_.isFunction(children) ? children(p) : children}
          </_Form>
        </FormEventListenerContext.Provider>
      )}
    </Formik>
  );
}, {
  Button: FormButton,
  Input: FormInput,
  Check: FormCheck,
  Select: FormSelect,
  Switch: (props: React.ComponentPropsWithoutRef<typeof FormCheck>) => (
    <FormCheck switch {...props} />
  ),
  Editor: FormEditor,
  File: FormFile,
  Date: FormDate,
  Time: FormTime,
  DateTime: FormDateTime,
  Recaptcha: FormRecaptcha,
});
