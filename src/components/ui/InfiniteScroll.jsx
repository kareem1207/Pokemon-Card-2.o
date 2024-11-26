/* eslint-disable react/prop-types */
import {  useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { FetchedDataInfinite } from "../../api/FetchingPokeData";
import { PokemonCards } from "./PokeCArds";
export const InfiniteScroll = ({ pokeSearch , sort }) =>{
    const { data, fetchNextPage, hasNextPage, status, isFetchingNextPage, error } = useInfiniteQuery({
        queryKey: ["pokemon", sort.sortOrder],
        queryFn: ({ pageParam = 0 }) => FetchedDataInfinite(sort, pageParam),
        getNextPageParam: (lastPage) => {
            return lastPage.nextOffset < lastPage.totalCount ? lastPage.nextOffset : undefined;
        },
    });

    const { ref, inView } = useInView({
        threshold: 0.5,
        triggerOnce: false,
    });

    useMemo(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    const flattenedData = useMemo(() => data?.pages.flatMap(page => page.results) || [], [data]);
    const searchContain = flattenedData?.filter((currentPokemon)=>currentPokemon.name.toLowerCase().includes(pokeSearch.toLowerCase()))
    if (status === "loading") return <h1>Loading</h1>;
    if (status === "error") return <h1>Error occurred :{error}</h1>;

    return (
        <>
            <ul className="pokemon-grid">
                {searchContain?.map((post) => (
                    <PokemonCards key={post.id} pokeName={post}  />
                ))}
            </ul>
            <div ref={ref}>
                {isFetchingNextPage && <h1>Loading more...</h1>}
            </div>
        </>
    );
};