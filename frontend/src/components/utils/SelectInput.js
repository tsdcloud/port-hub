import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { useState } from "react";
export default function SelectInput({
  label="gender",
   id="demo",
   required=false,
   data=[{value:1,key:"perso"}],
   defaultValue="demo",
   check=false,
   callback}) {

  const [val, setVal] = useState(defaultValue)

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="demo-simple-select-autowidth-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-autowidth-label"
        id={id}
        value={val}
        onChange={(event)=>{callback(event.target.value);setVal(event.target.value)}}
        autoWidth
        label={label}
        required = {required}
      >
        {
          data.map(item=>{
            if(check == false){
              return(
                <MenuItem key={item.value} value={item.value}>{item.key}</MenuItem>
              );
            }else{
              if(item.option == check){
                return(
                  <MenuItem key={item.value} value={item.value}>{item.key}</MenuItem>
                );
              }
            }
          })
        }
      </Select>
    </FormControl>
  );
}
