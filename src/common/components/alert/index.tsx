import _ from 'lodash';
import React from 'react';
import Alert from 'react-bootstrap/Alert';
import { useTranslation } from 'react-i18next';

type Alert = {
  id: string;
  variant: string;
  message: string | Error;
  timeout: number;
}

export const AlertContext = React.createContext<(
  variant: string,
  message: string | Error,
  timeout?: number
) => void>(() => void 0);

export const AlertProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children
}) => {

  const { t } = useTranslation();
  const [alerts, setAlerts] = React.useState<Alert[]>([]);

  const remove = React.useCallback((
    id: string,
  ) => {
    setAlerts(x => _.filter(x, i => i.id !== id))
  }, []);

  const show = React.useCallback((
    variant: string,
    message: string | Error,
    timeout: number = 0
  ) => {
    if (message === '') return;
    const id = _.uniqueId();
    setAlerts(x => [...x, { id, variant, message, timeout }]);
    if (timeout > 0) {
      setTimeout(() => remove(id), timeout);
    }
  }, []);

  return (
    <AlertContext.Provider value={show}>
      {children}
      <div
        className='position-fixed d-flex flex-column w-100 mx-auto mt-3 align-items-center'
        style={{
          zIndex: 1090,
          pointerEvents: 'none',
        }}
      >
        {_.map(alerts, ({ id, variant, message: msg }) => (
          <Alert
            key={id}
            variant={variant}
            onClose={() => remove(id)}
            dismissible
            style={{ pointerEvents: 'all' }}
          >{_.isString(msg) ? msg : t(msg.message, msg.message)}</Alert>
        ))}
      </div>
    </AlertContext.Provider>
  );
}
