import { useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import types from "../../api/typeColor.json";
import mode from "../../api/gameDifficulty.json";
import "../../css/game.css";

const fetchMovePower = async (url) => {
    const response = await (await fetch(url)).json();
    return response;
};

const getHealthStatus = (currentHp, maxHp) => {
    const percentage = (currentHp / maxHp) * 100;
    if (percentage > 50) return 'high';
    if (percentage > 25) return 'medium';
    return 'low';
};

const getPPStatus = (currentPP, maxPP) => {
    const percentage = (currentPP / maxPP) * 100;
    if (percentage > 50) return 'high';
    if (percentage > 25) return 'medium';
    return 'low';
};

const moveGenerator = async (data, setMove, difficulty) => {
    if (data.length!==0) {
        const uniqueMoves = [];
        while (uniqueMoves.length < 4) {
            const randomMove = data.moves[Math.floor(Math.random() * data.moves?.length)];
            const moveDetails = await fetchMovePower(randomMove.move.url);
            if (
                !uniqueMoves.some((move) => move.moveName === randomMove.move.name) &&
                moveDetails.power > 0
            ) {
                uniqueMoves.push({
                    moveName: randomMove.move.name,
                    moveDamage: moveDetails.power || 0,
                    moveType: moveDetails?.type?.name,
                    pp: mode[difficulty]?.pp,
                });
            }
        }
        setMove(uniqueMoves);
    } else {
        console.log("No Pokemon Data",data);
    }
}

export const Game = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const difficulty = searchParams.get("difficulty");
    // const scoreTemp= localStorage.getItem("score");
    // const battleTemp= localStorage.getItem("battle");
    localStorage.removeItem("score");
    localStorage.removeItem("battle");
    
    const [aboutPokemon, setPokemonData] = useState([]);
    const [hp, setHp] = useState(0);
    const [computerHp, setComputerHp] = useState(0);
    const [computerData, setComputerData] = useState([]);
    const [computerMoves, setComputerMoves] = useState([]);
    const [moves, setMoves] = useState([]);
    const [turn, setTurn] = useState(true);
    const [win, setWin] = useState("");
    const [maxPP] = useState(mode[difficulty]?.pp || 0);
    // const [score, setScore] = useState(scoreTemp || 0);
    // const [battleCount, setBattleCount] = useState(battleTemp || 0);

    useEffect(() => {
        const fetchData = async () => {
            const data = await (await fetch(`${import.meta.env.VITE_BASE_URL}/${id}`)).json();
            setPokemonData(data);
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        if (aboutPokemon.stats) {
            setHp(aboutPokemon.stats[0].base_stat*(Math.floor(Math.random()*4)));
        }
    }, [aboutPokemon]);

    useEffect(() => {
        moveGenerator(aboutPokemon, setMoves, difficulty);
    }, [aboutPokemon, difficulty]);

    useEffect(() => {
        const fetchComputerMoves = async () => {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}?limit=100000`);
            const data = await response.json();
            const randomPokemonIndex = Math.floor(Math.random() * 1025);
            const computerPokemonData = data.results[randomPokemonIndex];

            const computerMovesResponse = await fetch(computerPokemonData.url);
            const computerMovesData = await computerMovesResponse.json();
            if(computerMovesData){
                setComputerData(computerMovesData);
                moveGenerator(computerMovesData, setComputerMoves);
            }else {
                console.log("No Computer Data", computerMovesData);
            }
        };

        fetchComputerMoves();
    }, [setComputerMoves]);

    useEffect(() => {
        if (computerData.stats) {
            setComputerHp(computerData.stats[0].base_stat * mode[difficulty].hpMultiplier);
        }
    }, [computerData, difficulty]);

    useEffect(() => {
        if (!turn && computerHp > 0) {
            setTimeout(() => {
                computerTurn();
            }, 5000);
        }
    }, [turn, computerHp]);

    useEffect(() => {
        if (hp <= 0) {
            // const newScore = score - mode[difficulty]["lost-points"];
            // setScore(newScore);
            // setBattleCount(prev => prev+1);
            setWin("player Lost");
        } else if (computerHp <= 0) {
            setWin("player Won");
            // const newScore = score + mode[difficulty]["lost-points"];
            // setScore(newScore);
        }
        // console.log(score);  
        return () => {
            setWin("");
            // localStorage.setItem("score", score);
            // localStorage.setItem("battle",battleCount);
        }
    }, [hp, computerHp]);
    
    const computerTurn = () => {
        const randomMoveIndex = Math.floor(Math.random() * computerMoves.length);
        const selectedMove = computerMoves[randomMoveIndex];
        setHp(prevHp => prevHp - selectedMove.moveDamage);
        setTurn(!turn);
    };

    if(win === "player Won") {
        return (
            <div className="game-over">
                <p>Won</p>
                <NavLink to="/game">
                    <button>Go To Game Page</button>
                </NavLink>
            </div>
        );
    }
    else if(win === "player Lost") {
        return (
            <div className="game-over">
                <p>Lost</p>
                <NavLink to="/game">
                    <button>Go To Game Page</button>
                </NavLink>
            </div>
        );
    }

    return (
        <div className="battle-container">
            {!turn && computerHp > 0 && (
                <div className="status-info">
                    <figure>
                        <img 
                            src={computerData.sprites?.other?.dream_world?.front_default || 
                                computerData.sprites?.other["official-artwork"].front_default || 
                                computerData.sprites?.front_default} 
                            alt={`#${computerData.id} ${computerData.name}`}
                        />
                        <figcaption>{computerData.name}</figcaption>
                    </figure>
                    <p>Computer Pokemon Name: {computerData.name}</p>
                    <div className="health-bar">
                        <div 
                            className={`health-bar-fill ${getHealthStatus(computerHp, computerData.stats?.[0].base_stat * mode[difficulty].hpMultiplier)}`}
                            style={{
                                width: `${(computerHp / (computerData.stats?.[0].base_stat * mode[difficulty].hpMultiplier)) * 100}%`
                            }}
                        ></div>
                    </div>
                    <p>HP: {computerHp}</p>
                </div>
            )}

            <div className="turn-indicator">
                {turn ? "Players" : "Computers"} turn
            </div>

            {turn && (
                <div className="player-pokemon status-info">
                    <figure>
                        <img 
                            src={aboutPokemon.sprites?.other?.dream_world?.front_default || 
                                aboutPokemon.sprites?.other["official-artwork"].front_default || 
                                aboutPokemon.sprites?.front_default} 
                            alt={`#${id} ${aboutPokemon.name}`}
                        />
                        <figcaption>{aboutPokemon.name}</figcaption>
                    </figure>
                    
                    <div className="health-bar">
                        <div 
                            className={`health-bar-fill ${getHealthStatus(hp, aboutPokemon.stats?.[0].base_stat)}`}
                            style={{
                                width: `${(hp / aboutPokemon.stats?.[0].base_stat) * 100}%`
                            }}
                        ></div>
                    </div>
                    <p>HP: {hp}</p>
                    <p>Pokemon ID: {id}</p>
                    <p>Difficulty: {difficulty}</p>
                    
                    <div className="moves-container">
                        {moves.map((move, index) => (
                            <button 
                                key={index} 
                                style={{
                                    backgroundColor: types[move.moveType],
                                }}
                                onClick={() => {
                                    setMoves(prevMoves => prevMoves.map((m, i) => i === index ? { ...m, pp: m.pp - 1 } : m));
                                    setTurn(!turn);
                                    setComputerHp(prevHp => prevHp - move.moveDamage);
                                }} 
                                disabled={move.pp === 0}
                            >
                                <p>{move.moveName}</p>
                                <p>Damage: {move.moveDamage}</p>
                                <p>PP: <span className={`pp-indicator ${getPPStatus(move.pp, maxPP)}`}>{move.pp}</span></p>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};