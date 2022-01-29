import React, { useEffect, useState } from 'react'
import Header from './../Header';
import axios from "../../axios";
import "./Confirmation.css";
import ClosedCaptionIcon from '@mui/icons-material/ClosedCaption';
import HearingIcon from '@mui/icons-material/Hearing';
import { useParams, useLocation } from 'react-router';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Confirmation() {
    let { state } = useLocation(); 
    let { movieId, timeId } = useParams();
    let navigate = useNavigate();
    // const [movie, setMovie] = useState(null);
    const seats = state.seats_selected;
    const data = state.full_data;
    const movie = state.movie;
    const time = state.time;
    const rows = ["A", "B", "C", "D", "E"];
    // console.log("INSIDE CONFIRMATION");
    // console.log(seats);
    // console.log("NEED DATA");
    // console.log(data);
    const parameters = {"seats": seats, "data": data, "time": time} 

    const Confirm = (e) => {
        e.preventDefault();
        axios.post(`/confirm/:${movieId}/:${timeId}`, parameters);
        navigate(`/seats/${movieId}/${timeId}`);
    }

    return (
        <div class="">
            <Header/>
            <h1 class="title">Confirm Ticket</h1>
            <div class="confirmation">
                <div class="confirmation_box">
                    <div class="box">
                        <div class="movie_info">
                            <img src={ movie.image }></img>
                            <div class="movie_words">
                                <div class="title">{ movie.title }</div>
                                <div class="rate_time">
                                    <div>{ movie.rating }</div>
                                    <div class="right_info">{ movie.length }</div>
                                </div>
                                <div class="semi_info info_element">
                                    <div>Digital Cinema</div>
                                    <div class="right_info">Reserved Seating</div>
                                    <ClosedCaptionIcon />
                                    <HearingIcon />
                                </div>
                                <div class="time"><h1>{ time }</h1></div>
                            </div>
                        </div>
                        <div class="reserved_seats">
                            { seats.map(seat => 
                                <div>
                                    <b>Row</b> {rows[parseInt(seat / 20)]} <b class="number">Number</b> {seat % 20}
                                </div>
                            )}
                        </div>
                    </div>
                    <div class="button">
                        <Button onClick={ Confirm }>Confirm</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
 

export default Confirmation

