import * as React from 'react';
import Box from '@mui/material/Box';

const img = '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'

export default function Logo({logo=img, width=150}) {
  logo = "data:image/*;base64," + logo;
  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <img src={logo} width={width}/>
      </Box>
    </React.Fragment>
  );
}