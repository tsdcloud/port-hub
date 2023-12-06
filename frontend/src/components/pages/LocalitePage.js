import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import Country from './tabpages/Country';
import Region from './tabpages/Region';
import Department from './tabpages/Department';
import Commune from './tabpages/Commune';
import Village from './tabpages/Village';

export default function LocalitePage() {
  const [value, setValue] = React.useState('pays');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  
  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Pays" value="pays" />
            <Tab label="Région" value="region" />
            <Tab label="Département" value="departement" />
            <Tab label="Commune" value="commune" />
            <Tab label="Village" value="village" />
          </TabList>
        </Box>
        <TabPanel value="pays">
          <Country />
        </TabPanel>
        <TabPanel value="region">
          <Region />
        </TabPanel>
        <TabPanel value="departement">
          <Department />
        </TabPanel>
        <TabPanel value="commune">
          <Commune />
        </TabPanel>
        <TabPanel value="village">
          <Village />
        </TabPanel>
      </TabContext>
    </Box>
  )
  

}
