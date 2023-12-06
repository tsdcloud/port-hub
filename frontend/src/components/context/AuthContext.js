import React, { Component, createContext, useState, useEffect } from "react";
import Logo from "../utils/Logo";
const axios = require('axios');
const cheerio = require('cheerio');

export const AUTHCONTEXT = createContext()

export default function AuthProvider (props){

  const [csrftoken,setCsrftoken] = useState()

  const [user,setUser] = useState({member:{is_superuser:false, user_permissions:[]}})
  const [entities,setEnties] = useState([])
  const [branches,setBranches] = useState([])
  const [services,setServices] = useState([])
  const [functions,setFunctions] = useState([])
  const [categories,setCategories] = useState([])
  const [articles,setArticles] = useState([])
  const [stockages,setStockages] = useState([])
  const [careers,setCareers] = useState([])
  const [stockageaeralv,setStockageaeralv] = useState([])
  const [careerlv,setCareerlv] = useState([])
  const [careerarticles,setCareerarticles] = useState([])
  const [stockagepartnerarticles,setStockagePartnerArticles] = useState([])
  const [depots,setDepots] = useState([])
  const [stockagepartners,setStockagePartners] = useState([])
  const [tractors,setTractors] = useState([])
  const [trailers,setTrailers] = useState([])
  const [transfers,setTransfers] = useState([])
  const [sales,setSales] = useState([])
  const [countries,setCountries] = useState([])
  const [regions,setRegions] = useState([])
  const [departments,setDepartments] = useState([])
  const [communes,setCommunes] = useState([])
  const [villages,setVillages] = useState([])
  
  const headers =  {
    'X-CSRFToken': csrftoken
  }

  const getInfoUser = ()=>{
    const request = new Request('/user',{
      method : "GET"
    })
    fetch(request).then(
      res=>res.json().then(
        data=>{setUser(data)}
      ))
  }

  const getCsrftoken = async ()=> {
    try {
      const response = await axios.get('/home');
      const $ = cheerio.load(response.data);
      setCsrftoken($('[name=csrfmiddlewaretoken]')[0].attribs.value)
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
          item.img = item.logo
          item.logo = <Logo width={70} logo={item.logo}/>
          item.uuid = item.id
          item.value = item.id
          item.key = item.business_name
          item.id = i
          i++
        })
        setEnties(results)
        // setTimeout(()=>{getBranches(2)},20000)
      }
      
    }))
  }

  const getBranches = async (i=1)=>{
    const request = new Request(
      "/api?end=entity&detail=0&terminaison=branch",
      {
        method: "GET",
        headers: headers
      }
    )
    fetch(request).then(res=>res.json().then(data=>{
      if(data.code == -1){
        setTimeout(()=>{getBranches(i+1)},i*20000)
      }else{
        const results = data.results
        var i = 1
        results.forEach(item=>{
          item.uuid = item.id
          item.value = item.id
          item.key = item.label
          item.id = i
          i++
          item.origine = item.origin.label
          item.entity = item.firm.business_name
          item.option = item.firm.id
        })
        setBranches(results)
      }
    }))
  }

  const getServices = async (i=1)=>{
    const request = new Request(
      "/api?end=entity&detail=0&terminaison=service",
      {
        method: "GET",
        headers: headers
      }
    )
    fetch(request).then(res=>res.json().then(data=>{
      if(data.code == -1){
        setTimeout(()=>{getServices(i+1)},i*20000)
      }else{
        const results = data.results
        var i = 1
        results.forEach(item=>{
          item.uuid = item.id
          item.value = item.id
          item.key = item.name
          item.id = i
          i++
          item.branche = item.branch.label
          item.option = item.branch.id
        })
        setServices(results)
      }
    }))
  }

  const getFunctions = async (i=1)=>{
    const request = new Request(
      "/api?end=entity&detail=0&terminaison=function",
      {
        method: "GET",
        headers: headers
      }
    )
    fetch(request).then(res=>res.json().then(data=>{
      if(data.code == -1){
        setTimeout(()=>{getFunctions(i+1)},i*20000)
      }else{
        const results = data.results
        var i = 1
        results.forEach(item=>{
          item.uuid = item.id
          item.value = item.id
          item.key = item.name
          item.id = i
          i++
          item.servi = item.service.name
          item.option = item.service.id
        })
        setFunctions(results)
      }
    }))
  }

  const getCategories = async (i=1)=>{
    const request = new Request(
      "/categorie",
      {
        method: "GET",
        headers: headers
      }
    )
    fetch(request).then(res=>res.json().then(data=>{
      if(data.code == -1){
        setTimeout(()=>{getCategories(i+1)},i*20000)
      }else{
        const results = data.results
        var i = 1
        results.forEach(item=>{
          item.uuid = item.id
          item.value = item.id
          item.key = item.name
          item.id = i
          i++
        })
        setCategories(results)
      }
    }))
  }

  const getArticles = async (i=1)=>{
    const request = new Request(
      "/article",
      {
        method: "GET",
        headers: headers
      }
    )
    fetch(request).then(res=>res.json().then(data=>{
      if(data.code == -1){
        setTimeout(()=>{getArticles(i+1)},i*20000)
      }else{
        const results = data.results
        var i = 1
        results.forEach(item=>{
          item.uuid = item.id
          item.value = item.id
          item.key = item.name
          item.id = i
          i++
          item.option = item.categorie.id
          item.cat = item.categorie.name
        })
        setArticles(results)
      }
    }))
  }

  const getStockages = async (i=1)=>{
    const request = new Request(
      "/stockageaera",
      {
        method: "GET",
        headers: headers
      }
    )
    fetch(request).then(res=>res.json().then(data=>{
      if(data.code == -1){
        setTimeout(()=>{getStockages(i+1)},i*20000)
      }else{
        const results = data.results
        var i = 1
        results.forEach(item=>{
          item.uuid = item.id
          item.value = item.id
          item.key = item.name
          item.id = i
          i++
          item.option = item.village.id
          item.vil = item.village.name
        })
        setStockages(results)
      }
    }))
  }

  const getCareers = async (i=1)=>{
    const request = new Request(
      "/career",
      {
        method: "GET",
        headers: headers
      }
    )
    fetch(request).then(res=>res.json().then(data=>{
      if(data.code == -1){
        setTimeout(()=>{getCareers(i+1)},i*20000)
      }else{
        const results = data.results
        var i = 1
        results.forEach(item=>{
          item.uuid = item.id
          item.value = item.id
          item.key = item.name
          item.id = i
          i++
          item.option = item.village.id
          item.vil = item.village.name
          item.status = (item.is_supend) ? "SUSPENDUE" : "ACTIVE"
        })
        setCareers(results)
      }
    }))
  }

  const getStockageaeralv = async (i=1)=>{
    const request = new Request(
      "/stockageaeralv",
      {
        method: "GET",
        headers: headers
      }
    )
    fetch(request).then(res=>res.json().then(data=>{
      if(data.code == -1){
        setTimeout(()=>{getStockageaeralv(i+1)},i*20000)
      }else{
        const results = data.results
        var i = 1
        results.forEach(item=>{
          item.uuid = item.id
          item.id = i
          i++
          item.stockage = item.stockageaera.name
          item.status = (item.is_waiting_approve) ? "EN ATTENTE APPROBATION" : "RAS"
        })
        setStockageaeralv(results)
      }
    }))
  }

  const getCareerlv = async (i=1)=>{
    const request = new Request(
      "/careerlv",
      {
        method: "GET",
        headers: headers
      }
    )
    fetch(request).then(res=>res.json().then(data=>{
      if(data.code == -1){
        setTimeout(()=>{getCareerlv(i+1)},i*20000)
      }else{
        const results = data.results
        var i = 1
        results.forEach(item=>{
          item.uuid = item.id
          item.id = i
          i++
          item.career = item.career.name
          item.status = (item.is_waiting_approve) ? "EN ATTENTE APPROBATION" : "RAS"
        })
        setCareerlv(results)
      }
    }))
  }

  const getCareerarticles = async (i=1)=>{
    const request = new Request(
      "/careerarticle",
      {
        method: "GET",
        headers: headers
      }
    )
    fetch(request).then(res=>res.json().then(data=>{
      if(data.code == -1){
        setTimeout(()=>{getCareerarticles(i+1)},i*20000)
      }else{
        const results = data.results
        var i = 1
        results.forEach(item=>{
          item.uuid = item.id
          item.id = i
          i++
          item.carriere = item.career.name
          item.product = item.article.name
          item.aera = item.stockage.name
        })
        setCareerarticles(results)
      }
    }))
  }

  const getDepots = async (i=1)=>{
    const request = new Request(
      "/api?end=career&detail=0&terminaison=depot",
      {
        method: "GET",
        headers: headers
      }
    )
    fetch(request).then(res=>res.json().then(data=>{
      if(data.code == -1){
        setTimeout(()=>{getCareerarticles(i+1)},i*20000)
      }else{
        const results = data.results
        var i = 1
        results.forEach(item=>{
          item.uuid = item.id
          item.id = i
          i++
          item.career_name = item.career.name
        })
        setDepots(results)
      }
    }))
  }

  const getStockagePartners = async (i=1)=>{
    const request = new Request(
      "/api?end=career&detail=0&terminaison=stockagepartner",
      {
        method: "GET",
        headers: headers
      }
    )
    fetch(request).then(res=>res.json().then(data=>{
      if(data.code == -1){
        setTimeout(()=>{getCareerarticles(i+1)},i*20000)
      }else{
        const results = data.results
        var i = 1
        results.forEach(item=>{
          item.uuid = item.id
          item.value = item.id
          item.key = item.name
          item.village_name = item.village.name
          item.firm_name = item.firm.business_name
          item.id = i
          i++
        })
        setStockagePartners(results)
      }
    }))
  }

  const getTractors = async (i=1)=>{
    const request = new Request(
      "/api?end=career&detail=0&terminaison=tractor",
      {
        method: "GET",
        headers: headers
      }
    )
    fetch(request).then(res=>res.json().then(data=>{
      const results = data.results
      var i = 1
      results.forEach(item=>{
        item.uuid = item.id
        item.value = item.id
        item.status = (item.is_used) ? "BUSY" : "FREE"
        item.id = i
        i++
      })
      setTractors(results)
    }))
  }

  const getTrailers = async (i=1)=>{
    const request = new Request(
      "/api?end=career&detail=0&terminaison=trailer",
      {
        method: "GET",
        headers: headers
      }
    )
    fetch(request).then(res=>res.json().then(data=>{
      const results = data.results
      var i = 1
      results.forEach(item=>{
        item.uuid = item.id
        item.value = item.id
        item.status = (item.is_used) ? "BUSY" : "FREE"
        item.id = i
        i++
      })
      setTrailers(results)
    }))
  }

  const getTransfers = async (i=1)=>{
    const request = new Request(
      "/api?end=career&detail=0&terminaison=transfer",
      {
        method: "GET",
        headers: headers
      }
    )
    fetch(request).then(res=>res.json().then(data=>{
      const results = data.results
      var i = 1
      results.forEach(item=>{
        item.uuid = item.id
        item.value = item.id
        item.tractor_name = item.tractor.registration
        item.trailer_name = item.trailer.registration
        item.depot_name = item.depot.numero
        item.career_name = item.career.name
        item.stockage_name = item.stockageaera.name

        if(item.status==1){
          item.statut = 'ENCOURS'
        }else if(item.status==2){
          item.statut = 'RECEPTIONNÉ'
        }else if(item.status==3){
          item.statut = 'PARTIELLEMENT APPURÉ'
        }else if(item.status==4){
          item.statut = 'APPURÉ'
        }else{
          item.statut = 'UNKNOW'
        }
        item.id = i
        i++
      })
      setTransfers(results)
    }))
  }

  const getStockagePartnerArticle = async (i=1)=>{
    const request = new Request(
      "/api?end=career&detail=0&terminaison=stockagepartnerarticle",
      {
        method: "GET",
        headers: headers
      }
    )
    fetch(request).then(res=>res.json().then(data=>{
      const results = data.results
      var i = 1
      results.forEach(item=>{
        item.uuid = item.id
        item.stockage_name = item.stockage.name
        item.stockage_partner_name = item.stockage_partner.name
        item.article_name = item.article.name
        item.id = i
        i++
      })
      setStockagePartnerArticles(results)
    }))
  }

  const getSales = async (i=1)=>{
    const request = new Request(
      "/api?end=career&detail=0&terminaison=sale",
      {
        method: "GET",
        headers: headers
      }
    )
    fetch(request).then(res=>res.json().then(data=>{
      const results = data.results
      var i = 1
      results.forEach(item=>{
        item.uuid = item.id
        item.statut = (item.status == 1)? 'ENCOURS' : 'LIVRÉ'
        item.depart = (item.type_sale == 1 | item.type_sale == 2) ? item.stockage_aera.name : item.stockage_partner.name
        item.arrivee = (item.type_sale != 3) ?  item.destination : item.stockage_partner.name
        item.tractor_name = item.tractor.registration
        item.trailer_name= item.trailer.registration
        item.id = i
        i++
      })
      setSales(results)
    }))
  }

  const getCountries = async (i=1)=>{
    const request = new Request(
      "/api?end=entity&detail=0&terminaison=country",
      {
        method: "GET",
        headers: headers
      }
    )
    fetch(request).then(res=>res.json().then(data=>{
      if(data.code == -1){
        setTimeout(()=>{getVillages(i+1)},i*20000)
      }else{
        const results = data.results
        var i = 1
        results.forEach(item=>{
          item.uuid = item.id
          item.id = i
          i++
        })
        setCountries(results)
      }
    }))
  }

  const getRegions = async (i=1)=>{
    const request = new Request(
      "/api?end=entity&detail=0&terminaison=region",
      {
        method: "GET",
        headers: headers
      }
    )
    fetch(request).then(res=>res.json().then(data=>{
      if(data.code == -1){
        setTimeout(()=>{getVillages(i+1)},i*20000)
      }else{
        const results = data.results
        var i = 1
        results.forEach(item=>{
          item.uuid = item.id
          item.id = i
          item.country_name = item.country.name
          i++
        })
        setRegions(results)
      }
    }))
  }

  const getDepartments = async (i=1)=>{
    const request = new Request(
      "/api?end=entity&detail=0&terminaison=department",
      {
        method: "GET",
        headers: headers
      }
    )
    fetch(request).then(res=>res.json().then(data=>{
      if(data.code == -1){
        setTimeout(()=>{getVillages(i+1)},i*20000)
      }else{
        const results = data.results
        var i = 1
        results.forEach(item=>{
          item.uuid = item.id
          item.id = i
          item.region_name = item.region.name
          i++
        })
        setDepartments(results)
      }
    }))
  }

  const getCommunes = async (i=1)=>{
    const request = new Request(
      "/api?end=entity&detail=0&terminaison=municipality",
      {
        method: "GET",
        headers: headers
      }
    )
    fetch(request).then(res=>res.json().then(data=>{
      if(data.code == -1){
        setTimeout(()=>{getVillages(i+1)},i*20000)
      }else{
        const results = data.results
        var i = 1
        results.forEach(item=>{
          item.uuid = item.id
          item.id = i
          item.department_name = item.department.name
          i++
        })
        setCommunes(results)
      }
    }))
  }

  const getVillages = async (url="/api?end=entity&detail=0&terminaison=village")=>{
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
      const next = data.next
      results.forEach(item=>{
        item.uuid = item.id
        item.value = item.id
        item.key = item.name
        item.municipality_name = item.municipality.name
        item.id = i
        i++
        villages.push(item)
      })
      setVillages(villages)
      if(next != null){
        var page = next.split('?page=')
        url = "/api?end=entity&detail=false&terminaison=village&page=" + page[1]
        getVillages(url)
      }
    }))
  }

  useEffect(() => {
    getCsrftoken()
    getEnities()
    getInfoUser()
    getBranches()
    getServices()
    getFunctions()
    getCategories()
    getArticles()
    getStockages()
    getCareers()
    getStockageaeralv()
    getCareerlv()
    getCareerarticles()
    getVillages()
    getDepots()
    getStockagePartners()
    getTractors()
    getTrailers()
    getTransfers()
    getStockagePartnerArticle()
    getSales()
    getCountries()
    getRegions()
    getDepartments()
    getCommunes()
  }, [])

  return (
    <AUTHCONTEXT.Provider value={{
      user, setUser,
      entities, setEnties, getEnities,
      branches, setBranches, getBranches,
      services, setServices,
      functions, setFunctions,
      categories, setCategories,
      articles, setArticles,
      stockages, setStockages,
      careers, setCareers,
      stockageaeralv, setStockageaeralv,
      careerlv, setCareerlv,
      careerarticles, setCareerarticles,
      depots, setDepots,
      stockagepartners,setStockagePartners,getStockagePartners,
      tractors, setTractors,
      trailers, setTrailers,
      transfers, setTransfers,
      stockagepartnerarticles, setStockagePartnerArticles,
      sales, setSales,
      countries, setCountries, getCountries,
      regions, setRegions, getRegions,
      departments, setDepartments, getDepartments,
      communes, setCommunes, getCommunes,
      villages, setVillages, getVillages,
      csrftoken, headers
    }}>
        {
            props.children
        }
    </AUTHCONTEXT.Provider>
  );
}