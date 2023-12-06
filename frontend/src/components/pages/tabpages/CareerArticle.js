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

export default function CareerArticle() {
    const {headers} = useContext(AUTHCONTEXT)
    const {
        careers,setCareers,
        articles, setArticles,
        stockages, setStockages,
        careerarticles, setCareerarticles
    } = useContext(AUTHCONTEXT)
    
    // columns d'entête
    var columns = [
        {
            id: 'id',
            label: 'ID',
        },
        {
            id: 'carriere',
            label: 'Carrière',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'product',
            label: "Article",
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'aera',
            label: "Aire de stockage",
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
    var rows = careerarticles

    var data_careers = careers
    
    var data_articles = articles

    var data_stockages = stockages

    const [action, setAction] = useState("create")
    const addCareerArticle = ()=>{
        setForm(true)
        setAction("create")
    }
    const close = ()=>{
        setForm(false)
    }

    const save = async ()=>{
        setLoading(true)
        const params = {
            career_id: career,
            article_id: article,
            stockage_id: stockage,
            price_sale: price_sale,
            price_car: price_car
        }
        const request = new Request(
            "/careerarticle",
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
            data.carriere = data.career.name
            data.product = data.article.name
            data.aera = data.stockage.name
            var d = []
            d.push(data)
            careerarticles.forEach(item=>{
                if(item.uuid != data.uuid){
                    d.push(item)
                }
            })
            setSeverity("success")
            setMessage("career + article has been successfully associated ")
            setOpen(true)
            setCareerarticles(d)
        }
    }

    const [isForm, setForm] = useState(false)
    const [loading, setLoading] = useState(false)

    const [career, setCareer] = useState()
    const [errorCareer, setErrorCareer] = useState(true)
    const onChangeCareer = (value)=>{
        setCareer(value)
        setErrorCareer(false)
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

    const disabled = (errorCareer | errorArticle | errorStockage | errorPriceCar | errorPriceSale) ? true : false
    
    if(isForm){
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
                <SelectInput callback={onChangeArticle} data={data_articles} id='article' defaultValue={1} label="Articles" required={true} />
                <SelectInput callback={onChangeStockage} data={data_stockages} id='stockage' defaultValue={1} label="Aire de stockage" required={true} />
                <TextInput required={true} id='price_sale' error={errorPriceSale} label="Prix d'achat" callback={onChangePriceSale} value={price_sale} />
                <TextInput required={true} id='price_car' error={errorPriceCar} label="Prix du transport" callback={onChangePriceCar} value={price_car} />
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
            <MyTable columns={columns} rows={rows}  action={false} />
            <FloatingActionButton callback={addCareerArticle} />
        </>
        );
    }
  
}
