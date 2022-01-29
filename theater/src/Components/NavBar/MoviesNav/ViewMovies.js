import React, { useEffect, useState } from 'react';
import Header from '../../Header';
import axios from "../../../axios";
import Movies from "./Movies";
import "./ViewMovies.css";

function ViewMovies() {
    const [movies, setMovies] = useState([]);

    // used for fetching information
    useEffect(() => { 
        axios.get('/movies/')
        .then(response => {
            setMovies(response.data);
            console.log("set Movies")
        })
    }, []);

    return (
        <div>
            <header className="App-header">
                <Header />
            </header>
            {movies.map(movie => 
            <div class="movie_list">
                <Movies 
                id = {movie._id}
                image = {movie.image}
                title = {movie.title}
                rating = {movie.rating}
                length = {movie.length}
                timeslots = {movie.timeslots}
                />
            </div>
        )}
        </div>
    )
}

export default ViewMovies
