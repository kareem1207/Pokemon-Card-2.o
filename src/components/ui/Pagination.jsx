/* eslint-disable react/prop-types */
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { FetchedDataPage } from "../../api/FetchingPokeData";
import { PokemonCards } from "./PokeCArds";
import { useState } from "react";
export const Pagination = ({ pokeSearch , sort } )=>{
    const limit = 200;
    const [maxPage, setMaxPage] = useState();
    const [pageNumber, setPageNumber] = useState(0);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["posts", pageNumber],
        queryFn: () => FetchedDataPage(sort,pageNumber, setMaxPage),
        placeholderData: keepPreviousData,
        refetchInterval: 1000 * 60 * 5,
        refetchIntervalInBackground: true,
    });

    const totalPages = maxPage ? Math.ceil(maxPage / limit) : 0;
    const searchContain = data?.filter((currentPokemon)=>currentPokemon.name.toLowerCase().includes(pokeSearch.toLowerCase()))
    if (isLoading) return <p>Loading....</p>;
    if (isError) return <p>Found this error: {error.message}</p>;

    return (
        <>
            <ul className="pokemon-grid">
                {searchContain?.map((post) => (
                    <PokemonCards key={post.id} pokeName={post}  />
                ))}
            </ul>
            <div>
                <button
                    disabled={pageNumber === 0}
                    onClick={() => setPageNumber((prev) => Math.max(prev - 1, 0))}
                >
                    Prev
                </button>
                <p>{pageNumber + 1}</p>
                <button
                    disabled={(pageNumber + 1) >= totalPages}
                    onClick={() => setPageNumber((prev) => prev + 1)}
                >
                    Next
                </button>
            </div>
        </>
    );
}