import React, { useState, useEffect } from 'react'
import Header from '../../Header';
import axios from "../../../axios";
import ClosedCaptionIcon from '@mui/icons-material/ClosedCaption';
import HearingIcon from '@mui/icons-material/Hearing';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "./Wishlist.css";

function Wishlist() {

    const [movies, setMovies] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/user/wishlist')
        .then(response => { 
            // console.log(response.data);
            setMovies(response.data);
        })
    })

    const removeWatchlist = (id) => e => { 
        // console.log("removing function");
        // console.log(id);
        axios.post(`/user/removeWishlist`, { "id":id });
    }

    return (
        <div>
            <Header/>
            <div class="wishlist_title">
                <h1>Your Wishlist</h1>
            </div>
            <div class="Movies">
                <div class="movies_div"> 
                    {movies.map(movie => 
                        <div class="movie_info_cont">
                            <div class="movie_info" key={movie._id}>
                                <div class="movie_image">
                                    <img src={ movie.movie.image }></img>
                                    <div>
                                        <Button onClick = { removeWatchlist(movie._id) }>
                                            Remove from Watchlist
                                        </Button>
                                    </div>
                                </div>
                                <div class="movie_info_right">
                                    <div class="movie_title">
                                        {movie.movie.title}
                                    </div>
                                    <div class="rate_time info_element">
                                        <div>{ movie.movie.rating }</div>
                                        <div class="right_info">{ movie.movie.length }</div>
                                    </div>
                                    <div class="semi_info info_element">
                                        <div>Digital Cinema</div>
                                        <div class="right_info">Reserved Seating</div>
                                        <ClosedCaptionIcon />
                                        <HearingIcon />
                                    </div>
                                    <div class="timeslots_div">
                                        {movie.movie.timeslots.map(timeslot => 
                                            <Button onClick={() => navigate(`/seats/${movie.movie._id}/${timeslot.id}`)}>{ timeslot.time }</Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )} 
                </div>
            </div>
        </div>
    )
}

export default Wishlist