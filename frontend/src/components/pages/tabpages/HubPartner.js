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
import AutoSelect from '../../utils/AutoSelect';
import ControlTextInput from '../../utils/ControlTextInput';



import { useState, useEffect, useContext } from "react";

export default function HubPartner() {
    const {headers} = useContext(AUTHCONTEXT)
    const {
        stockagepartners,setStockagePartners,
        villages,entities,getStockagePartners,
        countries, regions, departments,
        user, communes
    } = useContext(AUTHCONTEXT)

    useEffect(() => {
        if(communes.length == 0){
            getStockagePartners()
        }
        var ientity = 0
        entities.forEach(item=>{
            var d = {label: item.business_name, uuid: item.uuid, id: item.id}
            dentities.push(d)
            setDEntities(dentities)
            if(ientity == 0){
                selection.firm_id = dentities[0].uuid
                setDisplayEntityChoice(dentities[0])
                setSelection(selection)
                ientity = 1
            }
        })
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
        var ivillage = 0
        villages.forEach(item=>{
            var d = {label: item.name, uuid: item.uuid, id: item.id}
            if(item.municipality.id == selection.commune_id){
                dvillages.push(d)
                setDVillages(dvillages)
                if(ivillage == 0){
                    selection.village_id = dvillages[0].uuid
                    setDisplayVillageChoice(dvillages[0])
                    setSelection(selection)
                    ivillage = 1
                }
            }else if (dvillages.length == 0){
                selection.village_id = ""
                setDisplayVillageChoice(null)
                setDVillages([])
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
            label: 'Hub Partenaire',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'village_name',
            label: "Village",
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'firm_name',
            label: "Entreprise",
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        }
    ]

    // lignes du tableau
    var rows = stockagepartners

    const addStockagePartner = ()=>{
        setForm(2)
        setSelection({
            nom:"",
            country_id:dcountries[0].uuid,
            region_id:dregions[0].uuid,
            departement_id:ddepartments[0].uuid,
            commune_id:dcommunes[0].uuid,
            village_id:dvillages[0].uuid
        })
        setDisplayCountryChoice(dcountries[0])
        setDisplayRegionChoice(dregions[0])
        setDisplayDepartmentChoice(ddepartments[0])
        setDisplayCommuneChoice(dcommunes[0])
        setDisplayVillageChoice(dvillages[0])
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
        villages.forEach(village=>{
            if(village.uuid == selection.village_id){
                communes.forEach(commune=>{
                    if(commune.uuid == village.municipality.id){
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
        })
    }
    const supprimer = (selection)=>{
        setForm(3)
        selection.nom = selection.name
        setDeleteDisabled(false)
        setErrorNom(false)
        setErrorCountry(false)
        setErrorRegion(false)
        setErrorDepartment(false)
        villages.forEach(village=>{
            if(village.uuid == selection.village_id){
                communes.forEach(commune=>{
                    if(commune.uuid == village.municipality.id){
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
        :null,
        (user.member.is_superuser | user.member.user_permissions.includes('add_location'))?
            {
                id : "d",
                icon : <DeleteIcon />,
                label : "Supprimer",
                callback : supprimer
            }
        :null
    ]

    const save = async ()=>{
        setLoading(true)
        const params = {
            village_id: selection.village_id,
            firm_id: selection.firm_id,
            name: selection.nom,
            end: 'career',
            detail: false,
            terminaison: 'stockagepartner',
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
            data.village_name = data.village.name
            data.firm_name = data.firm.business_name
            stockagepartners.push(data)
            setSeverity("success")
            setMessage("stockage partner has been added successfully")
            setOpen(true)
            setStockagePartners(stockagepartners)
        }else{
            if(data.hasOwnProperty("non_field_errors")){
                setErrorNumero(true)
                setSeverity("error")
                setMessage(item.label[0])
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
        var ivillage = 0
        villages.forEach(item=>{
            var d = {label: item.name, uuid: item.uuid, id: item.id}
            if(item.municipality.id == dcommunes[index].uuid){
                dvillages.push(d)
                setDVillages(dvillages)
                if(ivillage == 0){
                    selection.village_id = dvillages[0].uuid
                    setDisplayVillageChoice(dvillages[0])
                    setSelection(selection)
                    ivillage = 1
                }
            }else if (dvillages.length == 0){
                selection.village_id = ""
                setDisplayVillageChoice(null)
                setDVillages([])
                setSelection(selection)
            }
        })
    }

    var [dvillages, setDVillages] = useState([])
    const [display_village_choice, setDisplayVillageChoice] = useState({})
    const [errorVillage, setErrorVillage] = useState(false)
    const onChangeVillage = (value)=>{
        var li = value.target
        var index = li.getAttribute('data-option-index')
        selection.village_id = dvillages[index].uuid
        setDisplayVillageChoice(dvillages[index])
        setSelection(selection)
        setErrorVillage(false)
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

    var [dentities, setDEntities] = useState([])
    const [display_entity_choice, setDisplayEntityChoice] = useState({})
    const [errorEntity, setErrorEntity] = useState(false)
    const onChangeEntity = (value)=>{
        var li = value.target
        var index = li.getAttribute('data-option-index')
        selection.firm_id = dentities[index].uuid
        setDisplayEntityChoice(dentities[index])
        setSelection(selection)
        setErrorEntity(false)
    }

    const [open, setOpen] = useState(false)
    const handleClose = ()=>{
        setOpen(false)
    }
    const [message, setMessage] = useState("new partner stockage is being added")
    const [severity, setSeverity] = useState("success")

    const disabled = (errorNom | errorVillage | errorEntity) ? true : false
    
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
                    {
                        isForm == 2 ?
                            <Box>
                                <AutoSelect callback={onChangeCountry} label='Pays' data={dcountries} value={display_country_choice} />
                                <AutoSelect callback={onChangeRegion} label='Région' data={dregions} value={display_region_choice} />
                                <AutoSelect callback={onChangeDepartment} label='Département' data={ddepartments} value={display_department_choice} />
                                <AutoSelect callback={onChangeCommune} label='Commune' data={dcommunes} value={display_commune_choice} />
                                <AutoSelect callback={onChangeVillage} label='Village' data={dvillages} value={display_village_choice} />
                                <AutoSelect callback={onChangeEntity} label='Entreprise' data={dentities} value={display_entity_choice} />
                            </Box>
                        :   
                            <>
                                <ControlTextInput callback={onChangeCountry}  id="pays" label="Nom du pays" readOnly={true} disabled={true} required={true} type="text" value={selection.country.name} error={false} />
                                <ControlTextInput callback={onChangeRegion}  id="region" label="Nom de la région" readOnly={true} disabled={true} required={true} type="text" value={selection.region.name} error={false} />
                                <ControlTextInput callback={onChangeDepartment}  id="department" label="Nom du département" readOnly={true} disabled={true} required={true} type="text" value={selection.department.name} error={false} />
                                <ControlTextInput callback={onChangeCommune}  id="commune" label="Nom de la commune" readOnly={true} disabled={true} required={true} type="text" value={selection.commune.name} error={false} />
                                <ControlTextInput callback={onChangeVillage}  id="village" label="Nom du village" readOnly={true} disabled={true} required={true} type="text" value={selection.village.name} error={false} />
                                <ControlTextInput callback={onChangeEntity}  id="entity" label="Entreprise" readOnly={true} disabled={true} required={true} type="text" value={selection.firm.business_name} error={false} />
                            </>
                    }
                    <ControlTextInput callback={onChangeNom}  id="nom" label="Nom du dépôt de vente" readOnly={false} disabled={delete_disabled} required={true} type="text" value={selection.nom} error={errorNom} />
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
                <FloatingActionButton callback={addStockagePartner} />
            </>
        );
    }
  
}
