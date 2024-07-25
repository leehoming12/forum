import _ from 'lodash';
import React from 'react';
import { Dropdown } from 'react-bootstrap';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { useTranslation } from 'react-i18next';

export const createI18nPicker = (
  locales: { glossary: Record<string, { lng: string; }>; },
  lngs: string[]
) => (props: React.ComponentPropsWithoutRef<typeof DropdownButton>) => {
  const { i18n } = useTranslation();
  return (
    <>
      {lngs.length > 1 && locales.glossary[i18n.language] && (
        <DropdownButton
          title={locales.glossary[i18n.language].lng}
          {...props}
        >
          {_.map(lngs, lng => (
            <Dropdown.Item
              key={lng}
              onClick={() => i18n.changeLanguage(lng)}
            >{locales.glossary[lng].lng}</Dropdown.Item>
          ))}
        </DropdownButton>
      )}
    </>
  );
}

