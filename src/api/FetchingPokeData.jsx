import axios from "axios";
import generation from "./generationNumber.json"
const limit = 200;

const apiFetch = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 10000,
    headers: {
        "X-Custom-Header": "foobar",
    },
})

const sortType = (type, names) => {
    if(type ==="all") return names
    else return names.filter((pokemon) => pokemon.types.some((t) => t.type.name === type));
};
const sortGen = (gen, names) => {
    if(gen ==="all") return names
    else return names.filter((pokemon) =>{
        if(pokemon.id>=generation[gen].start && pokemon.id<=generation[gen].end)
            return pokemon
    });
};
const sortByChoice = (sort, names) => {
    if (sort.sortOrder === 'default') return names;
    const sortFunction = (a, b) => {
        if (sort.sortOrder === 'asc') {
            switch (sort.sortBy) {
                case "id":
                    return a.id - b.id;
                    case "name":
                        return a.name.localeCompare(b.name);
                case "base_experience":
                    return a.base_experience - b.base_experience;
                    case "height":
                    return a.height - b.height;
                    case "weight":
                        return a.weight - b.weight;
                        default:
                            return 0;
            }
        } else {
            switch (sort.sortBy) {
                case "id":
                    return b.id - a.id;
                    case "name":
                        return b.name.localeCompare(a.name);
                        case "type":
                            return b.types[0].type.name.localeCompare(a.types[0].type.name);
                            case "base_experience":
                                return b.base_experience - a.base_experience;
                                case "height":
                                    return b.height - a.height;
                                    case "weight":
                                        return b.weight - a.weight;
                                        default:
                                            return 0;
                                        }
                                    }
    };
    return [...names].sort(sortFunction);
};

let allPokemonData = null;

const fetchAllPokemonNames = async () => {
    const response = await apiFetch.get(`?limit=100000`);
    return response.data.results;
};

export const FetchedDataPage = async (sort,pageNumber, setMaxPage) => {
    try {
        const response = await apiFetch.get(`?offset=${pageNumber * limit}&limit=${limit}`);
        setMaxPage(response.data.count);

        const newResponse = await Promise.all(response.data.results.map(async (post) => {
            const detailedResponse = await axios.get(post.url);
            return detailedResponse.data;
        }));
        const typeSorting = sortType(sort.sortType, newResponse);
        const genSorting = sortGen(sort.sortGen, typeSorting);
        const sortedPokemon = sortByChoice(sort, genSorting);
        return sortedPokemon;
    } catch (error) {
        console.error("Error fetching Pokemon data:", error);
        throw error;
    }
};

export const FetchedDataInfinite = async (sort, pageParam = 0) => {
    if (!allPokemonData) {
        const allPokemon = await fetchAllPokemonNames();
        allPokemonData = await Promise.all(allPokemon.map(async (pokemon) => {
            const response = await axios.get(pokemon.url);
            
            return response.data;
        }));
    }
    const typeSorting = sortType(sort.sortType, allPokemonData);
    const genSorting = sortGen(sort.sortGen, typeSorting);
    const sortedPokemon = sortByChoice(sort, genSorting);
    const paginatedPokemon = sortedPokemon.slice(pageParam, pageParam + limit);
    return {
        results: paginatedPokemon,
        nextOffset: pageParam + limit,
        totalCount: allPokemonData.length
    };
};