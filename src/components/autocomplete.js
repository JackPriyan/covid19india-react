import {STATE_CODES_ARRAY, STATE_CODES_REVERSE} from '../constants';

import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Bloodhound from 'corejs-typeahead';
import React from 'react';
import {useState, useCallback} from 'react';
import {useTranslation} from 'react-i18next';

const engine = new Bloodhound({
  initialize: true,
  local: STATE_CODES_ARRAY,
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
});

const districtEngine = new Bloodhound({
  initialize: true,
  limit: 5,
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('district'),
  indexRemote: true,
  remote: {
    url: 'https://api.covid19india.org/state_district_wise.json',
    transform: function (response) {
      const districts = [];
      Object.keys(response).map((stateName) => {
        const districtData = response[stateName].districtData;
        Object.keys(districtData).map((districtName) => {
          return districts.push({district: districtName, state: stateName});
        });
        return null;
      });
      return districts;
    },
  },
});

const essentialsEngine = new Bloodhound({
  initialize: true,
  limit: 5,
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace(
    'category',
    'city',
    'contact',
    'descriptionandorserviceprovided',
    'nameoftheorganisation',
    'state'
  ),
  indexRemote: true,
  remote: {
    url: 'https://api.covid19india.org/resources/resources.json',
    transform: function (response) {
      return response.resources;
    },
  },
});

const useStyles = makeStyles((theme) => ({
  overrides: {
    MuiInputBase: {
      root: {
        color: '#ffffff',
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
          width: '100%',
        },
      },
    },
  },
  inputRoot: {
    color: '#ffffff',
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '100%',
    },
  },
  inputInput: {},
  MuiAutocomplete: {
    input: {
      color: '#ffffff',
    },
  },
  underline: {
    '&&&:before': {
      borderBottom: 'none',
    },
    '&&:after': {
      borderBottom: 'none',
    },
  },
}));
export default function ComboBox() {
  const classes = useStyles();
  const {t} = useTranslation();
  const [setValue] = useState(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);

  const handleSearch = useCallback((searchInput) => {
    console.log('Testing search => ', searchInput);
    const results = [];

    const sync = (datums) => {
      datums.map((result, index) => {
        const stateObj = {
          name: result.name,
          type: 'state',
          route: result.code,
        };
        results.push(stateObj);
        return null;
      });
    };

    const districtSync = (datums) => {
      datums.slice(0, 3).map((result, index) => {
        const districtObj = {
          name: result.district,
          type: 'district',
          route: STATE_CODES_REVERSE[result.state],
        };
        results.push(districtObj);

        return null;
      });
    };

    const essentialsSync = (datums) => {
      datums.slice(0, 5).map((result, index) => {
        const essentialsObj = {
          name: result.nameoftheorganisation,
          type: 'essentials',
          category: result.category,
          website: result.contact,
          description: result.descriptionandorserviceprovided,
          city: result.city,
          state: result.state,
          contact: result.phonenumber,
        };
        results.push(essentialsObj);
        console.log('Results => ', results);
        return null;
      });
      setOptions([...results]);
    };

    engine.search(searchInput, sync);
    districtEngine.search(searchInput, districtSync);
    essentialsEngine.search(searchInput, essentialsSync);
  }, []);

  React.useEffect(() => {
    if (inputValue === '') {
      const suggestions = [
        {name: t('Testing Pune')},
        {name: t('Delhi Shelter')},
        {name: t('Community Kitchen in Kerala')},
        {name: t('Groceries Chennai')},
        {name: t('Senior citizen support bangalore')},
        {name: t('Delhi Shelter')},
        {name: t('Community Kitchen in Kerala')},
        {name: t('Delhi Shelter')},
      ];
      setOptions(suggestions);
      return undefined;
    }
    handleSearch(inputValue);
    // setOptions(suggestions2);
    return undefined;
  }, [inputValue, handleSearch, t]);

  return (
    <Autocomplete
      id="combo-box-demo"
      options={options}
      getOptionLabel={(option) => option.name}
      onChange={(event, newValue) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      style={{width: 300}}
      renderInput={(params) => (
        <TextField
          classes={{
            root: classes.inputRoot,
          }}
          InputProps={{disableUnderline: true}}
          {...params}
          placeholder="Search your city, resources, etc"
          variant="standard"
        />
      )}
    />
  );
}
