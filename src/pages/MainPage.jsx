import { useOutletContext } from "react-router-dom";
import { InfiniteScroll } from "../components/ui/InfiniteScroll";
import { Pagination } from "../components/ui/Pagination";
export const MainPage = () => {
    const { pokeSearch ,infinite , sort  } = useOutletContext();
    //* Infinite scrolling
    if(infinite) return <InfiniteScroll pokeSearch={pokeSearch} sort={sort} />
    //*Page code 
    else return <Pagination pokeSearch={pokeSearch} sort={sort} />
}