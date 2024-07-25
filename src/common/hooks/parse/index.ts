import _ from 'lodash';
import React from 'react';
import { ParseContext } from '../../components/parse';

export const useParseDataRefresh = () => React.useContext(ParseContext).refresh;
export const useParseDataReady = () => React.useContext(ParseContext).ready;
export const useParseUser = () => React.useContext(ParseContext).currentUser;
export const _useParseUserRoles = () => React.useContext(ParseContext).userRoles ?? [];
export const useParseUserRoles = () => _.map(_useParseUserRoles(), x => x.get('name') as string);
export const useParseConfig = () => React.useContext(ParseContext).config ?? Parse.Config.current();
