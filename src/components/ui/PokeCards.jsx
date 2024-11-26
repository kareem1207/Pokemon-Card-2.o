/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";
import typeColor from "../../api/typeColor.json";
import { useColor } from '../../contexts/ColorContext';
import "../../css/pokemonCard.css"
import "../../css/pokemonMainPage.css"

export const PokemonCards = ({ pokeName }) => {
    const { backgroundColor, textColor } = useColor();
    const types = pokeName.types || [];
    const abilities = pokeName.abilities || [];
    const stats = pokeName.stats || [];
    const moves = pokeName.moves || [];
    const randomMove = moves.length > 0 ? moves[Math.floor(Math.random() * moves.length)].move?.name : "no move";
    return (
        <li
            className="card"
            style={{
                backgroundColor: backgroundColor,
                color: textColor,
                padding: '10px',
            }}
        >
            <figure
                className="card-image"
                style={{
                    backgroundColor: typeColor[types[0]?.type?.name] || "#ccc",
                }}
            >
                <img
                    src={
                        pokeName.sprites?.other?.dream_world?.front_default ||
                        pokeName.sprites?.other["official-artwork"].front_default ||
                        pokeName.sprites?.front_default
                    }
                    alt={`Pokemon ${pokeName.name}`}
                />
            </figure>
            <NavLink className="link" to={`/${pokeName.id}`}>
                <div className="card-content">
                    <h2>{pokeName.id} : {pokeName.name?.charAt(0).toUpperCase() + pokeName.name?.slice(1)}</h2>
                    <div className="types">
                        {types.map((currType, index) => (
                            <span
                                key={index}
                                className="type"
                                style={{
                                    backgroundColor: typeColor[currType?.type?.name] || "#ccc",
                                }}
                            >
                                {currType.type?.name}
                            </span>
                        ))}
                    </div>
                    <p>
                        Abilities : <strong>{abilities.map((currAbility) => currAbility.ability?.name).join(" , ")}</strong>
                    </p>
                    <p>
                        Height : <strong>{pokeName.height}</strong> Weight : <strong>{pokeName.weight}</strong> Speed : <strong>{stats[5]?.base_stat || "N/A"}</strong>
                    </p>
                    <p>
                        Experience : <strong>{pokeName.base_experience}</strong> Move : <strong>{randomMove}</strong>
                    </p>
                    <div className="stats">
                        <h3>Stats:</h3>
                        {stats.map((currentPokemon, index) => (
                            <div key={index} className="stat-item">
                                <span><b>{currentPokemon.stat?.name}:</b></span>
                                <span><b>{currentPokemon.base_stat}</b></span>
                            </div>
                        ))}
                    </div>
                </div>
            </NavLink>
        </li>
    );
};