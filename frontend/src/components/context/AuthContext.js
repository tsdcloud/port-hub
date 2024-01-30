import React, { Component, createContext, useState, useEffect } from "react";
import { StyleSheet } from '@react-pdf/renderer';
import Logo from "../utils/Logo";
const axios = require('axios');
const cheerio = require('cheerio');
import ModeIcon from '@mui/icons-material/Mode';

export const AUTHCONTEXT = createContext()

export default function AuthProvider (props){

  const [csrftoken,setCsrftoken] = useState()

  const [user,setUser] = useState({member:{is_superuser:false, user_permissions:[]}})
  const [entities,setEnties] = useState([])
  const [global_settings,setGlobalSettings] = useState([])
  const [permissions, setPermissions] = useState([])
  const [peseesDP, setPeseesDP] = useState([])
  const [peseesLI, setPeseesLI] = useState([])
  var dpesees = new Array()
  const [peseeNotificationAccount, setPeseeNotificationAccount] = useState([])
  var dpesee_notification_account = new Array()
  
  const headers =  {
    "X-Requested-With": "XMLHttpRequest",
    'X-CSRFToken': csrftoken
  }

  const PATTERN_EMAIL = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

  const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      display: 'flex',
      justifyContent: "space-between"
    },
    rowReverse: {
      flexDirection: 'row-reverse',
    },
    column: {
      flexDirection: 'column'
    },
    columnReverse: {
      flexDirection: 'column-reverse'
    },
    section: {
      margin: 3,
      padding: 5,
      display: "flex",
      justifyContent: "space-between"
    },
    right: {
      textAlign: 'right',
    },
    left: {
      textAlign: 'left',
    },
    center: {
      textAlign: 'center',
    },
    sizeSmall: {
      fontSize: 6,
    },
    sizeNormal: {
      fontSize: 10,
    },
    wrap: {
      wrap: true,
    },
    form: {
      display:'flex', 
      flexDirection:'row', 
      flexWrap:'wrap', 
      justifyContent:'space-between', 
      alignItems:'center'
    }
  });

  const getInfoUser = async ()=>{
    const request = new Request('/user',{
      method : "GET"
    })
    let response = await fetch(request)
    let data = await response.json()
    if(response.status == 200){
      setUser(data)
    }else{
      window.location.href = "/logout"
    }
  }

  const getCsrftoken = async ()=> {
    var csrf = document.querySelector("input[name=csrfmiddlewaretoken]").value
    setCsrftoken(csrf)
    try {
      const response = await axios.get('/home');
      const $ = cheerio.load(response.data);
      //setCsrftoken($('[name=csrfmiddlewaretoken]')[0].attribs.value)
    } catch (error) {
      console.log(error);
    }
  }

  const getEnities = async (i=1)=>{
    const request = new Request(
      "/api?end=entity&detail=0&terminaison=firm",
      {
        method: "GET",
        headers: headers
      }
    )
    fetch(request).then(res=>res.json().then(data=>{
      if(data.code == -1){
        setTimeout(()=>{getEnities(i++)},i*20000)
      }else{
        const results = data.results
        var i = 1
        results.forEach(item=>{
          item.img = <Logo width={70} logo={item.logo}/>
          item.value = item.id
          item.label = item.business_name
        })
        setEnties(results)
      }
      
    }))
  }

  const getGlobalSetting = async (url="/api?end=port&detail=0&terminaison=pesee")=>{
    const request = new Request(
      url,
      {
        method: "GET",
        headers: headers
      }
    )
    fetch(request).then(res=>res.json().then(data=>{
      const results = data.results
      var i = 1
      results.forEach(item=>{
        item.line_maritime = item.line.business_name
        global_settings.push(item)
      })
      setGlobalSettings(global_settings)
      const next = data.next
      if(next != null){
        var page = next.split('?page=')
        url = "/api?end=port&detail=false&terminaison=pesee&page=" + page[1]
        getGlobalSetting(url)
      }
    }))
  }

  const getPermissions = async (url="/api?end=entity&detail=0&terminaison=employee&action=permissions")=>{
    const request = new Request(
      url,
      {
        method: "GET",
        headers: headers
      }
    )
    fetch(request).then(res=>res.json().then(data=>{
      setPermissions(data.permissions)
    }))
  }

  const getPeseesDP = async (url="/api?end=port&detail=0&terminaison=dp")=>{
    const request = new Request(
      url,
      {
        method: "GET",
        headers: headers
      }
    )
    fetch(request).then(res=>res.json().then(data=>{
      const results = data.results
      results.forEach(item=>{
        item.action = <ModeIcon />
        dpesees.push(item)
      })
      setPeseesDP(dpesees)
      const next = data.next
      if(next != null){
        var page = next.split('?page=')
        url = "/api?end=port&detail=false&terminaison=dp&page=" + page[1]
        getPeseesDP(url)
      }
    }))
  }

  const getPeseesLI = async (url="/api?end=port&detail=0&terminaison=line")=>{
    const request = new Request(
      url,
      {
        method: "GET",
        headers: headers
      }
    )
    fetch(request).then(res=>res.json().then(data=>{
      const results = data.results
      results.forEach(item=>{
        peseesLI.push(item)
      })
      setPeseesLI(peseesLI)
      const next = data.next
      if(next != null){
        var page = next.split('?page=')
        url = "/api?end=port&detail=false&terminaison=line&page=" + page[1]
        getPeseesDP(url)
      }
    }))
  }

  const getPeseeNotificationAccount = async (url="/api?end=port&detail=0&terminaison=peseenotif")=>{
    const request = new Request(
      url,
      {
        method: "GET",
        headers: headers
      }
    )
    fetch(request).then(res=>res.json().then(data=>{
      const results = data.results
      console.log(results)
      console.log(data)
      results.forEach(item=>{
        item.business_name = item.line.business_name
        item.acronym = item.line.acronym
        item.label = item.email + " -#- " + item.business_name
        item.value = item.id
        item.type_receive = (item.only == 1) ? "Spécifique" : "Toutes"
        dpesee_notification_account.push(item)
      })
      setPeseeNotificationAccount(dpesee_notification_account)
      const next = data.next
      if(next != null){
        var page = next.split('?page=')
        url = "/api?end=port&detail=false&terminaison=peseenotif&page=" + page[1]
        getPeseeNotificationAccount(url)
      }
    }))
  }

  useEffect(() => {
    getCsrftoken()
    getEnities()
    getInfoUser()
    getGlobalSetting()
    getPermissions()
    getPeseesDP()
    getPeseesLI()
    getPeseeNotificationAccount()
  }, [])

  return (
    <AUTHCONTEXT.Provider value={{
      user, setUser,
      entities, setEnties, getEnities,
      global_settings, setGlobalSettings, getGlobalSetting,
      permissions, setPermissions, getPermissions,
      peseesDP, setPeseesDP, getPeseesDP,
      peseeNotificationAccount, setPeseeNotificationAccount, getPeseeNotificationAccount,
      csrftoken, headers, styles, 
      PATTERN_EMAIL,dpesee_notification_account,
      peseesLI, setPeseesLI, getPeseesLI
    }}>
        {
            props.children
        }
    </AUTHCONTEXT.Provider>
  );
}