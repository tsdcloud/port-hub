import * as React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

export default function FloatingActionButton({size='medium', color='primary', icon=<AddIcon />, callback}) {
  return (
    <Box sx={{ '& > :not(style)': { m: 1 } }}>
      <Fab size={size} color={color} aria-label="add" onClick={callback}>
        {icon}
      </Fab>
    </Box>
  );
}
