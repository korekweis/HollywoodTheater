import React, { useState } from 'react';
import axios from "../../../axios";
import "./Movies.css";
import ClosedCaptionIcon from '@mui/icons-material/ClosedCaption';
import HearingIcon from '@mui/icons-material/Hearing';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Movies({id, image, title, rating, length, timeslots}) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [movie, setMovie] = useState(null);
    const [time, setTime] = useState(null);
    const parameters = {"user": user, "movie": id};

    const addToWatchlist = e => { 
        axios.get('/user/loggedIn', {}, {withCredentials: true})
        .then(response => { 
            console.log("IN MOVIES ADD TO WATCHLIST");
            console.log(response.data); 
            setUser(response.data);
            console.log("PRINTING USERS IN WATCHLIST FRONTEND");
            console.log(user);
        })
        axios.post(`/user/wishlist`, parameters);
    }

    const FindMovie = (timeslot) => e => {
        e.preventDefault();
        axios.get(`/movie/:${id}/:${timeslot.id}`)
            .then(response => {
                navigate(`/seats/${id}/${timeslot.id}`, {state: {movie: response.data['movie'], time: response.data['time']}});
            });
    }

    return (
        <div class="movies">
            <div class="movie_info">
                <div class="image_src">
                    <div class="image">
                        <img src={ image }></img>
                    </div>
                    <Button onClick = { addToWatchlist }>
                        Add to Watchlist
                    </Button>
                </div>
                <div class="info">
                    <div class="title info_element"><h2>{ title }</h2></div>
                    <div class="rate_time info_element">
                        <div>{ rating }</div>
                        <div class="right_info">{ length }</div>
                    </div>
                    <div class="semi_info info_element">
                        <div>Digital Cinema</div>
                        <div class="right_info">Reserved Seating</div>
                        <ClosedCaptionIcon />
                        <HearingIcon />
                    </div>
                    <div class="timeslots_div">
                        {timeslots.map(timeslot => 
                            <Button onClick={ FindMovie(timeslot) }>{ timeslot.time }</Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Movies