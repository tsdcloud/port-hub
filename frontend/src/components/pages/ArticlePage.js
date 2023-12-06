import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import Article from './tabpages/Article';
import Categorie from './tabpages/Categorie';

export default function ArticlePage() {
  const [value, setValue] = React.useState('cat');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  
  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Catégorie" value="cat" />
            <Tab label="Article" value="article" />
          </TabList>
        </Box>
        <TabPanel value="cat">
          <Categorie />
        </TabPanel>
        <TabPanel value="article">
          <Article />
        </TabPanel>
      </TabContext>
    </Box>
  )
  

}
