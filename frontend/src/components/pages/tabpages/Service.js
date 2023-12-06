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



import { useState, useEffect, useContext } from "react";

export default function Service() {
    const {headers} = useContext(AUTHCONTEXT)
    const {
        entities,user,
        branches, setBranches,
        services, setServices
    } = useContext(AUTHCONTEXT)
    
    // columns d'entête
    var columns = [
        {
            id: 'id',
            label: 'ID',
        },
        {
            id: 'branche',
            label: 'Branche',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'name',
            label: 'Nom du service',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'description',
            label: 'Description',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
    ]

    // lignes du tableau
    var rows = services

    var data_entities = entities

    var data_branches = branches

    const [action, setAction] = useState("create")
    const addBranch = ()=>{
        setForm(2)
        setAction("create")
    }
    const close = ()=>{
        setForm(1)
    }

    const save = async ()=>{
        setLoading(true)
        const params = {
            name: nom,
            branch_id: branch,
            end: 'entity',
            detail: false,
            terminaison: 'service',
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
            data.option = data.branch.id
            data.branche = data.branch.label
            services.push(data)
            setSeverity("success")
            setMessage("service has been added successfully")
            setOpen(true)
            setServices(services)
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

    const [branch, setBranch] = useState()
    const [errorBranch, setErrorBranch] = useState(true)
    const onChangeBranch = (value)=>{
        setBranch(value)
        setErrorBranch(false)
    }

    const [check, setCheck] = useState()
    const [entity, setEntity] = useState()
    const [errorEntity, setErrorEntity] = useState(true)
    const onChangeEntity = (value)=>{
        setEntity(value)
        setCheck(value)
        setErrorEntity(false)
        setErrorBranch(true)
    }

    

    const [open, setOpen] = useState(false)
    const handleClose = ()=>{
        setOpen(false)
    }
    const [message, setMessage] = useState("new service is being added")
    const [severity, setSeverity] = useState("success")

    const disabled = (errorNom | errorBranch | errorEntity) ? true : false

    const modifier = (selection)=>{
        setSelection(selection)
        setForm(3)
        setDeleteDisabled(false)
        setMBranch(selection.branch.id)
        setMNom(selection.name)
    }
    const supprimer = (selection)=>{
        setSelection(selection)
        setForm(3)
        setDeleteDisabled(true)
        setMBranch(selection.branch.id)
    }

    var listMenu = [
        (user.member.is_superuser | user.member.user_permissions.includes('change_service'))?
            {
                id : "m",
                icon : <ModeIcon />,
                label : "Modifier",
                callback : modifier
            }
        :undefined,
        (user.member.is_superuser | user.member.user_permissions.includes('delete_service'))?
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
    const [m_nom, setMNom] = useState()
    const [errorMNom, setErrorMNom] = useState(false)
    const onChangeMNom = (value)=>{
        if(value.length < 3 | 100 < value.length){
            setErrorMNom(true)
        }else{
            setErrorMNom(false)
            setMNom(value)
        }
    }

    const [m_branch, setMBranch] = useState()
    const [errorMBranch, setErrorMBranch] = useState(false)
    const onChangeMBranch = (value)=>{
        setMBranch(value)
        setErrorMBranch(false)
    }
    const disabledM = (errorMNom | errorMBranch) ? true : false
    const savem = async ()=>{
        setLoading(true)
        const params = {
            name: m_nom,
            branch_id: m_branch,
            end: 'entity',
            detail: true,
            terminaison: 'service',
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
            data.option = data.branch.id
            data.branche = data.branch.label
            var d=[]
            d.push(data)
            services.forEach(item=>{
                if(item.uuid!=data.uuid){
                    d.push(item)
                }
            })
            setSeverity("success")
            setMessage("service updated")
            setOpen(true)
            setServices(d)
        }else{
            if(data.hasOwnProperty("name")){
                setErrorNom(true)
                setSeverity("error")
                setMessage(data.label[0])
                setOpen(true) 
            }
        }
    }
    const saved = async ()=>{
        setLoading(true)
        const params = {
            name: m_nom,
            branch_id: m_branch,
            end: 'entity',
            detail: true,
            terminaison: 'service',
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
            data.option = data.branch.id
            data.branche = data.branch.label
            services.push(data)
            setSeverity("success")
            setMessage("service has been added successfully")
            setOpen(true)
            setServices(services)
        }else{
            if(data.hasOwnProperty("name")){
                setErrorNom(true)
                setSeverity("error")
                setMessage(data.label[0])
                setOpen(true) 
            }
        }
    }
    
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
                    <ControlTextInput callback={onChangeMNom}  id="nom" label="Nom du service" readOnly={false} disabled={delete_disabled} required={true} type="text" value={selection.name} error={errorMNom} />
                    <SelectInput 
                        callback={onChangeEntity}
                        data={data_entities.filter(item => {
                            var brs = branches.filter(branch=>{if(branch.uuid==selection.branch.id){return branch}})
                            if(brs.length !=0){
                                if(item.uuid == brs[0].firm.id){
                                    selection.firm = item
                                    return item
                                }
                            }else{
                                selection.firm = {uuid:0}
                                return false
                            }
                        })}
                        id='entity'
                        defaultValue={selection.firm.uuid}
                        label="Entreprise"
                        required={true}
                    />
                    <SelectInput callback={onChangeMBranch} data={data_branches.filter(item=>{if(item.firm.id==selection.firm.uuid){return item}})} id='branch' defaultValue={selection.branch.id} label="Branche" required={true} check={check} />
                </div>
                <div>
                    <Stack direction="row" spacing={3}>
                        {
                            delete_disabled ? 
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
                    <TextInput required={true} id='label' error={errorNom} label='Nom du service' callback={onChangeNom} value={nom} />
                    <SelectInput callback={onChangeEntity} data={data_entities} id='entity' defaultValue={1} label="Entreprise" required={true} />
                    <SelectInput callback={onChangeBranch} data={data_branches} id='branch' defaultValue={1} label="Branche" required={true} check={check} />
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
                <MyTable columns={columns} rows={rows} listmenu={listMenu}  action={true} />
                {
                    (user.member.is_superuser | user.member.user_permissions.includes('add_service'))?
                    <FloatingActionButton callback={addBranch} />:undefined
                }
            </>
        );
    }
  
}
