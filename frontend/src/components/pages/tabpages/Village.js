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

export default function Village() {
    const {headers} = useContext(AUTHCONTEXT)
    const {
        countries, regions, departments, villages,
        user, communes, setVillages, getVillages
    } = useContext(AUTHCONTEXT)

    useEffect(() => {
        if(communes.length == 0){
            getVillages()
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
        var iregion = 0
        regions.forEach(item=>{
            var d = {label: item.name, uuid: item.uuid, id: item.id}
            if(item.country.id == selection.country_id){
               dregions.push(d)
               setDRegions(dregions)
               if(iregion == 0){
                selection.region_id = dregions[0].uuid
                setDisplayRegionChoice(dregions[0])
                setSelection(selection)
                iregion = 1
               }
            }else if (dregions.length == 0){
                selection.region_id = ""
                setDisplayRegionChoice({label:""})
                setDRegions([])
                setSelection(selection)
            }
        })
        var idepartment = 0
        departments.forEach(item=>{
            var d = {label: item.name, uuid: item.uuid, id: item.id}
            if(item.region.id == selection.region_id){
                ddepartments.push(d)
                setDDepartments(ddepartments)
                if(idepartment == 0){
                    selection.departement_id = ddepartments[0].uuid
                    setDisplayDepartmentChoice(ddepartments[0])
                    setSelection(selection)
                    idepartment = 1
                }
            }else if (ddepartments.length == 0){
                selection.department_id = ""
                setDisplayDepartmentChoice(null)
                setDDepartments([])
                setSelection(selection)
            }
        })
        var icommune = 0
        communes.forEach(item=>{
            var d = {label: item.name, uuid: item.uuid, id: item.id}
            if(item.department.id == selection.departement_id){
                dcommunes.push(d)
                setDCommunes(dcommunes)
                if(icommune == 0){
                    selection.commune_id = dcommunes[0].uuid
                    setDisplayCommuneChoice(dcommunes[0])
                    setSelection(selection)
                    icommune = 1
                }
            }else if (dcommunes.length == 0){
                selection.commune_id = ""
                setDisplayCommuneChoice(null)
                setDCommunes([])
                setSelection(selection)
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
            id: 'municipality_name',
            label: 'Commune',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
    ]

    // lignes du tableau
    var rows = villages

    const addCommune = ()=>{
        setForm(2)
        setSelection({
            nom:"",
            country_id:dcountries[0].uuid,
            region_id:dregions[0].uuid,
            departement_id:ddepartments[0].uuid,
            commune_id:dcommunes[0].uuid
        })
        setDisplayCountryChoice(dcountries[0])
        setDisplayRegionChoice(dregions[0])
        setDisplayDepartmentChoice(ddepartments[0])
        setDisplayCommuneChoice[dcommunes[0]]
        setErrorNom(true)
    }
    const close = ()=>{
        setForm(1)
    }
    const modifier = (selection)=>{
        setForm(3)
        selection.nom = selection.name
        setDeleteDisabled(false)
        setErrorNom(false)
        setErrorCountry(false)
        setErrorRegion(false)
        setErrorDepartment(false)
        communes.forEach(commune=>{
            if(commune.uuid == selection.commune.id){
                departments.forEach(department=>{
                    if(department.uuid == commune.department.id){
                        regions.forEach(region=>{
                            if(region.uuid == department.region.id){
                                selection.country = region.country
                                selection.region = region
                                selection.departement = department
                                selection.commune_id = selection.commune.id
                                setSelection(selection)
                            }
                        })
                    }
                })
            }
        })
        
    }
    const supprimer = (selection)=>{
        selection.nom = selection.name
        setSelection(selection)
        setForm(3)
        setDeleteDisabled(true)
        setErrorNom(false)
        setErrorCountry(false)
        setErrorRegion(false)
        setErrorDepartment(false)
        communes.forEach(commune=>{
            if(commune.uuid == selection.commune.id){
                departments.forEach(department=>{
                    if(department.uuid == commune.department.id){
                        regions.forEach(region=>{
                            if(region.uuid == department.region.id){
                                selection.country = region.country
                                selection.region = region
                                selection.departement = department
                                selection.commune_id = selection.commune.id
                                setSelection(selection)
                            }
                        })
                    }
                })
            }
        })
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
            municipality_id: selection.commune_id,
            name: selection.nom,
            end: 'entity',
            detail: false,
            terminaison: 'village',
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
            data.municipality_name = data.municipality.name
            villages.push(data)
            setSeverity("success")
            setMessage("village has been added successfully")
            setOpen(true)
            setVillages(villages)
        }else{
            if(data.hasOwnProperty("name")){
                setErrorNom(true)
                setSeverity("error")
                setMessage(data.name[0])
                setOpen(true) 
            }
            if(data.hasOwnProperty("municipality_id")){
                setErrorCommune(true)
                setSeverity("error")
                setMessage(data.municipality_id[0])
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
            terminaison: 'village',
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
            data.municipality_name = data.municipality.name
            var d = []
            d.push(data)
            villages.forEach(item=>{
                if(item.uuid != data.uuid){
                    d.push(item)
                }
            })
            setSeverity("success")
            setMessage("village updated")
            setOpen(true)
            setVillages(d)
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
            name: selection.nom,
            end: 'entity',
            detail: true,
            terminaison: 'village',
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
            var d = []
            villages.forEach(item=>{
                if(item.uuid != data.uuid){
                    d.push(item)
                }
            })
            setSeverity("success")
            setMessage("village removed")
            setOpen(true)
            setVillages(d)
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
        var iregion = 0
        dregions = []
        regions.forEach(item=>{
            var d = {label: item.name, uuid: item.uuid, id: item.id}
            if(item.country.id == dcountries[index].uuid){
               dregions.push(d)
               setDRegions(dregions)
               if(iregion == 0){
                selection.region_id = dregions[0].uuid
                setDisplayRegionChoice(dregions[0])
                setSelection(selection)
                iregion = 1
               }
            }else if (dregions.length == 0){
                selection.region_id = ""
                setDisplayRegionChoice({label:""})
                setDRegions([])
                setSelection(selection)
            }
        })
        var idepartment = 0
        ddepartments = []
        departments.forEach(item=>{
            var d = {label: item.name, uuid: item.uuid, id: item.id}
            if(item.region.id == selection.region_id){
                ddepartments.push(d)
                setDDepartments(ddepartments)
                if(idepartment == 0){
                    selection.departement_id = ddepartments[0].uuid
                    setDisplayDepartmentChoice(ddepartments[0])
                    setSelection(selection)
                    idepartment = 1
                }
            }else if (ddepartments.length == 0){
                selection.department_id = ""
                setDisplayDepartmentChoice(null)
                setDDepartments([])
                setSelection(selection)
            }
        })
        var icommune = 0
        dcommunes = []
        communes.forEach(item=>{
            var d = {label: item.name, uuid: item.uuid, id: item.id}
            if(item.department.id == selection.departement_id){
                dcommunes.push(d)
                setDCommunes(dcommunes)
                if(icommune == 0){
                    selection.commune_id = dcommunes[0].uuid
                    setDisplayCommuneChoice(dcommunes[0])
                    setSelection(selection)
                    icommune = 1
                }
            }else if (dcommunes.length == 0){
                selection.commune_id = ""
                setDisplayCommuneChoice(null)
                setDCommunes([])
                setSelection(selection)
            }
        })
        
    }

    var [dregions, setDRegions] = useState([])
    const [display_region_choice, setDisplayRegionChoice] = useState({})
    const [errorRegion, setErrorRegion] = useState(false)
    const onChangeRegion = (value)=>{
        var li = value.target
        var index = li.getAttribute('data-option-index')
        selection.region_id = dregions[index].uuid
        setDisplayRegionChoice(dregions[index])
        setSelection(selection)
        setErrorRegion(false)
        var idepartment = 0
        ddepartments = []
        departments.forEach(item=>{
            var d = {label: item.name, uuid: item.uuid, id: item.id}
            if(item.region.id == selection.region_id){
                ddepartments.push(d)
                setDDepartments(ddepartments)
                if(idepartment == 0){
                    selection.departement_id = ddepartments[0].uuid
                    setDisplayDepartmentChoice(ddepartments[0])
                    setSelection(selection)
                    idepartment = 1
                }
            }else if (ddepartments.length == 0){
                selection.department_id = ""
                setDisplayDepartmentChoice(null)
                setDDepartments([])
                setSelection(selection)
            }
        })
        var icommune = 0
        dcommunes = []
        communes.forEach(item=>{
            var d = {label: item.name, uuid: item.uuid, id: item.id}
            if(item.department.id == selection.departement_id){
                dcommunes.push(d)
                setDCommunes(dcommunes)
                if(icommune == 0){
                    selection.commune_id = dcommunes[0].uuid
                    setDisplayCommuneChoice(dcommunes[0])
                    setSelection(selection)
                    icommune = 1
                }
            }else if (dcommunes.length == 0){
                selection.commune_id = ""
                setDisplayCommuneChoice(null)
                setDCommunes([])
                setSelection(selection)
            }
        })
    }

    var [ddepartments, setDDepartments] = useState([])
    const [display_department_choice, setDisplayDepartmentChoice] = useState({})
    const [errorDepartment, setErrorDepartment] = useState(false)
    const onChangeDepartment = (value)=>{
        var li = value.target
        var index = li.getAttribute('data-option-index')
        selection.departement_id = ddepartments[index].uuid
        setDisplayDepartmentChoice(ddepartments[index])
        setSelection(selection)
        setErrorDepartment(false)
        var icommune = 0
        dcommunes = []
        communes.forEach(item=>{
            var d = {label: item.name, uuid: item.uuid, id: item.id}
            if(item.department.id == ddepartments[index].uuid){
                dcommunes.push(d)
                setDCommunes(dcommunes)
                if(icommune == 0){
                    selection.commune_id = dcommunes[0].uuid
                    setDisplayCommuneChoice(dcommunes[0])
                    setSelection(selection)
                    icommune = 1
                }
            }else if (dcommunes.length == 0){
                selection.commune_id = ""
                setDisplayCommuneChoice(null)
                setDCommunes([])
                setSelection(selection)
            }
        })
    }

    var [dcommunes, setDCommunes] = useState([])
    const [display_commune_choice, setDisplayCommuneChoice] = useState({})
    const [errorCommune, setErrorCommune] = useState(false)
    const onChangeCommune = (value)=>{
        var li = value.target
        var index = li.getAttribute('data-option-index')
        selection.commune_id = dcommunes[index].uuid
        setDisplayCommuneChoice(dcommunes[index])
        setSelection(selection)
        setErrorCommune(false)
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

    const disabled = (errorNom | errorCountry | errorRegion | errorDepartment | errorCommune) ? true : false
    
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
                            <Box>
                                <AutoSelect callback={onChangeCountry} label='Pays' data={dcountries} value={display_country_choice} />
                                <AutoSelect callback={onChangeRegion} label='Région' data={dregions} value={display_region_choice} />
                                <AutoSelect callback={onChangeDepartment} label='Département' data={ddepartments} value={display_department_choice} />
                                <AutoSelect callback={onChangeCommune} label='Commune' data={dcommunes} value={display_commune_choice} />
                            </Box>
                        :   
                            <>
                                <ControlTextInput callback={onChangeCountry}  id="pays" label="Nom du pays" readOnly={true} disabled={true} required={true} type="text" value={selection.country.name} error={false} />
                                <ControlTextInput callback={onChangeRegion}  id="region" label="Nom de la région" readOnly={true} disabled={true} required={true} type="text" value={selection.region.name} error={false} />
                                <ControlTextInput callback={onChangeDepartment}  id="department" label="Nom du département" readOnly={true} disabled={true} required={true} type="text" value={selection.department.name} error={false} />
                                <ControlTextInput callback={onChangeCommune}  id="commune" label="Nom de la commune" readOnly={true} disabled={true} required={true} type="text" value={selection.commune.name} error={false} />
                            </>
                    }
                    <ControlTextInput callback={onChangeNom}  id="nom" label="Nom de la région" readOnly={false} disabled={delete_disabled} required={true} type="text" value={selection.nom} error={errorNom} />
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
                        <FloatingActionButton callback={addCommune} />: undefined
                }
            </>
        );
    }
  
}
