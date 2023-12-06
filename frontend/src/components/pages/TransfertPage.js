import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import Article from './tabpages/Article';
import Tractor from './tabpages/Tractor';
import Trailer from './tabpages/Trailer';
import Transfer from './tabpages/Transfer';
import Sale from './tabpages/Sale';

export default function TransfertPage() {
  const [value, setValue] = React.useState('tractor');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  
  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Tracteur" value="tractor" />
            <Tab label="Remorque" value="trailer" />
            <Tab label="Transfert" value="transfer" />
            <Tab label="Vente" value="vente" />
          </TabList>
        </Box>
        <TabPanel value="tractor">
          <Tractor />
        </TabPanel>
        <TabPanel value="trailer">
          <Trailer />
        </TabPanel>
        <TabPanel value="transfer">
          <Transfer />
        </TabPanel>
        <TabPanel value="vente">
          <Sale />
        </TabPanel>
      </TabContext>
    </Box>
  )
  

}
