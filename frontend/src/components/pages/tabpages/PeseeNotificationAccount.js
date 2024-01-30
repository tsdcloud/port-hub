import * as React from 'react';

import MyTable from '../../utils/MyTable';
import FloatingActionButton from '../../utils/FloatingActionButton';
import { AUTHCONTEXT } from '../../context/AuthContext';

import AutoForm from '../../utils/AutoForm';
import ModeIcon from '@mui/icons-material/Mode';



import { useState, useEffect, useContext } from "react";

export default function PeseeNotificationAccount() {
    const {
        headers, user, permissions, 
        peseeNotificationAccount, setPeseeNotificationAccount, getPeseeNotificationAccount,
        entities, PATTERN_EMAIL,
    } = useContext(AUTHCONTEXT)

    useEffect(() => {
        setRows(peseeNotificationAccount)
    }, [])


    const [columns, setColumns] = useState([
        { field: 'id', headerName: 'ID' ,width: 150, hide: true},
        { field: 'email', headerName: 'Email' ,width: 150},
        { field: 'business_name', headerName: 'Raison sociale' ,width: 150},
        { field: 'acronym', headerName: 'Sigle' ,width: 150},
        { field: 'type_receive', headerName: 'Type de reception' ,width: 150}
    ])

    const [rows, setRows] = useState([])

    const modifier = ()=>{}
    const supprimer = ()=>{}
    const listMenu = [
        {
            id : "modifier",
            icon : <ModeIcon />,
            label : "MODIFIER",
            callback : modifier
        },
        {
            id : "supprimer",
            icon : <ModeIcon />,
            label : "SUPPRIMER",
            callback : supprimer
        }
    ]

    const send = async ()=>{
        setForm(2)
    }

    const sav_create = (data)=>{
        data.business_name = data.line.business_name
        data.acronym = data.line.acronym
        data.type_receive = (data.only == 1) ? "Spécifique" : "Toutes"
        peseeNotificationAccount.push(data)
        setPeseeNotificationAccount(peseeNotificationAccount)
    }

    const [form, setForm] = useState(1)
    const params_pesee_account = [
        {
            label: "Entreprise",
            name: "firm",
            type: "select",
            data: entities
        },
        {
            label: "Adresse Email",
            name: "email",
            type: "email",
            regex: PATTERN_EMAIL,
            disabled: false,
            value: "",
            error: true
        },
        {
            label: "Type de ligne",
            name: "only",
            type: "select",
            data: [{id:1,label:"RECEIVE ONLY"},{id:2, label:"RECEIVE ALL"}]
        },
    ]

    return(
        <>
            {
                (user.member.is_superuser | permissions.includes('add_pesee_notification_account')) ?
                <>
                    <FloatingActionButton callback={send} />    
                </> : null
            }
            {
                (form==1) ?
                    <MyTable columns={columns} rows={rows}  action={false} listmenu={listMenu}/>
                :
                <>
                    <AutoForm 
                        end="port"
                        terminaison="peseenotif"
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
 