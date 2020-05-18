import locales from '../i18n/locales.json';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useLocalStorage} from 'react-use';

export default function LanguageSwitcher() {
  const [language, setLanguage] = useLocalStorage('language', 'english');
  const {i18n} = useTranslation();

  useEffect(() => {
    if (i18n) i18n.changeLanguage(language);
  }, [i18n, language]);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="LanguageSwitcher">
      <div
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        {locales[language]}
      </div>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {Object.entries(locales).map(([key, language]) => (
          <MenuItem
            key={key}
            onClick={() => {
              setLanguage(key);
              handleClose();
            }}
          >
            {language}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
