import * as React from 'react';
import TextField from '@mui/material/TextField';

export default function ControlTextInput({id, label, type, disabled, required, readOnly, value, error, callback}) {
  return (
        <TextField
          id={id}
          label={label}
          type={type}
          defaultValue={value}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          error={error}
          onChange={(event)=>{callback(event.target.value)}}
          InputLabelProps={{
            shrink: true,
          }}
          variant="standard"
        />
  );
}