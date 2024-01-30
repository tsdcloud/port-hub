import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';

import MyTable from '../../utils/MyTable';
import FloatingActionButton from '../../utils/FloatingActionButton';
import TextInput from '../../utils/TextInput';
import SimpleButton from '../../utils/SimpleButton';
import { AUTHCONTEXT } from '../../context/AuthContext';
import Toast from '../../utils/Toast';
import SelectInput from '../../utils/SelectInput';
import MenuAction from '../../utils/MenuAction';
import ModeIcon from '@mui/icons-material/Mode';

import AutoForm from '../../utils/AutoForm';



import { useState, useEffect, useContext } from "react";

export default function Pesee() {
    const {headers, user, permissions} = useContext(AUTHCONTEXT)
    const {
        entities,
        global_settings, setGlobalSettings
    } = useContext(AUTHCONTEXT)

    useEffect(() => {
    }, [])

    const [isForm, setForm] = useState(1)

    const columns = [
        { field: 'id', headerName: 'ID' ,width: 150},
        { field: 'tolerence', headerName: 'Tolérence (Kg)' ,width: 150},
        { field: 'line_maritime', headerName: 'Ligne Maritime' ,width: 150},
    ]

    const rows = global_settings
    

    const addGlobalSetting = ()=>{
        setForm(2)
    }
    const close = ()=>{
        setForm(1)
    }

    const params_global_setting_add = [
        {
            label: "Ligne Maritine",
            name: "line_maritine",
            type: "select",
            data: entities
        },
        {
            label: "Tolérence (Kg)",
            name: "tolerence",
            type: "number",
            regex: /^[0-9]{1,}$/,
            disabled: false,
            value: "",
            error: true
        }
    ]

    const sav_global_setting_add = (item) => {
        item.line_maritine = item.line.business_name
        var d = global_settings
        d.push(item)
        setGlobalSettings(d)
    }
    
    if(isForm == 2){
        return(
            <>
                <AutoForm 
                    end="port"
                    terminaison="pesee"
                    action="" 
                    params={params_global_setting_add}
                    verb='POST'
                    url='/api'
                    status={201}
                    close={close}
                    sav={sav_global_setting_add}
                />
            </>
        )
    }else{
        return(
        <>
            {
                (user.member.is_superuser | permissions.includes('add_global_setting')) ?
                <FloatingActionButton callback={addGlobalSetting} /> : null
            }
            <MyTable columns={columns} rows={rows}  action={false} message='Aucune donnée! Cliquer pour ajouter un seuil de tolérance' />
        </>
        );
    }
  
}
