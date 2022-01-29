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
                            <Button onClick={() => navigate(`/seats/${id}/${timeslot.id}`)}>{ timeslot.time }</Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Movies