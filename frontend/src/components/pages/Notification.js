import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import PeseeLine from './tabpages/PeseeLine';
import PeseeNotificationAccount from './tabpages/PeseeNotificationAccount';

import { useContext } from 'react';
import { AUTHCONTEXT } from '../context/AuthContext';

export default function Notification() {
  const [value, setValue] = React.useState('account');

  const {user, permissions} = useContext(AUTHCONTEXT)

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  
  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            {
              (user.member.is_superuser | permissions.includes('view_pesee_notification_account')) ?
              <Tab label="Emails de notification" value="account" /> : null
            }
            {
              (user.member.is_superuser | permissions.includes('view_notification')) ?
              <Tab label="Notification" value="notification" /> : null
            }
          </TabList>
        </Box>
        <TabPanel value="account">
          {
            (user.member.is_superuser | permissions.includes('view_pesee_notification_account')) ?
             <PeseeNotificationAccount /> : null
          }
        </TabPanel>
        <TabPanel value="line">
          {
            (user.member.is_superuser | permissions.includes('view_declare_container')) ?
            <PeseeLine /> : null 
          }
        </TabPanel>
      </TabContext>
    </Box>
  )
  

}
