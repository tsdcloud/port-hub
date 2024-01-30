import * as React from 'react';

import MyTable from '../../utils/MyTable';
import FloatingActionButton from '../../utils/FloatingActionButton';
import { AUTHCONTEXT } from '../../context/AuthContext';

import FichierInput from '../../utils/FichierInput';
import readXlsxFile from 'read-excel-file'



import { useState, useEffect, useContext } from "react";

export default function PeseeLine() {
    const {headers, user, permissions, peseesLI} = useContext(AUTHCONTEXT)

    useEffect(() => {
        setRows(peseesLI)
    }, [])


    const [columns, setColumns] = useState([
        { field: 'id', headerName: 'ID' ,width: 150},
        { field: 'date', headerName: 'Date' ,width: 150},
        { field: 'vehicule', headerName: 'Véhicule' ,width: 150},
        { field: 'remorque', headerName: 'Remorque' ,width: 150},
        //{ field: 'poids', headerName: 'Poids net' ,width: 150},
        { field: 'container', headerName: 'Conteneur' ,width: 150},
        { field: 'tare', headerName: 'Tare' ,width: 150},
        { field: 'masse1', headerName: 'Masse Déclarée' ,width: 150},
        { field: 'masse2', headerName: 'Masse Nette' ,width: 150},
        { field: 'ecart', headerName: 'Ecart' ,width: 150},
        { field: 'statut', headerName: 'Statut' ,width: 150},
    ])

    const [rows, setRows] = useState({})

    const callback_read_file = (value) =>{
        var d = []
        readXlsxFile(value).then((rows) => {
            // `rows` is an array of rows
            // each row being an array of cells.
            console.log(rows)
            //setRows(rows)
            console.log('saluet')
            console.log(rows[0])
            for(var i=1; i<rows.length;i++){
                if(rows[i][10]!=null && rows[i][10].length>4){
                    var s = (rows[i][1]!=null) ? rows[i][1] : new Date()
                    var v = Date.parse("2023-10-31 23:51:42")
                    var v1 = new Date(v)
                    if(v1.getMonth() == 9){
                        var m = parseInt(s.getMonth()) + 1
                    }else{
                        var m = parseInt(s.getMonth())
                    }
                    var d1 = "" + s.getDate() + "-" + m + "-" + s.getFullYear() + " " + s.getHours() + ":" + s.getMinutes() + ":" + s.getSeconds()
                    
                    let e = {
                        id: (rows[i][0]!=null) ? rows[i][0] : i,
                        date: d1,
                        vehicule: rows[i][2],
                        remorque: rows[i][3],
                        poids: rows[i][5],
                        container: rows[i][10]
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
            terminaison: 'line',
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
            console.log(data)
            setRows(data.results)
        }
    }

    return(
        <>
            {
                (user.member.is_superuser | permissions.includes('add_declare_container')) ?
                <>
                    <FichierInput label="Fichier des pesées" callback={callback_read_file} />
                    <FloatingActionButton callback={send} />    
                </> : null
            }
            <MyTable columns={columns} rows={rows}  action={false} />
        </>
    );
  
}
