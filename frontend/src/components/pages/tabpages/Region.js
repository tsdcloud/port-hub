import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';
import ModeIcon from '@mui/icons-material/Mode';
import DeleteIcon from '@mui/icons-material/Delete';

import MyTable from '../../utils/MyTable';
import FloatingActionButton from '../../utils/FloatingActionButton';
import SimpleButton from '../../utils/SimpleButton';
import { AUTHCONTEXT } from '../../context/AuthContext';
import Toast from '../../utils/Toast';
import ControlTextInput from '../../utils/ControlTextInput';
import AutoSelect from '../../utils/AutoSelect';



import { useState, useEffect, useContext } from "react";

export default function Region() {
    const {headers} = useContext(AUTHCONTEXT)
    const {
        countries, regions, getRegions,
        user, setRegions
    } = useContext(AUTHCONTEXT)

    useEffect(() => {
        if(regions.length == 0){
            getRegions()
        }
        var icountry = 0
        countries.forEach(item=>{
            var d = {label: item.name, uuid: item.uuid, id: item.id}
            dcountries.push(d)
            setDCountries(dcountries)
            if(icountry == 0){
                selection.country_id = dcountries[0].uuid
                setDisplayCountryChoice(dcountries[0])
                setSelection(selection)
                icountry = 1
            }
        })
    }, [])
    
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
        {
            id: 'country_name',
            label: 'Pays',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        }
    ]

    // lignes du tableau
    var rows = regions

    const addRegion = ()=>{
        setForm(2)
        setSelection({
            nom:"",
            country_id:dcountries[0].uuid
        })
        setDisplayCountryChoice(dcountries[0])
        setErrorNom(true)
    }
    const close = ()=>{
        setForm(1)
    }
    const modifier = (selection)=>{
        selection.nom = selection.name
        selection.country_id = selection.country.id
        setSelection(selection)
        setForm(3)
        setDeleteDisabled(false)
        setErrorNom(false)
        setErrorCountry(false)
    }
    const supprimer = (selection)=>{
        selection.nom = selection.name
        selection.country_id = selection.country.id
        setSelection(selection)
        setForm(3)
        setDeleteDisabled(true)
        setErrorNom(false)
        setErrorCountry(false)
    }

    var listMenu = [
        (user.member.is_superuser | user.member.user_permissions.includes('add_location'))?
            {
                id : "m",
                icon : <ModeIcon />,
                label : "Modifier",
                callback : modifier
            }
        :undefined,
        (user.member.is_superuser | user.member.user_permissions.includes('add_location'))?
            {
                id : "d",
                icon : <DeleteIcon />,
                label : "Supprimer",
                callback : supprimer
            }
        :undefined
    ]

    const save = async ()=>{
        setLoading(true)
        const params = {
            country_id:selection.country_id,
            name: selection.nom,
            end: 'entity',
            detail: false,
            terminaison: 'region',
            id:"",
            action: ''
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
            data.id = rows.length + 1
            data.country_name = item.country.name
            regions.push(data)
            setSeverity("success")
            setMessage("region has been added successfully")
            setOpen(true)
            setRegions(regions)
        }else{
            if(data.hasOwnProperty("name")){
                setErrorNom(true)
                setSeverity("error")
                setMessage(data.name[0])
                setOpen(true) 
            }
            if(data.hasOwnProperty("country_id")){
                setErrorCountry(true)
                setSeverity("error")
                setMessage(data.country_id[0])
                setOpen(true) 
            }
            if(data.hasOwnProperty("non_field_errors")){
                setSeverity("error")
                setMessage(data.non_field_errors[0])
                setOpen(true) 
            }
        }
    }
    const savem = async ()=>{
        setLoading(true)
        const params = {
            name: selection.nom,
            end: 'entity',
            detail: true,
            terminaison: 'region',
            id:selection.uuid,
            action: ''
        }
        const request = new Request(
            "/api",
            {
                method : "PUT",
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
            data.country_name = data.country.name
            var d = []
            d.push(data)
            regions.forEach(item=>{
                if(item.uuid != data.uuid){
                    d.push(item)
                }
            })
            setSeverity("success")
            setMessage("region updated")
            setOpen(true)
            setRegions(d)
        }else{
            if(data.hasOwnProperty("name")){
                setErrorNom(true)
                setSeverity("error")
                setMessage(data.name[0])
                setOpen(true) 
            }
            if(data.hasOwnProperty("non_field_errors")){
                setSeverity("error")
                setMessage(data.non_field_errors[0])
                setOpen(true) 
            }
        }
    }
    const saved = async ()=>{
        setLoading(true)
        const params = {
            name: nom,
            end: 'entity',
            detail: true,
            terminaison: 'region',
            id:selection.uuid,
            action: ''
        }
        const request = new Request(
            "/api",
            {
                method : "DELETE",
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
            var d = []
            regions.forEach(item=>{
                if(item.uuid != data.uuid){
                    d.push(item)
                }
            })
            setSeverity("success")
            setMessage("region removed")
            setOpen(true)
            setRegions(d)
        }else{
            if(data.hasOwnProperty("name")){
                setErrorNom(true)
                setSeverity("error")
                setMessage(data.name[0])
                setOpen(true) 
            }
            if(data.hasOwnProperty("non_field_errors")){
                setSeverity("error")
                setMessage(data.non_field_errors[0])
                setOpen(true) 
            }
        }
    }

    const [isForm, setForm] = useState(1)
    const [loading, setLoading] = useState(false)

    const [selection, setSelection] = useState({})
    const [delete_disabled, setDeleteDisabled] = useState(false)

    var [dcountries, setDCountries] = useState([])
    const [display_country_choice, setDisplayCountryChoice] = useState({})
    const [errorCountry, setErrorCountry] = useState(false)
    const onChangeCountry = (value)=>{
        var li = value.target
        var index = li.getAttribute('data-option-index')
        selection.country_id = dcountries[index].uuid
        setDisplayCountryChoice(dcountries[index])
        setSelection(selection)
        setErrorCountry(false)
    }

    const [errorNom, setErrorNom] = useState(true)
    const onChangeNom = (value)=>{
        if(value.length < 3 | 100 < value.length){
            setErrorNom(true)
        }else{
            setErrorNom(false)
            selection.nom = value
            setSelection(selection)
        }
    }

    const [open, setOpen] = useState(false)
    const handleClose = ()=>{
        setOpen(false)
    }
    const [message, setMessage] = useState("new country is being added")
    const [severity, setSeverity] = useState("success")

    const disabled = (errorNom | errorCountry) ? true : false
    
    if(isForm != 1){
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
                    {
                        isForm == 2 ?
                            <AutoSelect callback={onChangeCountry} label='Pays' data={dcountries} value={display_country_choice} />
                        :
                            <ControlTextInput callback={onChangeCountry}  id="pays" label="Nom du pays" readOnly={true} disabled={true} required={true} type="text" value={selection.country.name} error={false} />
                    }
                    <ControlTextInput callback={onChangeNom}  id="nom" label="Nom de la région" readOnly={false} disabled={delete_disabled} required={true} type="text" value={selection.name} error={errorNom} />
                </div>
                <div>
                    <Stack direction="row" spacing={3}>
                        {
                            isForm == 2 ? 
                                <SimpleButton label="enregistrer" endIcon={<SendIcon />} color="success" callback={save} size='medium' loading={loading} disabled={disabled} /> 
                            : isForm == 3 ?
                                <SimpleButton label="modifier" endIcon={<SendIcon />} color="success" callback={savem} size='medium' loading={loading} disabled={disabled} /> 
                            : 
                             <SimpleButton label="supprimer" endIcon={<SendIcon />} color="success" callback={saved} size='medium' loading={loading} disabled={disabled} /> 
                        }
                        <SimpleButton label="fermer" endIcon={<CancelIcon />} color='primary' callback={close} size='medium' />
                    </Stack>
                </div>
                <Toast open={open} message={message} severity={severity} handleClose={handleClose} />
            </Box>
        )
    }else{
        return(
            <>
                <MyTable columns={columns} rows={rows} listmenu={listMenu}  action={true} />
                {
                    (user.member.is_superuser | user.member.user_permissions.includes('add_location'))?
                        <FloatingActionButton callback={addRegion} />: undefined
                }
            </>
        );
    }
  
}
