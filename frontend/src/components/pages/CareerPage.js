import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import Stockage from './tabpages/Stockage';
import Career from './tabpages/Career';
import Depot from './tabpages/Depot';
import StockageLv from './tabpages/StockageLv';
import CareerLv from './tabpages/CareerLv';
import CareerArticle from './tabpages/CareerArticle';
import HubPartner from './tabpages/HubPartner';
import DepotVenteArticle from './tabpages/DepotVenteArticle';

export default function CareerPage() {
  const [value, setValue] = React.useState('stockage');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  
  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="HUB Minier" value="stockage" />
            <Tab label="Carrière" value="career" />
            <Tab label="Dépôt" value="depot" />
            <Tab label="Dépôt de vente" value="hub_partner" />
            <Tab label="LV HUB Minier" value="stockagelv" />
            <Tab label="LV carrière" value="careerlv" />
            <Tab label="Carrière + Produit" value="careerarticle" />
            <Tab label="Dépôt de vente + Produit" value="depotventearticle" />
          </TabList>
        </Box>
        <TabPanel value="stockage">
          <Stockage />
        </TabPanel>
        <TabPanel value="career">
          <Career />
        </TabPanel>
        <TabPanel value="depot">
          <Depot />
        </TabPanel>
        <TabPanel value="hub_partner">
          <HubPartner />
        </TabPanel>
        <TabPanel value="stockagelv">
          <StockageLv />
        </TabPanel>
        <TabPanel value="careerlv">
          <CareerLv />
        </TabPanel>
        <TabPanel value="careerarticle">
          <CareerArticle />
        </TabPanel>
        <TabPanel value="depotventearticle">
          <DepotVenteArticle />
        </TabPanel>
      </TabContext>
    </Box>
  )
  

}
