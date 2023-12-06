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



import { useState, useContext } from "react";

export default function Trailer() {
    const {headers} = useContext(AUTHCONTEXT)
    const {
        trailers,setTrailers,
    } = useContext(AUTHCONTEXT)
    
    // columns d'entête
    var columns = [
        {
            id: 'id',
            label: 'ID',
        },
        {
            id: 'registration',
            label: 'Immatriculation',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'serial_number',
            label: "Numéro de Série",
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'empty_volume',
            label: "Volume à vide",
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'brand',
            label: "Marque",
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'model',
            label: "Modèle",
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'status',
            label: "Etat d'occupation",
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        }
    ]

    // lignes du tableau
    var rows = trailers


    const addTrailer = ()=>{
        setForm(2)
    }
    const close = ()=>{
        setForm(1)
    }

    const save = async ()=>{
        setLoading(true)
        const params = {
            registration: registration,
            brand: brand,
            model: model,
            serial_number: serial,
            empty_volume: volume,
            end: 'career',
            detail: false,
            terminaison: 'trailer',
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
            data.status = "FREE"
            trailers.push(data)
            setSeverity("success")
            setMessage("trailer has been added successfully")
            setOpen(true)
            setTrailers(trailers)
        }else{
            if(data.hasOwnProperty("registration")){
                setErrorRegistration(true)
                setSeverity("error")
                setMessage(data.registration[0])
                setOpen(true) 
            }
            if(data.hasOwnProperty("serial")){
                setErrorSerial(true)
                setSeverity("error")
                setMessage(data.serial_number[0])
                setOpen(true) 
            }
            if(data.hasOwnProperty("brand")){
                setErrorBrand(true)
                setSeverity("error")
                setMessage(data.brand[0])
                setOpen(true) 
            }
            if(data.hasOwnProperty("model")){
                setErrorModel(true)
                setSeverity("error")
                setMessage(data.model[0])
                setOpen(true) 
            }
            if(data.hasOwnProperty("empty_volume")){
                setErrorVolume(true)
                setSeverity("error")
                setMessage(data.empty_volume[0])
                setOpen(true) 
            }
        }
    }

    const [isForm, setForm] = useState(1)
    const [loading, setLoading] = useState(false)

    const [registration, setRegistration] = useState()
    const [errorRegistration, setErrorRegistration] = useState(true)
    const onChangeRegistration = (value)=>{
        if( 5 > value.length){
            setErrorRegistration(true)
        }else{
            setErrorRegistration(false)
            setRegistration(value)
        }
    }

    const [serial, setSerial] = useState()
    const [errorSerial, setErrorSerial] = useState(true)
    const onChangeSerial = (value)=>{
        if( 5 > value.length){
            setErrorSerial(true)
        }else{
            setErrorSerial(false)
            setSerial(value)
        }
    }

    const [brand, setBrand] = useState()
    const [errorBrand, setErrorBrand] = useState(true)
    const onChangeBrand = (value)=>{
        if( 3 > value.length){
            setErrorBrand(true)
        }else{
            setErrorBrand(false)
            setBrand(value)
        }
    }

    const [model, setModel] = useState()
    const [errorModel, setErrorModel] = useState(true)
    const onChangeModel = (value)=>{
        if( 3 > value.length){
            setErrorModel(true)
        }else{
            setErrorModel(false)
            setModel(value)
        }
    }

    const [volume, setVolume] = useState()
    const [errorVolume, setErrorVolume] = useState(true)
    const onChangeVolume = (value)=>{
        try{
            if(parseFloat(value)  < 1 ){
                setErrorVolume(true)
            }else{
                setErrorVolume(false)
                setVolume(value)
            }
        }catch{
            setErrorVolume(true)
            console.log('zzzzzzzz')
            console.log(value)
        }
    }


    const [open, setOpen] = useState(false)
    const handleClose = ()=>{
        setOpen(false)
    }
    const [message, setMessage] = useState("new tractor is being added")
    const [severity, setSeverity] = useState("success")

    const disabled = (errorRegistration | errorSerial | errorBrand | errorModel | errorVolume) ? true : false
    
    if(isForm == 2){
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
                <TextInput required={true} id='registration' error={errorRegistration} label="Immatriculation de la remorque" callback={onChangeRegistration} value={registration} />
                <TextInput required={true} id='serial' error={errorSerial} label="Numéro de série" callback={onChangeSerial} value={serial} />
                <TextInput required={true} id='brand' error={errorBrand} label="Marque de la remorque" callback={onChangeBrand} value={brand} />
                <TextInput required={true} id='model' error={errorModel} label="Modèle de la remorque" callback={onChangeModel} value={model} />
                <TextInput required={true} id='volume' error={errorVolume} label="Volume à vide" callback={onChangeVolume} value={volume} />
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
            <FloatingActionButton callback={addTrailer} />
        </>
        );
    }
  
}
