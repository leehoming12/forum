import _ from 'lodash';
import React from 'react';
import { AlertContext } from '../../components/alert';

export const useAlert = () => React.useContext(AlertContext);