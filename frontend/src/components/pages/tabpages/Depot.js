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



import { useState, useEffect, useContext } from "react";

export default function Depot() {
    const {headers} = useContext(AUTHCONTEXT)
    const {
        depots,setDepots,
        careers
    } = useContext(AUTHCONTEXT)
    
    // columns d'entête
    var columns = [
        {
            id: 'id',
            label: 'ID',
        },
        {
            id: 'numero',
            label: 'Numéro',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'leader',
            label: "Chef de Dépôt",
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'career_name',
            label: "Carrière",
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        }
    ]

    // lignes du tableau
    var rows = depots

    var data_careers = careers

    const addDepot = ()=>{
        setForm(true)
        setAction("create")
    }
    const close = ()=>{
        setForm(false)
    }

    const save = async ()=>{
        setLoading(true)
        const params = {
            career_id: career,
            numero: numero,
            leader : leader,
            end: 'career',
            detail: false,
            terminaison: 'depot',
        }
        const request = new Request(
            "/api",
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
            data.value = data.id
            data.id = rows.length + 1
            data.career_name = data.career.name
            depots.push(data)
            setSeverity("success")
            setMessage("depot has been added successfully")
            setOpen(true)
            setDepots(depots)
        }else{
            if(data.hasOwnProperty("non_field_errors")){
                setErrorNumero(true)
                setSeverity("error")
                setMessage(item.label[0])
                setOpen(true) 
            }
        }
    }

    const [isForm, setForm] = useState(false)
    const [loading, setLoading] = useState(false)

    const [career, setCareer] = useState()
    const [errorCareer, setErrorCareer] = useState(true)
    const onChangeCareer = (value)=>{
        setCareer(value)
        setErrorCareer(false)
    }

    const [numero, setNumero] = useState()
    const [errorNumero, setErrorNumero] = useState(true)
    const onChangeNumero = (value)=>{
        if( 1 > value.length){
            setErrorNumero(true)
        }else{
            setErrorNumero(false)
            setNumero(value)
        }
    }

    const [leader, setLeader] = useState()
    const [errorLeader, setErrorLeader] = useState(true)
    const onChangeLeader = (value)=>{
        if(5 > value.length){
            setErrorLeader(true)
        }else{
            setErrorLeader(false)
            setLeader(value)
        }
    }

    const [open, setOpen] = useState(false)
    const handleClose = ()=>{
        setOpen(false)
    }
    const [message, setMessage] = useState("new depot is being added")
    const [severity, setSeverity] = useState("success")

    const disabled = (errorCareer | errorLeader | errorNumero) ? true : false
    
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
                <SelectInput callback={onChangeCareer} data={data_careers} id='career' defaultValue={1} label="Carrière" required={true} />
                <TextInput required={true} id='numero' error={errorNumero} label="Numéro du dépot" callback={onChangeNumero} value={numero} />
                <TextInput required={true} id='leader' error={errorLeader} label="Nom du chef de dépôt" callback={onChangeLeader} value={leader} />
            </div>
            <div>
                <Stack direction="row" spacing={3}>
                    <SimpleButton label="enregistrer" endIcon={<SendIcon />} color="success" callback={save} size='medium' loading={loading} disabled={disabled} />
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
            <FloatingActionButton callback={addDepot} />
        </>
        );
    }
  
}
