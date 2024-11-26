import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useOutletContext, useParams } from "react-router-dom";

export const IndividualPage = ()=>{
    const {id}=useParams();
    const {rgbColor} = useOutletContext();
    const individualDataFetch = async (id)=>{
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
        return response.data;
    }
    const {data , isPending , isError,error} = useQuery({
        queryKey:[`post` , id],
        queryFn: () => individualDataFetch(id),
        staleTime: 1000 * 60 , // 5 minutes
    })
    console.log(data);
    if(isPending) return <p>Loading....</p>
    if(isError) return <p>Found this error : {error.message}</p>
    return <>
    <h1>{data.name}</h1>
    <img src={data.sprites.other.dream_world.front_default || data.sprites.front_default}  alt={`Pokemon name is :${data.name} as of now no image is found`} style={{height:50}}/>
    <p>Weight : {data.weight}</p>
    <p>Height : {data.height}</p>
    </>
}