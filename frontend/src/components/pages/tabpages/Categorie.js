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



import { useState, useEffect, useContext } from "react";

export default function Categorie() {
    const {headers} = useContext(AUTHCONTEXT)
    const {
        categories,setCategories,
    } = useContext(AUTHCONTEXT)
    
    // columns d'entête
    var columns = [
        {
            id: 'id',
            label: 'ID',
        },
        {
            id: 'name',
            label: 'Nom',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
    ]

    // lignes du tableau
    var rows = categories

    const [action, setAction] = useState("create")
    const addCategorie = ()=>{
        setForm(true)
        setAction("create")
    }
    const close = ()=>{
        setForm(false)
    }

    const save = async ()=>{
        setLoading(true)
        const params = {
            name: nom,
        }
        const request = new Request(
            "/categorie",
            {
                method : "POST",
                headers : headers,
                body : JSON.stringify(params)
            }
        )
        let response = await fetch(request)
        let data = await response.json()
        setLoading(false)
        if(response.status == 201){
            data.uuid = data.id
            data.id = rows.length + 1
            data.value = data.uuid
            data.key = data.name
            categories.push(data)
            setSeverity("success")
            setMessage("category has been added successfully")
            setOpen(true)
            setCategories(categories)
        }else{
            if(data.hasOwnProperty("name")){
                setErrorNom(true)
                setSeverity("error")
                setMessage(item.label[0])
                setOpen(true) 
            }
        }
    }

    const [isForm, setForm] = useState(false)
    const [loading, setLoading] = useState(false)

    const [nom, setNom] = useState()
    const [errorNom, setErrorNom] = useState(true)
    const onChangeNom = (value)=>{
        if(value.length < 3 | 100 < value.length){
            setErrorNom(true)
        }else{
            setErrorNom(false)
            setNom(value)
        }
    }

    const [open, setOpen] = useState(false)
    const handleClose = ()=>{
        setOpen(false)
    }
    const [message, setMessage] = useState("new category is being added")
    const [severity, setSeverity] = useState("success")

    const disabled = (errorNom) ? true : false
    
    if(isForm){
        return(
        <Box
            component="form"
            sx={{
            '& .MuiTextField-root': { m: 1, width: '40ch' },
            }}
            noValidate
            autoComplete="off"
        >
            <div>
                <TextInput required={true} id='label' error={errorNom} label='Nom de la catégorie' callback={onChangeNom} value={nom} />
            </div>
            <div>
                <Stack direction="row" spacing={3}>
                    {action=="create" ? <SimpleButton label="enregistrer" endIcon={<SendIcon />} color="success" callback={save} size='medium' loading={loading} disabled={disabled} /> : <SimpleButton label="modifier" endIcon={<SendIcon />} color="success" callback={update} size='medium' loading={loading} disabled={disabled} /> }
                    <SimpleButton label="fermer" endIcon={<CancelIcon />} color='primary' callback={close} size='medium' />
                </Stack>
            </div>
            <Toast open={open} message={message} severity={severity} handleClose={handleClose} />
        </Box>
        )
    }else{
        return(
        <>
            <MyTable columns={columns} rows={rows}  action={false} />
            <FloatingActionButton callback={addCategorie} />
        </>
        );
    }
  
}
