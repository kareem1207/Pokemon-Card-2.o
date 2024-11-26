/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom"
import { ColorChanger } from "../ui/ColorChanger"
import { RiPagesLine } from "react-icons/ri";
import { IoMdInfinite } from "react-icons/io";
import { useCallback } from "react";
import { FaHome } from "react-icons/fa";
import { IoLogoGameControllerB } from "react-icons/io";
import "../../css/header.css"

export const Header = ({ pokeSearch, setSort, sort, setPokeSearch, infinite, setInfinite }) => {
    const headerStyle = {
        backgroundColor: localStorage.getItem("background-color"),
        color: localStorage.getItem("text-color"),
    }

    const types = ["normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"];
    
    const generation = [
        "generation 1",
        "generation 2",
        "generation 3",
        "generation 4",
        "generation 5",
        "generation 6",
        "generation 7",
        "generation 8",
        "generation 9"
    ]

    const handleSelection = useCallback((event) => {
        const { name, value } = event.target;
        setSort(prevSort => {
            const newSort = { ...prevSort, [name]: value };
            return newSort;
        });
    }, [setSort]);

    return (
        <header className="header" style={headerStyle}>
            <div className="header-content">
                <div className="header-left">
                    <h1 className="header-title">Pokemon Cards</h1>
                </div>

                <div className="header-center">
                    <div className="search-container">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search Pokemon..."
                            value={pokeSearch}
                            onChange={(e) => setPokeSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="header-right">
                    <nav className="header-nav">
                        <NavLink to="/" className="nav-icon">
                            <FaHome />
                        </NavLink>
                        <NavLink to="/game" className="nav-icon">
                            <IoLogoGameControllerB />
                        </NavLink>
                        <button
                            className="nav-icon"
                            onClick={() => setInfinite(!infinite)}
                        >
                            {infinite ? <IoMdInfinite /> : <RiPagesLine />}
                        </button>
                        <ColorChanger />
                    </nav>
                </div>
            </div>

            <div className="filter-section">
                <div className="filter-group">
                    <label className="filter-label">Sort by</label>
                    <select
                        name="sortBy"
                        className="filter-select"
                        value={sort.sortBy}
                        onChange={handleSelection}
                    >
                        <option value="id">ID</option>
                        <option value="name">Name</option>
                        <option value="base_experience">Base Experience</option>
                        <option value="height">Height</option>
                        <option value="weight">Weight</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Type</label>
                    <select
                        name="type"
                        className="filter-select"
                        value={sort.type}
                        onChange={handleSelection}
                    >
                        <option value="all">All Type</option>
                        <option value="single">Single Type only</option>
                        {types.map((type) => (
                            <option key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Generation</label>
                    <select
                        name="generation"
                        className="filter-select"
                        value={sort.generation}
                        onChange={handleSelection}
                    >
                        <option value="all">All Generation</option>
                        {generation.map((gen) => (
                            <option key={gen} value={gen}>
                                {gen.charAt(0).toUpperCase() + gen.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Order</label>
                    <select
                        name="order"
                        className="filter-select"
                        value={sort.order}
                        onChange={handleSelection}
                    >
                        <option value="ascending">Ascending</option>
                        <option value="descending">Descending</option>
                        <option value="default">Default</option>
                    </select>
                </div>
            </div>
        </header>
    );
}