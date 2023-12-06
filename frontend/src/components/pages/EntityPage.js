import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import Entity from './tabpages/entity';
import Branch from './tabpages/Branch';
import Service from './tabpages/Service';
import Function from './tabpages/Function';

export default function EntityPage() {
  const [value, setValue] = React.useState('entity');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  
  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Entreprise" value="entity" />
            <Tab label="Branche" value="branch" />
            <Tab label="Service" value="service" />
            <Tab label="Fonction" value="function" />
            <Tab label="Organigramme" value="5" />
          </TabList>
        </Box>
        <TabPanel value="entity">
          <Entity />
        </TabPanel>
        <TabPanel value="branch">
          <Branch />
        </TabPanel>
        <TabPanel value="service">
          <Service />
        </TabPanel>
        <TabPanel value="function">
          <Function />
        </TabPanel>
        <TabPanel value="5">Item Five</TabPanel>
      </TabContext>
    </Box>
  )
  

}
