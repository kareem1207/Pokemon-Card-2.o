import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../css/gamePage.css"

export const GamePage = () => {
    /* These lines of code are setting up multiple state variables using the `useState` hook in a React
    functional component. Here's what each state variable represents: */
    const [data, setData] = useState([]);
    const [clickedMode, setClickedMode] = useState(false);
    const [clickedPokemon, setClickedPokemon] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedMode, setSelectedMode] = useState("");
    
    const api = `${import.meta.env.VITE_BASE_URL}`;
    const aboutGame = {
        "easy":"In this mode you will have 15 pp (chances to attack a move) and 5 points on winning   ",
        "medium":"In this mode you will have 10 pp (chances to attack a move) and 10 points on winning on losing you will lose 5 points    ",
        "hard":"In this mode you will have 5 pp (chances to attack a move) and 15 points on winning losing you will lose 10 points  "
    }

    const ids = [];
    // const totalNeeds= (battleCount /10)+1;
    const totalNeeds = 15; // adjust this value as per your needs
    while(ids.length<totalNeeds){
        ids.push(Math.floor(Math.random()*1025)+1);
    }

    const fetchedData = async () => {
        for (let id of ids) {
            const data = await ((await fetch(`${api}/${id}`)).json());
            setData((prev) => {
                if (!prev.some(pokemon => pokemon.id === data.id)) {
                    return [...prev, data];
                }
                return prev;
            });
        }
    };

    useEffect(() => {
        fetchedData();
    }, []);

    const handlePokemonClick = (pokemonId) => {
        setSelectedId(pokemonId);
        setClickedPokemon(true);
    };

    const handleModeSelect = (mode) => {
        setSelectedMode(mode);
        setClickedMode(true);
    };

    const resetSelections = () => {
        setClickedMode(false);
        setClickedPokemon(false);
        setSelectedId(null);
        setSelectedMode("");
    };

    if (data.length === 0) {
        return <h1>Loading</h1>;
    }

    const uniquePokemon = data.reduce((acc, current) => {
        const exist = acc.find(item => item.id === current.id && item.id !== 493);
        if (!exist) {
            acc.push(current);
        }
        return acc;
    }, []);

    return (
        <>
        <header>
            {/* <h1>Score : {score}</h1>
            <h1>Battle Count : {battleCount}</h1> */}
        </header> 
        <div className="game-page">
            <div className="selection-screen">
                <div className="pokemon-grid">
                    {uniquePokemon.map((pokemon, index) => (
                        <div 
                            key={pokemon.id} 
                            className={`pokemon-card ${selectedId === pokemon.id ? 'selected' : ''}`}
                            onClick={() => handlePokemonClick(pokemon.id)}
                        >
                            <img 
                                src={
                                    pokemon.sprites?.other?.dream_world?.front_default ||
                                    pokemon.sprites?.other["official-artwork"].front_default ||
                                    pokemon.sprites?.front_default
                                } 
                                alt={`#${index + 1} ${pokemon.name}`}
                            />
                            <p>{pokemon.name}</p>
                        </div>
                    ))}
                </div>

                <div className="difficulty-buttons">
                    <button 
                        className={`difficulty-btn ${selectedMode === 'easy' ? 'selected' : ''}`}
                        onClick={() => handleModeSelect('easy')}
                    >
                        Easy
                    </button>
                    <button 
                        className={`difficulty-btn ${selectedMode === 'medium' ? 'selected' : ''}`}
                        onClick={() => handleModeSelect('medium')}
                    >
                        Medium
                    </button>
                    <button 
                        className={`difficulty-btn ${selectedMode === 'hard' ? 'selected' : ''}`}
                        onClick={() => handleModeSelect('hard')}
                    >
                        Hard
                    </button>
                </div>
                <div className="about-difficulty">
                    {
                        clickedMode &&
                        <p>{aboutGame[selectedMode]}</p>
                    }

                </div>

                {clickedPokemon && clickedMode && (
                    <div className="start-section">
                        <NavLink 
                            to={`/game-battle?id=${selectedId}&difficulty=${selectedMode}`}
                            className="start-link"
                        >
                            <button className="start-btn">Start Battle</button>
                        </NavLink>
                        <button 
                            className="reset-btn"
                            onClick={resetSelections}
                        >
                            Reset Selections
                        </button>
                    </div>
                )}
            </div>
        </div>
        </>
    );
};