import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';
import ModeIcon from '@mui/icons-material/Mode';
import DeleteIcon from '@mui/icons-material/Delete';

import MyTable from '../../utils/MyTable';
import FloatingActionButton from '../../utils/FloatingActionButton';
import TextInput from '../../utils/TextInput';
import SelectInput from '../../utils/SelectInput';
import SimpleButton from '../../utils/SimpleButton';
import { AUTHCONTEXT } from '../../context/AuthContext';
import Toast from '../../utils/Toast';
import ControlTextInput from '../../utils/ControlTextInput';



import { useState, useContext } from "react";

export default function Function() {
    const {headers} = useContext(AUTHCONTEXT)
    const {
        entities,setEntities,
        branches, setBranches,
        services, user,
        functions, setFunctions
    } = useContext(AUTHCONTEXT)
    
    // columns d'entête
    var columns = [
        {
            id: 'id',
            label: 'ID',
        },
        {
            id: 'servi',
            label: 'Service',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'power',
            label: 'Power',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'name',
            label: 'Nom de la fonction',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
    ]

    // lignes du tableau
    var rows = functions

    var data_entities = entities

    var data_branches = branches

    var data_services = services

    const addFunction = ()=>{
        setForm(2)
    }
    const close = ()=>{
        setForm(1)
    }

    const save = async ()=>{
        setLoading(true)
        const params = {
            name: nom,
            service_id: service,
            power : power,
            description: "aucune",
            end: 'entity',
            detail: false,
            terminaison: 'function',
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
            data.value = data.uuid
            data.key = data.name
            data.option = data.service.id
            data.servi = data.service.name
            functions.push(data)
            setSeverity("success")
            setMessage("function has been added successfully")
            setOpen(true)
            setFunctions(functions)
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
            setNomValidity(false)
        }else{
            setErrorNom(false)
            setNom(value)
        }
    }

    const [power, setPower] = useState(1)
    const [errorPower, setErrorPower] = useState(false)
    const onChangePower = (value)=>{
        try{
            value = parseInt(value,10)
            if(0  < value ){
                setPower(value)
                setErrorPower(false)
            }else{
                setErrorPower(true)
            }
        }catch{
            setErrorPower(true)
        }
    }

    const [service, setService] = useState()
    const [errorService, setErrorService] = useState(true)
    const onChangeService = (value)=>{
        setService(value)
        setErrorService(false)
    }

    const [branch, setBranch] = useState()
    const [errorBranch, setErrorBranch] = useState(true)
    const onChangeBranch = (value)=>{
        setBranch(value)
        setErrorBranch(false)
        setErrorService(true)
    }

    const [entity, setEntity] = useState()
    const [errorEntity, setErrorEntity] = useState(true)
    const onChangeEntity = (value)=>{
        setEntity(value)
        setErrorEntity(false)
        setErrorBranch(true)
    }

    

    const [open, setOpen] = useState(false)
    const handleClose = ()=>{
        setOpen(false)
    }
    const [message, setMessage] = useState("new service is being added")
    const [severity, setSeverity] = useState("success")

    const disabled = (errorNom | errorBranch | errorEntity | errorService | errorPower) ? true : false

    const modifier = (selection)=>{
        setSelection(selection)
        setForm(3)
        setDeleteDisabled(false)
        setMService(selection.service.id)
        setMNom(selection.name)
        setMPower(selection.power)
    }
    const supprimer = (selection)=>{
        setSelection(selection)
        setForm(3)
        setDeleteDisabled(true)
    }

    var listMenu = [
        (user.member.is_superuser | user.member.user_permissions.includes('change_function'))?
            {
                id : "m",
                icon : <ModeIcon />,
                label : "Modifier",
                callback : modifier
            }
        :undefined,
        (user.member.is_superuser | user.member.user_permissions.includes('delete_function'))?
            {
                id : "d",
                icon : <DeleteIcon />,
                label : "Supprimer",
                callback : supprimer
            }
        :undefined
    ]
    const [selection, setSelection] = useState(false)
    const [delete_disabled, setDeleteDisabled] = useState(false)

    const [m_nom, setMNom] = useState(selection.name)
    const [errorMNom, setErrorMNom] = useState(false)
    const onChangeMNom = (value)=>{
        if(value.length < 3 | 100 < value.length){
            setErrorMNom(true)
        }else{
            setErrorMNom(false)
            setMNom(value)
        }
    }

    const [m_power, setMPower] = useState(selection.power)
    const [errorMPower, setErrorMPower] = useState(false)
    const onChangeMPower = (value)=>{
        try{
            value = parseInt(value,10)
            if(0  < value ){
                setMPower(value)
                setErrorMPower(false)
            }else{
                setErrorMPower(true)
            }
        }catch{
            setErrorMPower(true)
        }
    }
    const [m_branch, setMBranch] = useState()
    const [errorMBranch, setErrorMBranch] = useState(false)
    const onChangeMBranch = (value)=>{
        setMBranch(value)
        setErrorMBranch(false)
        setErrorMService(true)
    }

    const [m_service, setMService] = useState()
    const [errorMService, setErrorMService] = useState(false)
    const onChangeMService = (value)=>{
        setMService(value)
        setErrorMService(false)
    }
    const disabledM = (errorMNom | errorMPower | errorMBranch | errorMService) ? true : false
    const savem = async ()=>{
        setLoading(true)
        const params = {
            name: m_nom,
            service_id: m_service,
            power : m_power,
            description: "acune",
            end: 'entity',
            detail: true,
            terminaison: 'function',
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
            data.value = data.uuid
            data.key = data.name
            data.option = data.service.id
            data.servi = data.service.name
            functions.push(data)
            setSeverity("success")
            setMessage("function updated")
            setOpen(true)
            setFunctions(functions)
        }else{
            if(data.hasOwnProperty("name")){
                setErrorNom(true)
                setSeverity("error")
                setMessage(item.label[0])
                setOpen(true) 
            }
        }
    }
    const saved = async ()=>{
        setLoading(true)
        const params = {
            name: m_nom,
            service_id: m_service,
            power : m_power,
            end: 'entity',
            detail: true,
            terminaison: 'function',
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
        if(response.status == 200){
            data.uuid = data.id
            data.id = rows.length + 1
            data.value = data.uuid
            data.key = data.name
            data.option = data.service.id
            data.servi = data.service.name
            functions.push(data)
            setSeverity("success")
            setMessage("function updated")
            setOpen(true)
            setFunctions(functions)
        }else{
            if(data.hasOwnProperty("name")){
                setErrorNom(true)
                setSeverity("error")
                setMessage(item.label[0])
                setOpen(true) 
            }
        }
    }
    
    if( isForm == 3){
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
                    <ControlTextInput callback={onChangeMNom}  id="nom" label="Nom de la fonction" readOnly={false} disabled={delete_disabled} required={true} type="text" value={selection.name} error={errorMNom} />
                    <ControlTextInput callback={onChangeMPower}  id="power" label="Power" readOnly={false} disabled={delete_disabled} required={true} type="text" value={selection.power} error={errorMPower} />
                    <SelectInput
                        callback={onChangeEntity}
                        data={data_entities.filter(item=>{
                            var servs = services.filter(service=>{
                                if(service.uuid == selection.service.id){
                                    return service
                                }
                            })
                            var bran = branches.filter(branch=>{
                                if(branch.uuid == servs[0].branch.id){
                                    selection.bran = bran;
                                    return branch
                                }
                            })
                            if(item.uuid == bran[0].firm.id){
                                selection.firm = item
                                return item
                            }
                        })} id='entity' defaultValue={selection.firm.uuid} label="Entreprise" required={true} />
                    <SelectInput 
                        callback={onChangeMBranch} 
                        data={data_branches.filter(item=>{
                            var servs = services.filter(service=>{
                                if(service.uuid == selection.service.id){
                                    return service
                                }
                            })
                            if(item.firm.id == selection.firm.uuid){
                                if(item.uuid == servs[0].branch.id){
                                    selection.b = item
                                }
                                return item
                            }
                        })} id='branch' defaultValue={selection.b.uuid} label="Branche" required={true} check={entity} />
                    <SelectInput 
                        callback={onChangeMService} 
                        data={data_services.filter(item=>{
                            if(item.uuid == selection.service.id){
                                return item
                            }
                        })} id='service' defaultValue={selection.service.id} label="Service" required={true} check={branch} />
                </div>
                <div>
                    <Stack direction="row" spacing={3}>
                        {
                            (delete_disabled)?
                                <SimpleButton label="supprimer" endIcon={<SendIcon />} color="success" callback={saved} size='medium' loading={loading} disabled={disabledM} /> 
                            : 
                                <SimpleButton label="modifier" endIcon={<SendIcon />} color="success" callback={savem} size='medium' loading={loading} disabled={disabledM} />
                        }
                        <SimpleButton label="fermer" endIcon={<CancelIcon />} color='primary' callback={close} size='medium' />
                    </Stack>
                </div>
                <Toast open={open} message={message} severity={severity} handleClose={handleClose} />
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
                    <TextInput required={true} id='label' error={errorNom} label='Nom de la fonction' callback={onChangeNom} value={nom} />
                    <TextInput required={true} id='power' error={errorPower} label='Power' callback={onChangePower} value={power} />
                    <SelectInput callback={onChangeEntity} data={data_entities} id='entity' defaultValue={1} label="Entreprise" required={true} />
                    <SelectInput callback={onChangeBranch} data={data_branches} id='branch' defaultValue={1} label="Branche" required={true} check={entity} />
                    <SelectInput callback={onChangeService} data={data_services} id='service' defaultValue={1} label="Service" required={true} check={branch} />
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
            <MyTable columns={columns} rows={rows} listmenu={listMenu} action={true} />
            {
                (user.member.is_superuser | user.member.user_permissions.includes('add_function'))?
                <FloatingActionButton callback={addFunction} />:undefined
            }
        </>
        );
    }
  
}
