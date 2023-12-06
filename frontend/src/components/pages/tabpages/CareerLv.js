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
import ModeIcon from '@mui/icons-material/Mode';
import ControlTextInput from '../../utils/ControlTextInput';


import { useState, useEffect, useContext } from "react";

export default function CareerLv() {
    const {headers} = useContext(AUTHCONTEXT)
    const {
        careerlv,setCareerlv,
        careers, setCareers
    } = useContext(AUTHCONTEXT)
    
    // columns d'entête
    var columns = [
        {
            id: 'id',
            label: 'ID',
        },
        {
            id: 'career',
            label: 'Nom de la carrière',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'available_quantity',
            label: "Quantité restante",
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'available_volume',
            label: "Volume restant",
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'last_demand_quantity',
            label: "Quantité demandée",
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'last_demand_volume',
            label: "Volume demandé",
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'status',
            label: "Etat de la demande",
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
    ]

    // lignes du tableau
    var rows = careerlv

    var data_careers = careers

    const [action, setAction] = useState("create")
    const addCareerlv = ()=>{
        setForm(2)
        setAction("create")
    }
    const close = ()=>{
        setForm(1)
    }

    const save = async ()=>{
        setLoading(true)
        const params = {
            career_id: career,
            last_demand_quantity: quantity,
            last_demand_volume: volume
        }
        const request = new Request(
            "/careerlv",
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
            data.career = data.career.name
            data.status = "EN ATTENTE APPROBATION"
            var d = []
            d.push(data)
            careerlv.forEach(item=>{
                if(item.uuid != data.uuid){
                    d.push(item)
                }
            })
            setSeverity("success")
            setMessage("lv career has been added successfully")
            setOpen(true)
            setCareerlv(d)
        }else{
            // if(data.hasOwnProperty("name")){
            //     setErrorNom(true)
            //     setSeverity("error")
            //     setMessage(item.label[0])
            //     setOpen(true) 
            // }
        }
    }

    const [isForm, setForm] = useState(1)
    const [loading, setLoading] = useState(false)

    const [quantity, setQuantity] = useState()
    const [errorQuantity, setErrorQuantity] = useState(true)
    const onChangeQuantity = (value)=>{
        try{
            if( 0 > parseInt(value)){
                setErrorQuantity(true)
            }else{
                setQuantity(parseInt(value))
                setErrorQuantity(false)
            }
        }catch{
            setErrorQuantity(true)
        }
    }

    const [volume, setVolume] = useState()
    const [errorVolume, setErrorVolume] = useState(true)
    const onChangeVolume = (value)=>{
        try{
            if( 0 > parseFloat(value)){
                setErrorVolume(true)
            }else{
                setVolume(parseFloat(value))
                setErrorVolume(false)
            }
        }catch{
            setErrorVolume(true)
        }
    }

    const [career, setCareer] = useState()
    const [errorCareer, setErrorCareer] = useState(true)
    const onChangeCareer = (value)=>{
        setCareer(value)
        setErrorCareer(false)
    }

    const [open, setOpen] = useState(false)
    const handleClose = ()=>{
        setOpen(false)
    }
    const [message, setMessage] = useState("new lv for career is being added")
    const [severity, setSeverity] = useState("success")

    const disabled = (errorCareer | errorQuantity | errorVolume) ? true : false

    const approveLvForm = (selection)=>{
        setForm(3)
        setUcareerid(selection.uuid)
        setUcareername(selection.career)
        setUavailablequantity(selection.available_quantity)
        setUavailablevolume(selection.available_volume)
        setUdemandquantiy(selection.last_demand_quantity)
        setUdemandvolume(selection.last_demand_volume)
        if(selection.is_waiting_approve){
            setActionApprove(true)
        }else{
            setActionApprove(false)
        }
    }

    var listMenu = [
        {
            id : "m",
            icon : <ModeIcon />,
            label : "Approuver",
            callback : approveLvForm
        },
    ]

    const voidc = ()=>{}
    const [actionApprove, setActionApprove] = useState(false)
    const [ucareerid, setUcareerid] = useState()
    const [ucareername, setUcareername] = useState()
    const [uavailablequantity, setUavailablequantity] = useState()
    const [uavailablevolume, setUavailablevolume] = useState()
    const [udemandquantity, setUdemandquantiy] = useState()
    const [udemandvolume, setUdemandvolume] = useState()
    const [accordVolume, setAccordVolume] = useState()
    const [errorAccordVolume, setErrorAccordVolume] = useState(true)
    const [accordQuantity, setAccordquantity] = useState()
    const [errorAccordQuantity, setErrorAccordquantity] = useState(true)

    const saveApprove = async ()=>{
        setLoading(true)
        var params = {
            id : ucareerid,
            last_approve_quantity: accordQuantity,
            last_approve_volume: accordVolume,
            end: "career",
            detail: true,
            terminaison: "careerlv",
            action: "approve"
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
        if(response.status == 200){
            data.uuid = data.id
            data.id = rows.length + 1
            data.career = data.career.name
            data.status = "RAS"
            var d = []
            d.push(data)
            careerlv.forEach(item=>{
                if(item.uuid != data.uuid){
                    d.push(item)
                }
            })
            setSeverity("success")
            setMessage("lv career has been approved")
            setOpen(true)
            setCareerlv(d)
            setActionApprove(false)
        }
    }

    var change_accordvolume = (event)=>{
        try{
            if( parseFloat(event) > udemandvolume ){
                setErrorAccordVolume(true)
            }else{
                setAccordVolume(event)
                setErrorAccordVolume(false)
            }
        }catch{
            setErrorAccordVolume(true)
        }
    }
    var change_accordquantity = (event)=>{
        try{
            if( parseInt(event) > udemandquantity ){
                setErrorAccordquantity(true)
            }else{
                setAccordquantity(event)
                setErrorAccordquantity(false)
            }
        }catch{
            setErrorAccordquantity(true)
        }
    }

    var udisabled = errorAccordQuantity | errorAccordVolume
    
    if(isForm == 3){
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
                    <ControlTextInput callback={voidc}  disabled={true} id="ucareername" label="Carrière" readOnly={true} required={true} type="text" value={ucareername} />
                    <ControlTextInput callback={voidc}  disabled={true} id="uavailablequantity" label="Quantité restante" readOnly={true} required={true} type="number" value={uavailablequantity} />
                    <ControlTextInput callback={voidc}  disabled={true} id="uavailablevolume" label="Volume restant" readOnly={true} required={true} type="text" value={uavailablevolume} />
                    <ControlTextInput callback={voidc}  disabled={true} id="udemandquantity" label="Quantité demandée" readOnly={true} required={true} type="text" value={udemandquantity} />
                    <ControlTextInput callback={voidc}  disabled={true} id="udemandvolume" label="Volume demandé" readOnly={true} required={true} type="text" value={udemandvolume} />
                    {
                        (actionApprove)?
                            <>
                                <TextInput required={true} id='quantity' error={errorAccordQuantity} label="Quantité Accordée" callback={change_accordquantity} value={accordQuantity} />
                                <TextInput required={true} id='volume' error={errorAccordVolume} label="Volume Accordé" callback={change_accordvolume} value={accordVolume} />
                                <Stack direction="row" spacing={3}>
                                    <SimpleButton label="enregistrer" endIcon={<SendIcon />} color="success" callback={saveApprove} size='medium' loading={loading} disabled={udisabled} /> 
                                    <SimpleButton label="fermer" endIcon={<CancelIcon />} color='primary' callback={close} size='medium' />
                                </Stack>
                            </>
                        :undefined
                    }
                </div>
            </Box>
        )
    }
    else if(isForm == 2){
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
                <TextInput required={true} id='quantity' error={errorQuantity} label="Quantité demandée" callback={onChangeQuantity} value={quantity} />
                <TextInput required={true} id='volume' error={errorVolume} label="Volume demandé" callback={onChangeVolume} value={volume} />
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
            <MyTable columns={columns} rows={rows} listmenu={listMenu} action={true} />
            <FloatingActionButton callback={addCareerlv} />
        </>
        );
    }
  
}
