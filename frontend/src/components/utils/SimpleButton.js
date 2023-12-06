import * as React from 'react';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';

export default function SimpleButton({
    variant="contained",
    startIcon,
    endIcon,
    label,
    color="primary",
    callback,
    size="small",
    loadingPosition="end",
    loading = false,
    disabled = false
}) {
  return (
    <Box sx={{ '& > button': { m: 1 } }}>
        <LoadingButton
          size={size}
          onClick={callback}
          startIcon={startIcon}
          endIcon={endIcon}
          loading={loading}
          loadingPosition={loadingPosition}
          variant={variant}
          color={color}
          disabled={disabled}
        >
          <span>{label}</span>
        </LoadingButton>
    </Box>
  );
}