import * as React from 'react';
import TextField from '@mui/material/TextField';

export default function TextInput({required=false, error=false, id, label, value, callback, readonly=false}) {
  return (
    <TextField
        required = {required}
        error = {error}
        id= {id}
        label= {label}
        defaultValue = {value}
        onChange={(event)=>{callback(event.target.value)}}
        readonly={readonly}
    />
  );
}
