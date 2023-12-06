import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ModeIcon from '@mui/icons-material/Mode';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';

import Logo from '../../utils/Logo';
import MyTable from '../../utils/MyTable';
import FloatingActionButton from '../../utils/FloatingActionButton';
import TextInput from '../../utils/TextInput';
import FichierInput from '../../utils/FichierInput';
import SelectInput from '../../utils/SelectInput';
import SimpleButton from '../../utils/SimpleButton';
import { AUTHCONTEXT } from '../../context/AuthContext';
import Toast from '../../utils/Toast';
import ControlTextInput from '../../utils/ControlTextInput';


import { useState, useEffect, useContext } from "react";

export default function Entity() {
    const {headers} = useContext(AUTHCONTEXT)
    const {
        entities,setEntities,getEntities,
        user, setBranches
    } = useContext(AUTHCONTEXT)

    useEffect(() => {
        if(entities.length == 0){
            getEntities()
        }
    }, [])
    
    // columns d'entête
    var columns = [
        {
            id: 'id',
            label: 'ID',
        },
        {
            id: 'logo',
            label: 'Logo',
            align: 'center',
        },
        {
            id: 'business_name',
            label: 'Raison sociale',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'acronym',
            label: 'Sigle',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'trade_register',
            label: 'Régistre de commerce',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'unique_identifier_number',
            label: 'NIU',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        }
    ]

    // lignes du tableau
    var rows = entities

    var data_regime = [
        {value:1, key:"REGIME DE L'IMPOT LIBERATOIRE"},
        {value:2, key:"REGIME DU SIMPLIE"},
        {value:3, key:"REGIME DU REEL"},
        {value:4, key:"HORS REGIME D'IMPOSITION"}
    ]

    var data_person = [
        {value:1, key:"PERSONNE MORALE"},
        {value:2, key:"PERSONNE PHYSIQUE"},
    ]
    

    const [delete_disabled, setDeleteDisabled] = useState(false)
    const modifierEntitieForm = (selection)=>{
        setSelection(selection)
        setDeleteDisabled(false)
        setMNom(selection.business_name)
        setMSigle(selection.acronym)
        setMNui(selection.unique_identifier_number)
        setMAp(selection.principal_activity)
        setMRc(selection.trade_register)
        setMCdr(selection.tax_reporting_center)
        setMRegime(selection.regime)
        setMPerson(selection.type_person)
        setMLogo(selection.img)
        setForm(3)
    }
    const supprimerEntitieForm = (selection)=>{
        setSelection(selection)
        setDeleteDisabled(true)
        setForm(3)
    }
    const addEntity = ()=>{
        resetForm()
        setForm(2)
    }
    const close = ()=>{
        setForm(1)
    }

    var listMenu = [
        (user.member.is_superuser | user.member.user_permissions.includes('change_entity'))?
            {
                id : "m",
                icon : <ModeIcon />,
                label : "Modifier",
                callback : modifierEntitieForm
            }
        :undefined,
        (user.member.is_superuser | user.member.user_permissions.includes('delete_entity'))?
            {
                id : "d",
                icon : <DeleteIcon />,
                label : "Supprimer",
                callback : supprimerEntitieForm
            }
        :undefined
    ]
    
    
    const onChangeNom = (value)=>{
        if(value.length < 3 | 100 < value.length){
            setErrorNom(true)
            setNomValidity(false)
        }else{
            setErrorNom(false)
            setNomValidity(true)
            setNom(value)
        }
    }

    const onChangeSigle = (value)=>{
        if(value.length < 3 | 20 < value.length){
            setErrorSigle(true)
            setSigleValidity(false)
        }else{
            setErrorSigle(false)
            setSigleValidity(true)
            setSigle(value)
        }
    }

    const onChangeNiu = (value)=>{
        if(value.length != 14){
            setErrorNiu(true)
            setNiuValidity(false)
        }else{
            setErrorNiu(false)
            setNiuValidity(true)
            setNiu(value)
        }
    }

    const onChangeAp = (value)=>{
        if(value.length < 3 | 150 < value.length){
            setErrorAp(true)
            setApValidity(false)
        }else{
            setErrorAp(false)
            setApValidity(true)
            setAp(value)
        }
    }

    const onChangeRegime = (value)=>{
        setRegime(value)
    }

    const onChangePerson = (value)=>{
        setPerson(value)
    }

    const onChangeCdr = (value)=>{
        if(value.length < 3 | 50 < value.length){
            setErrorCdr(true)
            setCdrValidity(false)
        }else{
            setErrorCdr(false)
            setCdrValidity(true)
            setCdr(value)
        }
    }

    const onChangeRc = (value)=>{
        if(value.length != 18){
            setErrorRc(true)
            setRcValidity(false)
        }else{
            setErrorRc(false)
            setRcValidity(true)
            setRc(value)
        }
    }

    const onChangeLogo = (value)=>{
        setErrorLogo(false)
        var reader = new FileReader()
        reader.readAsDataURL(value)
        reader.onload = ()=>{
            var chaine = reader.result.split('base64,')
            setLogo(chaine[1])
            setLogoValidity(true)
        }
    }

    const resetForm = ()=>{
        setNom(" ")
        setNomValidity(false)
        setRc(" ")
        setRcValidity(false)
        setNiu(" ")
        setNiuValidity(false)
        setLogo(undefined)
        setErrorLogo(true)
        setLogoValidity(false)
    }

    const save = async ()=>{
        setLoading(true)
        const params = {
            business_name: nom,
            acronym: sigle,
            unique_identifier_number: niu,
            principal_activity : ap,
            regime: regime,
            tax_reporting_center: cdr,
            trade_register: rc,
            logo: logo,
            type_person: person,
            end: 'entity',
            detail: false,
            terminaison: 'firm',
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
            const params1 = {
                end: 'entity',
                detail: true,
                terminaison: 'firm',
                id: data.id,
                action: 'branchs'
            }
            const request1 = new Request(
                "/api",
                {
                    method : "GET",
                    headers : headers,
                    body : JSON.stringify(params1)
                }
            )
            let response1 = await fetch(request)
            let data1 = await response1.json()
            if(response1.status == 200){
                setBranches(data1)
            }
            data.logo = <Logo width={70} logo={data.logo}/>
            data.uuid = data.id
            data.id = rows.length + 1
            entities.push(data)
            setSeverity("success")
            setMessage("entity has been added successfully")
            setOpen(true)
            setEntities(entities)
            resetForm()
        }else{
            if(data.hasOwnProperty("business_name")){
                setErrorNom(true)
                setSeverity("error")
                setMessage(data.business_name[0])
                setOpen(true) 
            }
            if(data.hasOwnProperty("acronym")){
                setErrorSigle(true)
                setSeverity("error")
                setMessage(data.acronym[0])
                setOpen(true)     
            }
            if(data.hasOwnProperty("unique_identifier_number")){
                setErrorNiu(true)
                setSeverity("error")
                setMessage(data.unique_identifier_number[0])
                setOpen(true)     
            }
            if(data.hasOwnProperty("principal_activity")){
                setErrorAp(true)
                setSeverity("error")
                setMessage(data.principal_activity[0])
                setOpen(true)     
            }
            if(data.hasOwnProperty("tax_reporting_center")){
                setErrorCdr(true)
                setSeverity("error")
                setMessage(data.tax_reporting_center[0])
                setOpen(true)     
            }
            if(data.hasOwnProperty("trade_register")){
                setErrorRc(true)
                setSeverity("error")
                setMessage(data.trade_register[0])
                setOpen(true)     
            }
            if(data.hasOwnProperty("logo")){
                setErrorLogo(true)
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
    const [action, setAction] = useState("create")

    const [nom, setNom] = useState()
    const [errorNom, setErrorNom] = useState(false)
    const [nomValidity, setNomValidity] = useState(false)
    const [sigle, setSigle] = useState()
    const [errorSigle, setErrorSigle] = useState(false)
    const [sigleValidity, setSigleValidity] = useState(false)
    const [niu, setNiu] = useState()
    const [errorNiu, setErrorNiu] = useState(false)
    const [niuValidity, setNiuValidity] = useState(false)
    const [ap, setAp] = useState()
    const [errorAp, setErrorAp] = useState(false)
    const [apValidity, setApValidity] = useState(false)
    const [regime, setRegime] = useState(1)
    const [person, setPerson] = useState(1)
    const [cdr, setCdr] = useState()
    const [errorCdr, setErrorCdr] = useState(false)
    const [cdrValidity, setCdrValidity] = useState(false)
    const [rc, setRc] = useState()
    const [errorRc, setErrorRc] = useState(false)
    const [rcValidity, setRcValidity] = useState(false)
    const [logo, setLogo] = useState()
    const [errorLogo, setErrorLogo] = useState(true)
    const [logoValidity, setLogoValidity] = useState(false)

    const [open, setOpen] = useState(false)
    const handleClose = ()=>{
        setOpen(false)
    }
    const [message, setMessage] = useState("new entity is being added")
    const [severity, setSeverity] = useState("success")

    const disabled = (nomValidity & sigleValidity & niuValidity & apValidity  & cdrValidity & rcValidity & logoValidity & logoValidity) ? false : true


    const [selection, setSelection] = useState({})
    const [m_nom, setMNom] = useState(selection.business_name)
    const [errorMNom, setErrorMNom] = useState(false)
    const onChangeMNonm = (value)=>{
        if(value.length < 3 | 100 < value.length){
            setErrorMNom(true)
        }else{
            setErrorMNom(false)
            setMNom(value)
        }
    }

    const [m_sigle, setMSigle] = useState()
    const [errorMSigle, setErrorMSigle] = useState(false)
    const onChangeMSigle = (value)=>{
        if(value.length < 3 | 20 < value.length){
            setErrorMSigle(true)
        }else{
            setErrorMSigle(false)
            setMSigle(value)
        }
    }

    const [m_nui, setMNui] = useState()
    const [errorMNui, setErrorMNui] = useState(false)
    const onChangeMNui = (value)=>{
        if(value.length != 14){
            setErrorMNui(true)
        }else{
            setErrorMNui(false)
            setMNui(value)
        }
    }

    const [m_ap, setMAp] = useState()
    const [errorMAp, setErrorMAp] = useState(false)
    const onChangeMAp = (value)=>{
        if(value.length < 3 | 150 < value.length){
            setErrorMAp(true)
        }else{
            setErrorMAp(false)
            setMAp(value)
        }
    }

    const [m_regime, setMRegime] = useState()
    const onChangeMRegime = (value)=>{
        setMRegime(value)
    }

    const [m_person, setMPerson] = useState()
    const onChangeMPerson = (value)=>{
        setMPerson(value)
    }

    const [m_cdr, setMCdr] = useState()
    const [errorMCdr, setErrorMCdr] = useState(false)
    const onChangeMCdr = (value)=>{
        if(value.length < 3 | 50 < value.length){
            setErrorMCdr(true)
        }else{
            setErrorCdr(false)
            setMCdr(value)
        }
    }

    const [m_rc, setMRc] = useState()
    const [errorMRc, setErrorMRc] = useState(false)
    const onChangeMRc = (value)=>{
        if(value.length != 18){
            setErrorMRc(true)
        }else{
            setErrorMRc(false)
            setMRc(value)
        }
    }

    const [m_logo, setMLogo] = useState()
    const [errorMLogo, setErrorMLogo] = useState(false)
    const onChangeMLogo = (value)=>{
        setErrorMLogo(false)
        var reader = new FileReader()
        reader.readAsDataURL(value)
        reader.onload = ()=>{
            var chaine = reader.result.split('base64,')
            setMLogo(chaine[1])
        }
    }
    const disabledM = (errorMNom | errorMSigle | errorMNui | errorMAp | errorMCdr | errorMRc | errorMLogo) ? true : false
    const savem = async ()=>{
        setLoading(true)
        const params = {
            business_name: m_nom,
            acronym: m_sigle,
            unique_identifier_number: m_nui,
            principal_activity : m_ap,
            regime: m_regime,
            tax_reporting_center: m_cdr,
            trade_register: m_rc,
            logo: m_logo,
            type_person: m_person,
            end: 'entity',
            detail: true,
            terminaison: 'firm',
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
            data.logo = <Logo width={70} logo={data.logo}/>
            data.uuid = data.id
            data.id = rows.length + 1
            d.push(data)
            entities.forEach(item=>{
                if(item.uuid != data.uuid){
                    d.push(item)
                }
            })
            setSeverity("success")
            setMessage("entity updated")
            setOpen(true)
            setEntities(d)
            resetForm()
        }else{
            if(data.hasOwnProperty("business_name")){
                setErrorNom(true)
                setSeverity("error")
                setMessage(data.business_name[0])
                setOpen(true) 
            }
            if(data.hasOwnProperty("acronym")){
                setErrorSigle(true)
                setSeverity("error")
                setMessage(data.acronym[0])
                setOpen(true)     
            }
            if(data.hasOwnProperty("unique_identifier_number")){
                setErrorNiu(true)
                setSeverity("error")
                setMessage(data.unique_identifier_number[0])
                setOpen(true)     
            }
            if(data.hasOwnProperty("principal_activity")){
                setErrorAp(true)
                setSeverity("error")
                setMessage(data.principal_activity[0])
                setOpen(true)     
            }
            if(data.hasOwnProperty("tax_reporting_center")){
                setErrorCdr(true)
                setSeverity("error")
                setMessage(data.tax_reporting_center[0])
                setOpen(true)     
            }
            if(data.hasOwnProperty("trade_register")){
                setErrorRc(true)
                setSeverity("error")
                setMessage(data.trade_register[0])
                setOpen(true)     
            }
            if(data.hasOwnProperty("logo")){
                setErrorLogo(true)
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
            end: 'entity',
            detail: true,
            terminaison: 'firm',
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
            data.logo = <Logo width={70} logo={data.logo}/>
            data.uuid = data.id
            data.id = rows.length + 1
            d.push(data)
            entities.forEach(item=>{
                if(item.uuid != data.uuid){
                    d.push(item)
                }
            })
            setSeverity("success")
            setMessage("entity updated")
            setOpen(true)
            setEntities(d)
            resetForm()
        }else{
            if(data.hasOwnProperty("business_name")){
                setErrorNom(true)
                setSeverity("error")
                setMessage(data.business_name[0])
                setOpen(true) 
            }
            if(data.hasOwnProperty("acronym")){
                setErrorSigle(true)
                setSeverity("error")
                setMessage(data.acronym[0])
                setOpen(true)     
            }
            if(data.hasOwnProperty("unique_identifier_number")){
                setErrorNiu(true)
                setSeverity("error")
                setMessage(data.unique_identifier_number[0])
                setOpen(true)     
            }
            if(data.hasOwnProperty("principal_activity")){
                setErrorAp(true)
                setSeverity("error")
                setMessage(data.principal_activity[0])
                setOpen(true)     
            }
            if(data.hasOwnProperty("tax_reporting_center")){
                setErrorCdr(true)
                setSeverity("error")
                setMessage(data.tax_reporting_center[0])
                setOpen(true)     
            }
            if(data.hasOwnProperty("trade_register")){
                setErrorRc(true)
                setSeverity("error")
                setMessage(data.trade_register[0])
                setOpen(true)     
            }
            if(data.hasOwnProperty("logo")){
                setErrorLogo(true)
            }
            if(data.hasOwnProperty("non_field_errors")){
                setSeverity("error")
                setMessage(data.non_field_errors[0])
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
                    <ControlTextInput callback={onChangeMNonm}  disabled={delete_disabled} id="business_name" label="Raison sociale" readOnly={false} required={true} type="text" value={selection.business_name} error={errorMNom} />
                    <ControlTextInput callback={onChangeMSigle}  disabled={delete_disabled} id="sigle" label="Sigle" readOnly={false} required={true} type="text" value={selection.acronym} error={errorMSigle} />
                    <ControlTextInput callback={onChangeMNui}  disabled={delete_disabled} id="nui" label="Numéro d'identifiant unique" readOnly={false} required={true} type="text" value={selection.unique_identifier_number} error={errorMNui} />
                </div>
                <div>
                    <ControlTextInput callback={onChangeMAp}  disabled={delete_disabled} id="ap" label="Activité principale" readOnly={false} required={true} type="text" value={selection.principal_activity} error={errorMAp} />
                    <ControlTextInput callback={onChangeMRc}  disabled={delete_disabled} id="rc" label="Numéro du régistre de commerce" readOnly={false} required={true} type="text" value={selection.trade_register} error={errorMRc} />
                    <ControlTextInput callback={onChangeMCdr}  disabled={delete_disabled} id="cdr" label="Centre de rattachement des impôts" readOnly={false} required={true} type="text" value={selection.tax_reporting_center} error={errorMCdr} />
                </div>
                {
                    (delete_disabled) ? undefined : 
                    <div>
                        <SelectInput callback={onChangeMRegime} data={data_regime} id='Regime' defaultValue={selection.regime} label="Régime d'imposition" required={true} />
                        <SelectInput callback={onChangeMPerson} data={data_person} id='person' defaultValue={selection.type_person} label="Type de personne" required={true} />
                        <Stack direction="row" spacing={3}>
                            <FichierInput label="logo" id='logo' error={errorMLogo} callback={onChangeMLogo} required={true} />
                            {errorMLogo ? undefined : <Logo logo={m_logo} width={150} /> }
                        </Stack>
                    </div>
                }
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
                <TextInput required={true} id='rs' error={errorNom} label='Raison sociale' callback={onChangeNom} value={nom} />
                <TextInput required={true} id='sigle' error={errorSigle} label='Sigle' callback={onChangeSigle} value={sigle} />
                <TextInput required={true} id='niu' error={errorNiu} label="Numéro d'itentifiant unique" callback={onChangeNiu} value={niu} />
            </div>
            <div>
                <TextInput required={true} id='ap' error={errorAp} label="Activité principale" callback={onChangeAp} value={ap} />
                <TextInput required={true} id='rc' error={errorRc} label="Numéro du régistre de commerce" callback={onChangeRc} value={rc} />
                <TextInput required={true} id='cdr' error={errorCdr} label="Centre de rattachement des impôts" callback={onChangeCdr} value={cdr} />
            </div>
            <div>
                <SelectInput callback={onChangeRegime} data={data_regime} id='Regime' defaultValue={1} label="régime d'imposition" required={true} />
                <SelectInput callback={onChangePerson} data={data_person} id='person' defaultValue={1} label="Type de personne" required={true} />
                <Stack direction="row" spacing={3}>
                    <FichierInput label="logo" id='logo' error={errorLogo} callback={onChangeLogo} required={true} />
                    {errorLogo ? undefined : <Logo logo={logo} width={150} /> }
                </Stack>
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
            {
                (user.member.is_superuser | user.member.user_permissions.includes('add_entity'))?
                <FloatingActionButton callback={addEntity} /> : undefined
            }
        </>
        );
    }
  
}
