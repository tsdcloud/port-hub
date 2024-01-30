import * as React from 'react';
import { useState, useEffect, useContext } from "react";
import { AUTHCONTEXT } from '../context/AuthContext';

import ControlTextInput from './ControlTextInput';
import AutoSelect from './AutoSelect';
import DateTimeInput from './DateTimeInput';
import Box from '@mui/material/Box';
import SimpleButton from './SimpleButton';
import Toast from './Toast';

import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';


export default function AutoForm({
    end='career',
    detail=0,
    terminaison='depot',
    action='',
    params=[],
    sav, // call this method after save is solved with status
    status=201,
    close,
    verb="POST",
    url="/api"
}) {
    const {headers} = useContext(AUTHCONTEXT)

    const [selection, setSelection] = useState({
        end: end,
        detail: detail,
        terminaison: terminaison,
        action: action,
        disabled: false
    })
    const [disabled, setDisabled] = useState(false)
    const [loading, setLoading] = useState(false)

    const save = async ()=>{
        setLoading(true)
        const request = new Request(
            url,
            {
                method : verb,
                headers : headers,
                body : JSON.stringify(selection)
            }
        )
        let response = await fetch(request)
        let data = await response.json()
        setLoading(false)
        if(response.status == status){
            setSeverity("success")
            setMessage("successfully")
            setOpen(true)
            sav(data)
        }else{
            if(data.hasOwnProperty("non_field_errors")){
                setSeverity("error")
                setMessage(data.non_field_errors[0])
                setOpen(true) 
            }
            params.map(item=>{
                if(data.hasOwnProperty(item.name)){
                    setSeverity("error")
                    setMessage(data[item.name][0])
                    setOpen(true)
                }
            })
        }
    }

    const [open, setOpen] = useState(false)
    const handleClose = ()=>{
        setOpen(false)
    }
    const [message, setMessage] = useState("element is being added")
    const [severity, setSeverity] = useState("success")
    var i=0

  return (
    <Box
        component="form" 
        sx={{
        '& .MuiTextField-root': { m: 1, width: '40ch' },
        }}
        noValidate
        autoComplete="off"
    >

        {
            params.map((item) => {
                i += 1
                
                if(item.type == "select"){

                    var change_select = (event,newValue) => {
                        console.log(newValue)
                        if(item.multiple){
                           var d = []
                           newValue.forEach(item=>{
                            d.push(item.id)
                           })
                           selection[item.name] = d
                           setSelection(selection)
                        }else{
                            setDataChoice[newValue]
                            selection[item.name] = newValue.id
                            setSelection(selection)
                        }
                        console.log(selection)
                    }
                    
                    if(item.multiple == true){
                        selection[item.name] = []
                        var [display_data_choice, setDataChoice] = useState()
                    }else{
                        if(item.data.length > 0){
                            var [display_data_choice, setDataChoice] = useState(item.data[0])
                        }
                        if(item.data.length==1){
                            selection[item.name] = item.data[0].id
                        }
                        if(item.value){
                            selection[item.name] = item.value.id
                            setDataChoice[item.value]
                        }
                    }
                }
                else{
                    var change_value = (value) => {
                        setDataValue(value)
                        item.value = value
                        const re = new RegExp(item.regex);
                        const test = re.test(value)
                        if(test){
                            setDataValue(value)
                            selection[item.name] = value
                            setSelection(selection)
                            setDataError(false)
                        }else{
                            selection[item.name] = null
                            setSelection(selection)
                            setDataError(true)
                        }
                    }
                    var [display_value, setDataValue] = useState(item.value)
                    selection[item.name] = item.value
                    var [display_error, setDataError] = useState(item.error)
                }
                return(
                    <>
                        {
                            (item.type == "select") ?
                                <AutoSelect 
                                    callback={change_select}
                                    label={item.label}
                                    data={item.data}
                                    value={display_data_choice}
                                    multiple={item.multiple}
                                />
                            :
                                <ControlTextInput
                                    callback={change_value} 
                                    disabled={item.disabled} 
                                    id={item.name} 
                                    label={item.label} 
                                    readOnly={item.disabled} 
                                    required={true} 
                                    type={item.type}
                                    value={display_value}
                                    error={display_error}
                                />
                        }
                    </>
                )
            })

        }

        <SimpleButton label="enregistrer" endIcon={<SendIcon />} color="success" callback={save} size='medium' loading={loading} disabled={disabled} />
        <SimpleButton label="fermer" endIcon={<CancelIcon />} color='primary' callback={close} size='medium' />
        <Toast open={open} message={message} severity={severity} handleClose={handleClose} />
    </Box>
  );
}