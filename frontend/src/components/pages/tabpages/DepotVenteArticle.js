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



import { useState, useEffect, useContext } from "react";

export default function DepotVenteArticle() {
    const {headers} = useContext(AUTHCONTEXT)
    const {
        stockagepartnerarticles,
        stockagepartners,articles,
        stockages,setStockagePartnerArticles
    } = useContext(AUTHCONTEXT)
    
    // columns d'entête
    var columns = [
        {
            id: 'id',
            label: 'ID',
        },
        {
            id: 'stockage_partner_name',
            label: 'Dépot de vente',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'article_name',
            label: "Article",
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'stockage_name',
            label: "Hub minier",
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'price_sale',
            label: "Prix d'achat",
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'price_car',
            label: "Prix du transport",
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
    ]

    // lignes du tableau
    var rows = stockagepartnerarticles

    const addStockagePartnerArticle = ()=>{
        setForm(2)
    }
    const close = ()=>{
        setForm(1)
    }

    const save = async ()=>{
        setLoading(true)
        const params = {
            stockage_partner_id: stockagepartner,
            article_id: article,
            stockage_id: stockage,
            price_car: price_car,
            price_sale: price_sale,
            end: 'career',
            detail: false,
            terminaison: 'stockagepartnerarticle',
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
            data.stockage_name = data.stockage.name
            data.stockage_partner_name = data.stockage_partner.name
            data.article_name = data.article.name
            stockagepartnerarticles.push(data)
            setSeverity("success")
            setMessage("association has been added successfully")
            setOpen(true)
            setStockagePartnerArticles(stockagepartnerarticles)
        }else{
            if(data.hasOwnProperty("stockage_partner_id")){
                setErrorStockagePartner(true)
                setSeverity("error")
                setMessage(data.stockage_partner_id[0])
                setOpen(true) 
            }
            if(data.hasOwnProperty("article_id")){
                setErrorArticle(true)
                setSeverity("error")
                setMessage(data.article_id[0])
                setOpen(true) 
            }
            if(data.hasOwnProperty("stockage_id")){
                setErrorStockage(true)
                setSeverity("error")
                setMessage(data.stockage_id[0])
                setOpen(true) 
            }
            if(data.hasOwnProperty("price_sale")){
                setErrorPriceSale(true)
                setSeverity("error")
                setMessage(data.price_sale[0])
                setOpen(true) 
            }
            if(data.hasOwnProperty("price_car")){
                setErrorPriceCar(true)
                setSeverity("error")
                setMessage(data.price_car[0])
                setOpen(true) 
            }
        }
    }

    const [isForm, setForm] = useState(1)
    const [loading, setLoading] = useState(false)

    const [stockagepartner, setStockagePartner] = useState()
    const [errorStockagePartner, setErrorStockagePartner] = useState(true)
    const onChangeStockagePartner = (value)=>{
        setStockagePartner(value)
        setErrorStockagePartner(false)
    }

    const [article, setArticle] = useState()
    const [errorArticle, setErrorArticle] = useState(true)
    const onChangeArticle = (value)=>{
        setArticle(value)
        setErrorArticle(false)
    }

    const [stockage, setStockage] = useState()
    const [errorStockage, setErrorStockage] = useState(true)
    const onChangeStockage = (value)=>{
        setStockage(value)
        setErrorStockage(false)
    }

    const [price_sale, setPriceSale] = useState()
    const [errorPriceSale, setErrorPriceSale] = useState(true)
    const onChangePriceSale = (value)=>{
        try{
            if(parseInt(value) > 1){
                setPriceSale(value)
                setErrorPriceSale(false)
            }else{
                setErrorPriceSale(true)
            }
        }catch{
            setErrorPriceSale(true)
        }
    }

    const [price_car, setPriceCar] = useState()
    const [errorPriceCar, setErrorPriceCar] = useState(true)
    const onChangePriceCar = (value)=>{
        try{
            if(parseInt(value) > 1){
                setPriceCar(value)
                setErrorPriceCar(false)
            }else{
                setErrorPriceCar(true)
            }
        }catch{
            setErrorPriceCar(true)
        }
    }

    const [open, setOpen] = useState(false)
    const handleClose = ()=>{
        setOpen(false)
    }
    const [message, setMessage] = useState("new association is being added")
    const [severity, setSeverity] = useState("success")

    const disabled = (errorStockagePartner | errorArticle | errorStockage | errorPriceSale | errorPriceCar) ? true : false
    
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
                <SelectInput callback={onChangeStockagePartner} data={stockagepartners} id='stockagepartner' defaultValue={1} label="Dépôt de vente" required={true} />
                <SelectInput callback={onChangeArticle} data={articles} id='article' defaultValue={1} label="Articles" required={true} />
                <SelectInput callback={onChangeStockage} data={stockages} id='stockage' defaultValue={1} label="Hub minier" required={true} />
                <TextInput required={true} id='price_sale' error={errorPriceSale} label="Prix d'achat" callback={onChangePriceSale} value={price_sale} />
                <TextInput required={true} id='price_car' error={errorPriceCar} label="Prix du transport" callback={onChangePriceCar} value={price_car} />
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
            <FloatingActionButton callback={addStockagePartnerArticle} />
        </>
        );
    }
  
}
