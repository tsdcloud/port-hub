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
import DateTimeInput from '../../utils/DateTimeInput';
import AutoSelect from '../../utils/AutoSelect';
import ControlTextInput from '../../utils/ControlTextInput';



import { useState, useContext } from "react";

export default function Sale() {
    const {headers} = useContext(AUTHCONTEXT)
    const {
        sales,setSale,
        stockages,
        stockagepartners,
        articles,
        tractors,
        trailers
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
            id: 'sale_slip',
            label: 'Bordoreaux de vente',
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
            id: 'volume',
            label: 'Volume Vendu',
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
            id: 'volume_r',
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
            id: 'depart',
            label: "Point de départ",
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'arrivee',
            label: "Destination",
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        }
    ]

    // lignes du tableau
    var rows = sales


    const addSale = ()=>{
        setForm(2)
    }
    const close = ()=>{
        setForm(1)
    }
    const voidc = ()=>{}

    const [saleSlip, setSaleSlip] = useState()
    const [errorSaleSlip, setErrorSaleSlip] = useState(true)
    const onChangeSaleSlip = (value)=>{
        if(value.length > 3){
            setSaleSlip(value)
            setErrorSaleSlip(false)
        }else{
            setErrorSaleSlip(true)
        }
    }

    const [type_vente, setTypeVente] = useState(1)

    var dstockage = (type_vente == 1 | type_vente == 2) ? [] : [{label: "Autre", uuid: "Autre", id:0}]
    stockages.forEach(item=>{
        var d = {label: item.name, uuid: item.uuid, id: item.id}
        dstockage.push(d)
    })
    dstockage = (type_vente == 3 ) ? [{label: "Autre", uuid: "Autre", id:0}] : dstockage
    const [errorStockage, setErrorStockage] = useState(true)
    const [selectionStockage, setSelectionStockage] = useState(true)
    const onChangeSelectionStockage = (value)=>{
        var li = value.target
        var index = li.getAttribute('data-option-index')
        setSelectionStockage(dstockage[index])
        setErrorStockage(false)
    }

    var dpartnerts = (type_vente == 1 | type_vente == 3) ? [] : [{label: "Autre", uuid: "Autre", id:0}]
    stockagepartners.forEach(item=>{
        var d = {label: item.name, uuid: item.uuid, id: item.id}
        dpartnerts.push(d)
    })
    dpartnerts = (type_vente == 2 ) ? [{label: "Autre", uuid: "Autre", id:0}] : dpartnerts
    const [errorPartner, setErrorPartner] = useState(true)
    const [selectionPartner, setSelectionPartner] = useState()
    const onChangeSelectionPartner = (value)=>{
        var li = value.target
        var index = li.getAttribute('data-option-index')
        setSelectionPartner(dpartnerts[index])
        setErrorPartner(false)
    }

    var darticles = []
    articles.forEach(item=>{
        var d = {label: item.name, uuid: item.uuid, id: item.id}
        darticles.push(d)
    })
    const [errorArticle, setErrorArticle] = useState(true)
    const [selectionArticle, setSelectionArticle] = useState()
    const onChangeSelectionArticle = (value)=>{
        var li = value.target
        var index = li.getAttribute('data-option-index')
        setSelectionArticle(darticles[index])
        setErrorArticle(false)
    }

    var dtractors = []
    tractors.forEach(item=>{
        var d = {label: item.registration, uuid: item.uuid, id: item.id}
        dtractors.push(d)
    })
    const [errorTractor, setErrorTractor] = useState(true)
    const [selectionTractor, setSelectionTractor] = useState()
    const onChangeSelectionTractor = (value)=>{
        var li = value.target
        var index = li.getAttribute('data-option-index')
        setSelectionTractor(dtractors[index])
        setErrorTractor(false)
    }

    var dtrailers = []
    trailers.forEach(item=>{
        var d = {label: item.registration, uuid: item.uuid, id: item.id}
        dtrailers.push(d)
    })
    const [errorTrailer, setErrorTrailer] = useState(true)
    const [selectionTrailer, setSelectionTrailer] = useState()
    const onChangeSelectionTrailer = (value)=>{
        var li = value.target
        var index = li.getAttribute('data-option-index')
        setSelectionTrailer(dtrailers[index])
        setErrorTrailer(false)
    }

    const [volume, setVolume] = useState()
    const [errorVolume, setErrorVolume] = useState(true)
    const onChangeVolume = (value)=>{
        try{
            if(parseFloat(value) > 1 ){
                setVolume(value)
                setErrorVolume(false)
            }else{
                setErrorVolume(true)
            }
        }catch{
            setErrorVolume(true)
        }
    }

    const [price, setPrice] = useState()
    const [errorPrice, setErrorPrice] = useState(true)
    const onChangePrice = (value)=>{
        try{
            if(parseInt(value) > 1 ){
                setPrice(value)
                setErrorPrice(false)
            }else{
                setErrorPrice(true)
            }
        }catch{
            setErrorPrice(true)
        }
    }

    const [driver, setDriver] = useState()
    const [errorDriver, setErrorDriver] = useState(true)
    const onChangeDriver = (value)=>{
        if(value.length > 3 ){
            setDriver(value)
            setErrorDriver(false)
        }else{
            setErrorDriver(true)
        }
    }

    const [destination, setDestination] = useState()
    const [errorDestination, setErrorDestination] = useState(true)
    const onChangeDestination = (value)=>{
        if(value.length > 3 ){
            setDestination(value)
            setErrorDestination(false)
        }else{
            setErrorDestination(true)
        }
    }

    const [date_op, setDateOp] = useState()
    const [errorDateOp, setErrorDateOp] = useState(true)
    const onChangeDateOp = (value)=>{
        var date = new Date(value)
        setDateOp(date.getDate()+'-'+(parseInt(date.getMonth())+1) +'-'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes())
        setErrorDateOp(false)
    }

    const dvente = [
        {label: "Hub minier -- Dépôt de vente", uuid: "1", id:0},
        {label: "Hub minier -- Autre", uuid: "2", id:1},
        {label: "Dépôt de vente -- Autre", uuid: "3", id:2},
    ]
    const [errorvente, setErrorVente] = useState(true)
    const [selectionVente, setSelectionVente] = useState(dvente[0])
    const onChangeSelectionVente = (value)=>{
        var li = value.target
        var index = li.getAttribute('data-option-index')
        setSelectionVente(dvente[index])
        setErrorVente(false)
        setTypeVente(parseInt(index,10)+1)
        setErrorStockage(true)
        setErrorPartner(true)
    }

    const disabled = (errorSaleSlip | errorStockage | errorPartner | errorArticle | errorvente | errorTractor | errorTrailer | errorVolume | errorPrice | errorDriver | errorDestination | errorDateOp) ? true : false

    const save = async ()=>{
        setLoading(true)
        const params = {
            sale_slip: saleSlip,
            stockage_aera_id: selectionStockage.uuid,
            stockage_partner_id: selectionPartner.uuid,
            article_id: selectionArticle.uuid,
            tractor_id: selectionTractor.uuid,
            trailer_id: selectionTrailer.uuid,
            sale_unit_price: price,
            volume: volume,
            driver: driver,
            destination: destination,
            date_op: date_op,
            end: 'career',
            detail: false,
            terminaison: 'sale',
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
            data.statut = (data.status == 1)? 'ENCOURS' : 'LIVRÉ'
            data.depart = (data.type_sale == 1 | data.type_sale == 2) ? data.stockage_aera.name : data.stockage_partner.name
            data.arrivee = (data.type_sale != 3) ?  data.destination : data.stockage_partner.name
            data.tractor_name = data.tractor.registration
            data.trailer_name= data.trailer.registration
            data.id = rows.length + 1
            data.statut = "ENCOURS"
            sales.push(data)
            setSeverity("success")
            setMessage("sale has been added successfully")
            setOpen(true)
            setSales(sales)
        }else{
            if(data.hasOwnProperty("sale_slip")){
                setErrorSaleSlip(true)
                setSeverity("error")
                setMessage(data.sale_slip[0])
                setOpen(true) 
            }if(data.hasOwnProperty("stockage_aera_id")){
                setErrorStockage(true)
                setSeverity("error")
                setMessage(data.stockage_aera_id[0])
                setOpen(true) 
            }if(data.hasOwnProperty("stockage_partner_id")){
                setErrorPartner(true)
                setSeverity("error")
                setMessage(data.stockage_partner_id[0])
                setOpen(true) 
            }if(data.hasOwnProperty("volume")){
                setErrorVolume(true)
                setSeverity("error")
                setMessage(data.volume[0])
                setOpen(true) 
            }if(data.hasOwnProperty("article_id")){
                setErrorArticle(true)
                setSeverity("error")
                setMessage(data.article_id[0])
                setOpen(true) 
            }if(data.hasOwnProperty("tractor_id")){
                setErrorTractor(true)
                setSeverity("error")
                setMessage(data.tractor_id[0])
                setOpen(true) 
            }if(data.hasOwnProperty("trailer_id")){
                setErrorTrailer(true)
                setSeverity("error")
                setMessage(data.trailer_id[0])
                setOpen(true) 
            }if(data.hasOwnProperty("sale_unit_price")){
                setErrorPrice(true)
                setSeverity("error")
                setMessage(data.sale_unit_price[0])
                setOpen(true) 
            }if(data.hasOwnProperty("driver")){
                setErrorDriver(true)
                setSeverity("error")
                setMessage(data.driver[0])
                setOpen(true) 
            }if(data.hasOwnProperty("destination")){
                setErrorDestination(true)
                setSeverity("error")
                setMessage(data.destination[0])
                setOpen(true) 
            }if(data.hasOwnProperty("date_op")){
                setErrorDateOp(true)
                setSeverity("error")
                setMessage(data.date_op[0])
                setOpen(true) 
            }if(data.hasOwnProperty("non_field_errors")){
                setSeverity("error")
                setMessage(data.non_field_errors[0])
                setOpen(true) 
            }
        }
    }

    {/* reception */}
    const [selection, setSelection] = useState()

    const reception = (selection)=>{
        setForm(3)
        setSelection(selection)
    }

    const [volumer, setVolumeR] = useState()
    const [errorVolumeR, setErrorVolumeR] = useState(true)
    const onChangeVolumeR = (value)=>{
        try{
            if(parseFloat(value) > 1 ){
                setVolumeR(value)
                setErrorVolumeR(false)
            }else{
                setErrorVolumeR(true)
            }
        }catch{
            setErrorVolumeR(true)
        }
    }

    const [date_opr, setDateOpR] = useState()
    const [errorDateOpR, setErrorDateOpR] = useState(true)
    const onChangeDateOpR = (value)=>{
        var date = new Date(value)
        setDateOpR(date.getDate()+'-'+(parseInt(date.getMonth())+1) +'-'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes())
        setErrorDateOpR(false)
    }

    const disabledr = ( errorVolumeR | errorDateOpR) ? true : false

    const savereception = async ()=>{
        setLoading(true)
        const params = {
            volume_receptionned: volumer,
            date_recep: date_opr,
            end: 'career',
            detail: true,
            terminaison: 'sale',
            id: selection.uuid,
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
            data.statut = (data.status == 1)? 'ENCOURS' : 'LIVRÉ'
            data.depart = (data.type_sale == 1 | data.type_sale == 2) ? data.stockage_aera.name : data.stockage_partner.name
            data.arrivee = (data.type_sale != 3) ?  data.destination : data.stockage_partner.name
            data.tractor_name = data.tractor.registration
            data.trailer_name= data.trailer.registration
            data.id = rows.length + 1
            data.statut = "ENCOURS"
            var d = []
            d.push(data)
            sales.forEach(item=>{
                if(item.uuid != data.uuid){
                    d.push(item)
                }
            })
            setSeverity("success")
            setMessage("sale has been receptionned")
            setOpen(true)
            setSales(d)
        }else{
            if(data.hasOwnProperty("date_recep")){
                setErrorDateOpR(true)
                setSeverity("error")
                setMessage(data.date_recep[0])
                setOpen(true) 
            }if(data.hasOwnProperty("volume_receptionned")){
                setErrorVolumeR(true)
                setSeverity("error")
                setMessage(data.volume_receptionned[0])
                setOpen(true) 
            }if(data.hasOwnProperty("non_field_errors")){
                setSeverity("error")
                setMessage(data.non_field_errors[0])
                setOpen(true) 
            }
        }
    }

    const listMenu = [
        {
            id : "m",
            icon : <ModeIcon />,
            label : "Réception",
            callback : reception
        },
    ]

    const [isForm, setForm] = useState(1)
    const [loading, setLoading] = useState(false)

    const [open, setOpen] = useState(false)
    const handleClose = ()=>{
        setOpen(false)
    }
    const [message, setMessage] = useState("new tractor is being added")
    const [severity, setSeverity] = useState("success")
    
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
                    <ControlTextInput callback={voidc}  disabled={true} id="hub" label="Hub minier" readOnly={true} required={true} type="text" value={selection.depart} />
                    <ControlTextInput callback={voidc}  disabled={true} id="depot" label="Dépôt de vente" readOnly={true} required={true} type="text" value={selection.arrivee} />
                    <ControlTextInput callback={voidc}  disabled={true} id="article" label="Article" readOnly={true} required={true} type="text" value={selection.product_name} />
                </div>
                <div>
                    <ControlTextInput callback={voidc}  disabled={true} id="tracteur" label="Tracteur" readOnly={true} required={true} type="text" value={selection.tractor_name} />
                    <ControlTextInput callback={voidc}  disabled={true} id="trailer" label="Remorque" readOnly={true} required={true} type="text" value={selection.trailer_name} />
                    <ControlTextInput callback={voidc}  disabled={true} id="volume" label="Volume transferré" readOnly={true} required={true} type="text" value={selection.volume} />
                </div>
                <div>
                    <ControlTextInput callback={voidc}  disabled={true} id="saleslip" label="Bordoreau de vente" readOnly={true} required={true} type="text" value={selection.sale_slip} />
                    <ControlTextInput callback={voidc}  disabled={true} id="driver" label="Chauffeur" readOnly={true} required={true} type="text" value={selection.driver} />
                    <ControlTextInput callback={voidc}  disabled={true} id="destination" label="Destination" readOnly={true} required={true} type="text" value={selection.destination} />
                </div>
                <div>
                    <ControlTextInput callback={voidc}  disabled={true} id="sale" label="Date d'envoi" readOnly={true} required={true} type="text" value={selection.date_op} />
                    {
                        (selection.status == 1) ? 
                        <>
                            <TextInput required={true} id='volumer' error={errorVolumeR} label="Volume réceptionné" callback={onChangeVolumeR} value={volumer} />
                            <DateTimeInput label="Date de reception" disableFuture={true} callback={onChangeDateOpR} />
                        </>:undefined
                    }
                </div>
                <div>
                    <Stack direction="row" spacing={3}>
                        {
                            (selection.status == 1) ? <SimpleButton label="réceptionner" endIcon={<SendIcon />} color="success" callback={savereception} size='medium' loading={loading} disabled={disabledr} /> : undefined
                        }
                        <SimpleButton label="fermer" endIcon={<CancelIcon />} color='primary' callback={close} size='medium' />
                    </Stack>
                </div>
                <Toast open={open} message={message} severity={severity} handleClose={handleClose} />
            </Box>
            )

    }else if(isForm == 2){
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
                <AutoSelect callback={onChangeSelectionVente} label='Type de vente' data={dvente} />
                <AutoSelect callback={onChangeSelectionStockage} label='Hub Minier' data={dstockage} />
                <AutoSelect callback={onChangeSelectionPartner} label='Dépot de vente' data={dpartnerts} />
            </div>
            <div>
                <AutoSelect callback={onChangeSelectionArticle} label='Article' data={darticles} />
                <AutoSelect callback={onChangeSelectionTractor} label='Tracteur' data={dtractors} />
                <AutoSelect callback={onChangeSelectionTrailer} label='Remorque' data={dtrailers} />
            </div>
            <div>
                <TextInput required={true} id='volume' error={errorVolume} label="Volume" callback={onChangeVolume} value={volume} />
                <TextInput required={true} id='price' error={errorPrice} label="Prix unitaire de vente" callback={onChangePrice} value={price} />
                <TextInput required={true} id='sale_slip' error={errorSaleSlip} label="Bordoreau de vente" callback={onChangeSaleSlip} value={saleSlip} />
            </div>
            <div>
                <TextInput required={true} id='driver' error={errorDriver} label="Nom du chauffeur" callback={onChangeDriver} value={driver} />
                <TextInput required={true} id='destination' error={errorDestination} label="Destination" callback={onChangeDestination} value={destination} />
                <DateTimeInput label="Date de vente" disableFuture={true} callback={onChangeDateOp} />
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
                <FloatingActionButton callback={addSale} />
            </>
        );
    }
  
}
