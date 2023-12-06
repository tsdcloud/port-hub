import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';
import ModeIcon from '@mui/icons-material/Mode';

import MyTable from '../../utils/MyTable';
import FloatingActionButton from '../../utils/FloatingActionButton';
import TextInput from '../../utils/TextInput';
import SimpleButton from '../../utils/SimpleButton';
import { AUTHCONTEXT } from '../../context/AuthContext';
import Toast from '../../utils/Toast';
import SelectInput from '../../utils/SelectInput';
import ControlTextInput from '../../utils/ControlTextInput';
import DateTimeInput from '../../utils/DateTimeInput';
import AutoSelect from '../../utils/AutoSelect';



import { useState, useContext } from "react";

export default function Transfer() {
    const {headers} = useContext(AUTHCONTEXT)
    const {
        trailers,setTrailers,
        tractors,setTractors,
        transfers,setTransfers,
        careers,careerarticles,
        depots,stockagepartners
    } = useContext(AUTHCONTEXT)
    
    // columns d'entête
    var columns = [
        {
            id: 'id',
            label: 'ID',
        },
        {
            id: 'statut',
            label: "Etat",
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'transfer_slip',
            label: 'Bordoreaux de transfert',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'physical_waybill',
            label: 'Lettre de voiture physique',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'driver',
            label: 'Chauffeur',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'product_name',
            label: 'Article',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'volume_transferred',
            label: 'Volume transferé',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'date_op',
            label: 'Date OP',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'volume_receptionned',
            label: 'Volume receptionné',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'date_recep',
            label: 'Date Recep',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'tractor_name',
            label: 'Immatriculation Tractor',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'trailer_name',
            label: "Immatriculation Remorque",
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'depot_name',
            label: "Dépôt",
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
        },
        {
            id: 'stockage_name',
            label: "Hub Minier",
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        }
    ]

    // lignes du tableau
    var rows = transfers


    const addTransfer = ()=>{
        setForm(2)
    }
    const close = ()=>{
        setForm(1)
    }
    const voidc = ()=>{}

    const save = async ()=>{
        setLoading(true)
        const params = {
            career_id: career,
            article_id: article,
            stockageaera_id: stockage,
            depot_id: depot,
            tractor_id: tractor,
            trailer_id: trailer,
            transfer_slip: transfer_slip,
            physical_waybill: physical_waybill,
            volume_transferred: volume,
            driver: driver,
            date_op: date_op,
            end: 'career',
            detail: false,
            terminaison: 'transfer',
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
            data.statut = "ENCOURS"
            transfers.push(data)
            setSeverity("success")
            setMessage("transfer has been added successfully")
            setOpen(true)
            setTransfers(transfers)
        }else{
            if(data.hasOwnProperty("career_id")){
                setErrorCareer(true)
                setSeverity("error")
                setMessage(data.career_id[0])
                setOpen(true) 
            }
            if(data.hasOwnProperty("article_id")){
                setErrorArticle(true)
                setSeverity("error")
                setMessage(data.article_id[0])
                setOpen(true) 
            }
            if(data.hasOwnProperty("stockageaera_id")){
                setErrorStockage(true)
                setSeverity("error")
                setMessage(data.stockageaera_id[0])
                setOpen(true) 
            }
            if(data.hasOwnProperty("depot_id")){
                setErrorDepot(true)
                setSeverity("error")
                setMessage(data.depot_id[0])
                setOpen(true) 
            }
            if(data.hasOwnProperty("tractor_id")){
                setErrorTractor(true)
                setSeverity("error")
                setMessage(data.tractor_id[0])
                setOpen(true) 
            }
            if(data.hasOwnProperty("trailer")){
                setErrorTrailer(true)
                setSeverity("error")
                setMessage(data.trailer_id[0])
                setOpen(true) 
            }
            if(data.hasOwnProperty("transfer_slip")){
                setErrorTransferSlip(true)
                setSeverity("error")
                setMessage(data.transfer_slip[0])
                setOpen(true) 
            }
            if(data.hasOwnProperty("physical_waybill")){
                setErrorPhysicalWaybill(true)
                setSeverity('error')
                setMessage(data.physical_waybill[0])
                setOpen(true)
            }
            if(data.hasOwnProperty("driver")){
                setErrorDriver(true)
                setSeverity('error')
                setMessage(data.driver[0])
                setOpen(true)
            }
            if(data.hasOwnProperty("volume_transferred")){
                setErrorVolume(true)
                setSeverity('error')
                setMessage(data.volume_transferred[0])
                setOpen(true)
            }
            if(data.hasOwnProperty("date_op")){
                setErrorDateOp(true)
                setSeverity('error')
                setMessage(data.date_op[0])
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
        setArticle('')
        setErrorArticle(true)
        setErrorStockage(true)
        setStockage('')
        setStockageName('')
    }

    const articles = careerarticles.filter(item=>{
        if(item.career.id == career){
            item.option = career + '@'
            item.key = item.article.name
            item.value = item.article.id
            return true
        }else{
            return false
        }
    })
    const [article, setArticle] = useState(true)
    const [errorArticle, setErrorArticle] = useState(true)
    const onChangeArticle = async (value)=>{
        setArticle(value)
        setErrorArticle(false)
        articles.every(item=>{
            if(item.article.id == value & item.career.id == career){
                setStockage(item.stockage.id)
                setStockageName(item.stockage.name)
                setErrorStockage(false)
                return true
            }
        })
    }

    const [stockage, setStockage] = useState()
    const [stockagename, setStockageName] = useState()
    const [errorStockage, setErrorStockage] = useState(true)

    const [depot, setDepot] = useState()
    const depot_career = depots.filter(item=>{
        if(item.career.id == career){
            item.key = item.numero
            item.value = item.uuid
            return true
        }
    })
    const [errorDepot, setErrorDepot] = useState(true)
    const onChangeDepot = (value)=>{
        setDepot(value)
        setErrorDepot(false)
    }

    const [tractor, setTractor] = useState()
    const available_tractors = tractors.filter(item=>{
        if(item.is_used == false){
            item.key = item.registration
            item.value = item.uuid
            return true
        }
    })
    const [errorTractor, setErrorTractor] = useState(true)
    const onChangeTractor = (value)=>{
        setTractor(value)
        setErrorTractor(false)
    }

    const [trailer, setTrailer] = useState()
    const available_trailers = trailers.filter(item=>{
        if(item.is_used == false){
            item.key = item.registration
            item.value = item.uuid
            return true
        }
    })
    const [errorTrailer, setErrorTrailer] = useState(true)
    const onChangeTrailer = (value)=>{
        setTrailer(value)
        setErrorTrailer(false)
    }

    const [transfer_slip, setTransferSlip] = useState()
    const [errorTransferSlip, setErrorTransferSlip] = useState(true)
    const onChangeTransferSlip = (value)=>{
        if(value.length > 3){
            setTransferSlip(value)
            setErrorTransferSlip(false)
        }else{
            setErrorTransferSlip(true)
        }
    }

    const [physical_waybill, setPhysicalWaybill] = useState()
    const [errorPhysicalWaybill, setErrorPhysicalWaybill] = useState(true)
    const onChangePhysicalWaybill = (value)=>{
        if(value.length > 3){
            setPhysicalWaybill(value)
            setErrorPhysicalWaybill(false)
        }else{
            setErrorPhysicalWaybill(true)
        }
    }

    const [driver, setDriver] = useState()
    const [errorDriver, setErrorDriver] = useState(true)
    const onChangeDriver = (value)=>{
        if(value.length > 3){
            setDriver(value)
            setErrorDriver(false)
        }else{
            setErrorDriver(true)
        }
    }

    const [volume, setVolume] = useState()
    const [errorVolume, setErrorVolume] = useState(true)
    const onChangeVolume = (value)=>{
        try{
            if(parseFloat(value) > 1){
                setVolume(value)
                setErrorVolume(false)
            }else{
                setErrorVolume(true)
            }
        }catch{
            setErrorVolume(true)
        }
    }

    const [date_op, setDateOp] = useState()
    const [errorDateOp, setErrorDateOp] = useState(true)
    const onChangeDateOp = (value)=>{
        var date = new Date(value)
        setDateOp(date.getDate()+'-'+(parseInt(date.getMonth())+1) +'-'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes())
        setErrorDateOp(false)
    }

    const [open, setOpen] = useState(false)
    const handleClose = ()=>{
        setOpen(false)
    }
    const [message, setMessage] = useState("new tractor is being added")
    const [severity, setSeverity] = useState("success")

    const disabled = (errorCareer | errorArticle | errorStockage | errorDepot | errorTractor | errorTrailer | errorTransferSlip | errorPhysicalWaybill | errorDriver | errorVolume | errorDateOp) ? true : false

    const [selection_transfer, setSelectionTransfer] = useState({})
    const receptionD = (selection)=>{
        setForm(3)
        setSelectionTransfer(selection)
        setRTransfer(selection.uuid)
        setRCareerName(selection.career.name)
        setRArticleName(selection.article.name)
        setRStockageName(selection.stockageaera.name)
        setRDepotName(selection.depot.numero)
        setRTractorRegistration(selection.tractor.registration)
        setRTrailerRegistration(selection.trailer.registration)
        setRTransferSlip(selection.transfer_slip)
        setRPhysicalWayBill(selection.physical_waybill)
        setRDriver(selection.driver)
        setRVolume(selection.volume_transferred)
        setRDateTransfer(selection.date_op)
        setIsvente(false)
        if(selection.status == 1){
            setReception(true)
        }else{
            setReception(false)
            setDateRecep(selection.date_recep)
            setVolumeRecept(selection.volume_receptionned)
        }
    }
    const receptionV = (selection)=>{
        setForm(3)
        setSelectionTransfer(selection)
        setRTransfer(selection.uuid)
        setRCareerName(selection.career.name)
        setRArticleName(selection.article.name)
        setRStockageName(selection.stockageaera.name)
        setRDepotName(selection.depot.numero)
        setRTractorRegistration(selection.tractor.registration)
        setRTrailerRegistration(selection.trailer.registration)
        setRTransferSlip(selection.transfer_slip)
        setRPhysicalWayBill(selection.physical_waybill)
        setRDriver(selection.driver)
        setRVolume(selection.volume_transferred)
        setRDateTransfer(selection.date_op)
        setIsvente(true)
        setDestPartners(dpartners)
        if(selection.status == 1){
            setReception(true)
        }else{
            setReception(false)
            setDateRecep(selection.date_recep)
            setVolumeRecept(selection.volume_receptionned)
        }
    }
    const [isvente, setIsvente] = useState(false)
    const listMenu = [
        {
            id : "m",
            icon : <ModeIcon />,
            label : "Réception + Déchargement",
            callback : receptionD
        },
        {
            id : "m",
            icon : <ModeIcon />,
            label : "Réception + Vente",
            callback : receptionV
        },
    ]
    const [rtransfer, setRTransfer] = useState()
    const [rcareername, setRCareerName] = useState()
    const [rarticlename, setRArticleName] = useState()
    const [rstockagename, setRStockageName] = useState()
    const [rdepotname, setRDepotName] = useState()
    const [rtractorregistration, setRTractorRegistration] = useState()
    const [rtrailerregistration, setRTrailerRegistration] = useState()
    const [rtransferslip, setRTransferSlip] = useState()
    const [rphysicalwaybill, setRPhysicalWayBill] = useState()
    const [rdriver, setRDriver] = useState()
    const [rvolume, setRVolume] = useState()
    const [rdatetransfer, setRDateTransfer] = useState()
    const [reception, setReception] = useState(false)

    const [volumerecep, setVolumeRecept] = useState()
    const [errorVolumeRecept, setErrorVolumeRecep] = useState(true)
    const onChangeVolumeRecep = (value)=>{
        try{
            if(parseFloat(value) > 1 & parseFloat(value) <= selection_transfer.volume_transferred){
                setVolumeRecept(value)
                setErrorVolumeRecep(false)
            }else{
                setErrorVolumeRecep(true)
            }
        }catch{
            setErrorVolumeRecep(true)
        }
    }

    const [date_recep, setDateRecep] = useState()
    const [errorDateRecep, setErrorDateRecept] = useState(true)
    const onChangeDateRecep = (value)=>{
        var date = new Date(value)
        setDateRecep(date.getDate()+'-'+(parseInt(date.getMonth())+1)+'-'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes())
        setErrorDateRecept(false)
    }
    const disabledRD = (errorVolumeRecept | errorDateRecep) ? true : false
    const reception_dechargement = async ()=>{
        setLoading(true)
        const params = {
            date_recep: date_recep,
            volume_receptionned: volumerecep,
            end: 'career',
            detail: true,
            terminaison: 'transfer',
            id: rtransfer,
            action: 'reception'
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
            data.value = data.uuid
            data.statut = "RECEPTIONNÉ"
            var d = []
            d.push(data)
            transfers.forEach(item=>{
                if(item.uuid != data.uuid){
                    d.push(item)
                }
            })
            setSeverity("success")
            setMessage("transfer has been received")
            setOpen(true)
            setTransfers(transfers)
            setReception(false)
        }else{
            if(data.hasOwnProperty("date_recep")){
                setErrorDateRecept(true)
                setSeverity("error")
                setMessage(data.date_recep[0])
                setOpen(true) 
            }
            if(data.hasOwnProperty("volume_receptionned")){
                setErrorVolumeRecep(true)
                setSeverity("error")
                setMessage(data.volume_receptionned[0])
                setOpen(true) 
            }
        }
    }

    
    const reception_vente = async ()=>{
        setLoading(true)
        const params = {
            date_recep: date_recep,
            volume_receptionned: volumerecep,
            sale_unit_price: saleunitprice,
            destination: selectionDest.uuid,
            stockage_partner_id: selectionDest.uuid,
            end: 'career',
            detail: true,
            terminaison: 'transfer',
            id: rtransfer,
            action: 'receptionvente'
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
            data.value = data.uuid
            data.statut = "RECEPTIONNÉ"
            var d = []
            d.push(data)
            transfers.forEach(item=>{
                if(item.uuid != data.uuid){
                    d.push(item)
                }
            })
            setSeverity("success")
            setMessage("transfer has been received")
            setOpen(true)
            setTransfers(transfers)
            setReception(false)
        }else{
            if(data.hasOwnProperty("date_recep")){
                setErrorDateRecept(true)
                setSeverity("error")
                setMessage(data.date_recep[0])
                setOpen(true) 
            }
            if(data.hasOwnProperty("volume_receptionned")){
                setErrorVolumeRecep(true)
                setSeverity("error")
                setMessage(data.volume_receptionned[0])
                setOpen(true) 
            }
        }
    }

    const [dest, setDest] = useState(true)
    const [dest_partners, setDestPartners] = useState()
    const dpartners = [{label: "Autre", uuid: "Autre", id:0}]
    stockagepartners.forEach(item=>{
        var d = {label: item.name, uuid: item.uuid, id: item.id}
        dpartners.push(d)
    })
    
    const [errorDest, setErrorDest] = useState(true)
    const [selectionDest, setSelectionDest] = useState(true)
    const onChangeDest = (value)=>{
        var li = value.target
        var index = li.getAttribute('data-option-index')
        setSelectionDest(dest_partners[index])
        setErrorDest(false)
    }

    const [saleunitprice, setSaleUnitPrice] = useState()
    const [errorSaleUnitPrice, setErrorSaleUnitPrice] = useState(true)
    const onChangeSaleUnitPrice = (value)=>{
        try{
            if(parseFloat(value) > 1 ){
                setSaleUnitPrice(value)
                setErrorSaleUnitPrice(false)
            }else{
                setErrorSaleUnitPrice(true)
            }
        }catch{
            setErrorSaleUnitPrice(true)
        }
    }

    const disabledRV = (errorVolumeRecept | errorDateRecep | errorDest | errorSaleUnitPrice) ? true : false
    
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
                    <ControlTextInput callback={voidc}  disabled={true} id="rcareername" label="Carrière" readOnly={true} required={true} type="text" value={rcareername} />
                    <ControlTextInput callback={voidc}  disabled={true} id="rdepotnum" label="Dépôt" readOnly={true} required={true} type="text" value={rdepotname} />
                    <ControlTextInput callback={voidc}  disabled={true} id="rarticlename" label="Article" readOnly={true} required={true} type="text" value={rarticlename} />
                    <ControlTextInput callback={voidc}  disabled={true} id="rstockagename" label="Hub minier" readOnly={true} required={true} type="text" value={rstockagename} />
                </div>
                <div>
                    <ControlTextInput callback={voidc}  disabled={true} id="rtractorregistration" label="Immatriculation tracteur" readOnly={true} required={true} type="text" value={rtractorregistration} />
                    <ControlTextInput callback={voidc}  disabled={true} id="rtrailerregistration" label="Immatriculation remorque" readOnly={true} required={true} type="text" value={rtrailerregistration} />
                    <ControlTextInput callback={voidc}  disabled={true} id="rtransferslip" label="Bordereau de transfert" readOnly={true} required={true} type="text" value={rtransferslip} />
                    <ControlTextInput callback={voidc}  disabled={true} id="rphysicalwaybill" label="Lettre de voiture physique" readOnly={true} required={true} type="text" value={rphysicalwaybill} />
                </div>
                <div>
                    <ControlTextInput callback={voidc}  disabled={true} id="rdriver" label="Nom du chauffeur" readOnly={true} required={true} type="text" value={rdriver} />
                    <ControlTextInput callback={voidc}  disabled={true} id="rvolume" label="Volume tranféré" readOnly={true} required={true} type="text" value={rvolume} />
                    <ControlTextInput callback={voidc}  disabled={true} id="rdatetransfer" label="Date du transfert" readOnly={true} required={true} type="text" value={rdatetransfer} />
                    {
                        (!reception)?
                        <>
                            <ControlTextInput callback={voidc}  disabled={true} id="rdaterecep" label="Date de reception" readOnly={true} required={true} type="text" value={date_recep} />
                            <ControlTextInput callback={voidc}  disabled={true} id="volumer" label="Volume receptionné" readOnly={true} required={true} type="text" value={volumerecep} />
                        </>
                        :
                        <>
                            <DateTimeInput label="Date de reception" disableFuture={true} callback={onChangeDateRecep} />
                            <TextInput required={true} id='volumer' error={errorVolumeRecept} label="Volume receptionné" callback={onChangeVolumeRecep} value={volume} />
                            {
                                (isvente)?
                                    <>
                                        <AutoSelect callback={onChangeDest} label='Destination' data={dest_partners} />
                                        <TextInput required={true} id='sale_unit_price' error={errorSaleUnitPrice} label="Prix de vente" callback={onChangeSaleUnitPrice} value={saleunitprice} />
                                    </>
                                : undefined
                            }
                        </>
                    }
                </div>
                <div>
                    <Stack direction="row" spacing={3}>
                        {
                            (reception & !isvente)?
                                <SimpleButton label="receptionner" endIcon={<SendIcon />} color="success" callback={reception_dechargement} size='medium' loading={loading} disabled={disabledRD} />
                            :
                            (reception & isvente)?
                                <>
                                    <SimpleButton label="receptionner" endIcon={<SendIcon />} color="success" callback={reception_vente} size='medium' loading={loading} disabled={disabledRV} />
                                </>
                            : undefined
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
                <SelectInput callback={onChangeCareer} data={careers} id='career' defaultValue={1} label="Carrière" required={true} />
                <SelectInput callback={onChangeDepot} data={depot_career} id='depot' defaultValue={1} label="Dépôt" required={true} />
                <SelectInput callback={onChangeArticle} data={articles} id='article' defaultValue={1} label="Article" required={true} />
                <ControlTextInput callback={voidc}  disabled={true} id="stockagename" label="Hub minier" readOnly={true} required={true} type="text" value={stockagename} />
            </div>
            <div>
                <SelectInput callback={onChangeTractor} data={available_tractors} id='tractor' defaultValue={1} label="Trateur" required={true} />
                <SelectInput callback={onChangeTrailer} data={available_trailers} id='trailer' defaultValue={1} label="Remorque" required={true} />
                <TextInput required={true} id='transfer_slip' error={errorTransferSlip} label="Bordoreau de transfert" callback={onChangeTransferSlip} value={transfer_slip} />
                <TextInput required={true} id='physical_waybill' error={errorPhysicalWaybill} label="Lettre de voiture physique" callback={onChangePhysicalWaybill} value={physical_waybill} />
            </div>
            <div>
                <TextInput required={true} id='driver' error={errorDriver} label="Nom du chauffeur" callback={onChangeDriver} value={driver} />
                <TextInput required={true} id='volume' error={errorVolume} label="Volume Transféré" callback={onChangeVolume} value={volume} />
                <DateTimeInput label="Date de l'opération" disableFuture={true} callback={onChangeDateOp} />
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
                <MyTable columns={columns} rows={rows} listmenu={listMenu}  action={true} />
                <FloatingActionButton callback={addTransfer} />
            </>
        );
    }
  
}
