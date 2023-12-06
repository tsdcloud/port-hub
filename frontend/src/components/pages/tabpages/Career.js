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

export default function Career() {
    const {headers} = useContext(AUTHCONTEXT)
    const {
        villages,setVillages,
        careers, setCareers
    } = useContext(AUTHCONTEXT)
    
    // columns d'entête
    var columns = [
        {
            id: 'id',
            label: 'ID',
        },
        {
            id: 'vil',
            label: 'Village',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'name',
            label: "Nom de la carrière",
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'uin',
            label: "Numéro d'identification unique",
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'localisation',
            label: "Localisation",
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'proprio',
            label: "Proprio",
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'status',
            label: "Etat",
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
    ]

    // lignes du tableau
    var rows = careers

    var data_villages = villages

    const [action, setAction] = useState("create")
    const addCareer = ()=>{
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
            village_id: village,
            uin : uin,
            localisation: localisation,
            proprio: proprio
        }
        const request = new Request(
            "/career",
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
            data.vil = data.village.name
            data.option = data.village.id
            data.status = "ACTIVE"
            careers.push(data)
            setSeverity("success")
            setMessage("career has been added successfully")
            setOpen(true)
            setCareers(careers)
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

    const [uin, setUin] = useState()
    const [errorUin, setErrorUin] = useState(true)
    const onChangeUin = (value)=>{
        if(value.length != 13){
            setErrorUin(true)
        }else{
            setErrorUin(false)
            setUin(value)
        }
    }

    const [localisation, setLocalisation] = useState()
    const [errorLocalisation, setErrorLocalisation] = useState(true)
    const onChangeLocalisation = (value)=>{
        if(value.length != 13){
            setErrorLocalisation(true)
        }else{
            setErrorLocalisation(false)
            setLocalisation(value)
        }
    }

    const [proprio, setProprio] = useState()
    const [errorProprio, setErrorProprio] = useState(true)
    const onChangeProprio = (value)=>{
        if(value.length != 13){
            setErrorProprio(true)
        }else{
            setErrorProprio(false)
            setProprio(value)
        }
    }

    const [village, setVillage] = useState()
    const [errorVillage, setErrorVillage] = useState(true)
    const onChangeVillage = (value)=>{
        setVillage(value)
        setErrorVillage(false)
    }

    const [open, setOpen] = useState(false)
    const handleClose = ()=>{
        setOpen(false)
    }
    const [message, setMessage] = useState("new career is being added")
    const [severity, setSeverity] = useState("success")

    const disabled = (errorNom | errorVillage | errorUin | errorLocalisation | errorProprio) ? true : false
    
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
                <TextInput required={true} id='label' error={errorNom} label="Nom de la carrière" callback={onChangeNom} value={nom} />
                <TextInput required={true} id='uin' error={errorUin} label="Numéro d'identifiant unique" callback={onChangeUin} value={uin} />
                <TextInput required={true} id='localisation' error={errorLocalisation} label="Localisation" callback={onChangeLocalisation} value={localisation} />
                <TextInput required={true} id='proprio' error={errorProprio} label="Nom du propriétaire" callback={onChangeProprio} value={proprio} />
                <SelectInput callback={onChangeVillage} data={data_villages} id='village' defaultValue={1} label="Village" required={true} />
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
            <FloatingActionButton callback={addCareer} />
        </>
        );
    }
  
}
