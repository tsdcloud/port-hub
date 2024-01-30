import * as React from 'react';

import MyTable from '../../utils/MyTable';
import FloatingActionButton from '../../utils/FloatingActionButton';
import { AUTHCONTEXT } from '../../context/AuthContext';

import FichierInput from '../../utils/FichierInput';
import readXlsxFile from 'read-excel-file'
import ModeIcon from '@mui/icons-material/Mode';
import AutoForm from '../../utils/AutoForm';


import { useState, useEffect, useContext } from "react";

export default function Dp() {
    const {
        headers, user, permissions,
        peseesDP, setPeseesDP, getPeseesDP,
        PATTERN_EMAIL,peseeNotificationAccount
    } = useContext(AUTHCONTEXT)

    useEffect(() => {
        if(peseesDP.length < 1){
            getPeseesDP()
        }
        setRows(peseesDP)
    }, [])

    const [columns, setColumns] = useState([
        /*{ 
            field: 'action', 
            headerName: 'Action' ,
            width: 150,
            sortable: false,
            filterable: false,
            groupable: false,
            aggregable: false,
            disableExport: true
        },*/
        { field: 'statut', headerName: 'Statut' ,width: 150},
        { field: 'id', headerName: 'ID' ,width: 150, hide: true},
        { field: 'numero', headerName: 'Numéro de pesée' ,width: 150},
        { field: 'date1', headerName: 'Date 1' ,width: 150},
        { field: 'vehicule', headerName: 'Véhicule' ,width: 150},
        { field: 'remorque', headerName: 'Remorque' ,width: 150},
        { field: 'date2', headerName: 'Date 2' ,width: 150},
        { field: 'type', headerName: 'Type' ,width: 150},
        { field: 'poids1', headerName: 'Poids 1' ,width: 150},
        { field: 'poids2', headerName: 'Poids 2' ,width: 150},
        { field: 'container', headerName: 'Conteneur' ,width: 150},
        { field: 'tare', headerName: 'Tare' ,width: 150},
        { field: 'masse1', headerName: 'Masse Déclarée' ,width: 150},
        { field: 'masse2', headerName: 'Masse Nette' ,width: 150},
        { field: 'ecart', headerName: 'Ecart' ,width: 150},
        
    ])

    const [rows, setRows] = useState(peseesDP)
    const [select, setSelect] = useState({})

    const callback_read_file = (value) =>{
        var d = []
        readXlsxFile(value).then((rows) => {
            // `rows` is an array of rows
            // each row being an array of cells.
            console.log(rows)
            //setRows(rows)
            console.log('saluet')
            console.log(rows[5])
            var headers = rows[5]
            for(var i=6; i<rows.length;i++){
                if(rows[i][19]!=null && rows[i][19].length>4){
                    var s = rows[i][0]
                    var s2 = rows[i][32]
                    var v = Date.parse("2023-10-31 23:51:42")
                    var v1 = new Date(v)
                    if(v1.getMonth() == 9){
                        var m = parseInt(s.getMonth()) + 1
                    }else{
                        var m = parseInt(s.getMonth())
                    }
                    var d1 = "" + s.getDate() + "-" + m + "-" + s.getFullYear() + " " + s.getHours() + ":" + s.getMinutes() + ":" + s.getSeconds()
                    if(s2!=null){
                        var d2 = "" + s2.getDate() + "-" + m + "-" + s2.getFullYear() + " " + s2.getHours() + ":" + s2.getMinutes() + ":" + s2.getSeconds()
                    }else{
                        var d2 = null
                    }
                    
                    let e = {
                        id: rows[i][30],
                        numero: rows[i][30],
                        date1: d1,
                        vehicule: rows[i][3],
                        remorque: rows[i][4],
                        date2: d2,
                        poids1: rows[i][22],
                        poids2: rows[i][24],
                        container: rows[i][19],
                        type: rows[i][23],
                        tare: rows[i][9],
                    }
                    d.push(e)
                    setRows(d)
                }
            }
            
        })
    }

    const send = async ()=>{
        console.log(rows)
        const params = {
            data:rows,
            end: 'port',
            detail: false,
            terminaison: 'dp',
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
        if(response.status == 201){
            setRows(data.results)
        }
    }

    const notifier = (selection)=>{
        console.log(selection)
        setSelect(selection)
        setForm(2)
    }
    const listMenu = [
        {
            id : "notifier",
            icon : <ModeIcon />,
            label : "Notifier",
            callback : notifier
        }
    ]

    const [form, setForm] = useState(1)
    const sav_create = (data)=>{
        console.log(data)
    }
    const params_pesee_account = [
        {
            label: "Envoyer à",
            name: "status",
            type: "select",
            data: [{id:2, label:"Envoyer à tout le monde"}],
            value: {id:2, label:"Envoyer à tout le monde"},//{id:1, label:"Seul les adresses emails selectionées"},
            multiple: false
        },
        {
            label: "Conteneur",
            name: "conteneur",
            type: "text",
            regex: PATTERN_EMAIL,
            disabled: true,
            value: select.container,
            error: false
        },
        {
            label: "Véhicule",
            name: "vehicule",
            type: "text",
            regex: PATTERN_EMAIL,
            disabled: true,
            value: select.vehicule,
            error: false
        },
        {
            label: "Remorque",
            name: "remorque",
            type: "text",
            regex: PATTERN_EMAIL,
            disabled: true,
            value: select.remorque,
            error: false
        },
        {
            label: "Identifiant de pesée",
            name: "pesee_container",
            type: "text",
            regex: PATTERN_EMAIL,
            disabled: true,
            value: select.id,
            error: false
        },
        {
            label: "Compte à notifier",
            name: "pesee_notification_account",
            type: "select",
            data: peseeNotificationAccount,
            multiple: true
        },
    ]

    return(
        <>
            {
                (form == 1) ?
                <>
                    {
                        (user.member.is_superuser | permissions.includes('add_pesee_container')) ?
                        <>
                            <FichierInput label="Fichier des pesées" callback={callback_read_file} />
                            <FloatingActionButton callback={send} />
                        </> : null
                    }
                    <MyTable columns={columns} rows={rows}  action={false} listmenu={listMenu} />
                </>
                :
                <>
                    <AutoForm 
                        end="port"
                        terminaison="notify"
                        action=""
                        params={params_pesee_account}
                        close={()=>{setForm(1)}}
                        verb="POST"
                        status={201}
                        sav={sav_create}
                    />
                </>
            }
        </>
    );
  
}
