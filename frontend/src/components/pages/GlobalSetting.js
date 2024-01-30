import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import Pesee from './tabpages/Pesee';

import { useContext } from 'react';
import { AUTHCONTEXT } from '../context/AuthContext';

export default function GlobalSetting() {
  const {headers, user, permissions} = useContext(AUTHCONTEXT)

  const [value, setValue] = React.useState('pesee');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  
  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            {
              (user.member.is_superuser | permissions.includes('view_global_setting')) ?
              <Tab label="SEUIL DE TOLÉRANCE" value="pesee" /> : null
            }
          </TabList>
        </Box>
        <TabPanel value="pesee">
          {
            (user.member.is_superuser | permissions.includes('view_global_setting')) ?
            <Pesee /> : null
          }
        </TabPanel>
      </TabContext>
    </Box>
  )
  

}
