import { Outlet } from "react-router-dom"
import { Header } from "./Header"
import { Footer } from "./Footer"
import {  useState } from "react"

export const AppLayout = ()=>{
    const [pokeSearch,setPokeSearch] = useState("")
    const [infinite ,setInfinite ]=useState(true);
    const [sort,setSort] = useState({
        sortOrder:"default",
        sortBy:"id",
        sortType:"all",
        sortGen:"all"
    });
    const handleDisplay = (data)=>{
        setInfinite(data);
    }
    return <>
    <Header  className="app-header" pokeSearch={pokeSearch} sort={sort} setSort ={setSort} setPokeSearch={setPokeSearch} infinite={infinite} setInfinite ={handleDisplay} />
    <Outlet  context = {{ sort, pokeSearch ,infinite ,setInfinite}} />
    <Footer  />
    </>
}