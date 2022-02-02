import React, { useEffect, useState } from 'react';
import Header from './../../Header';
import axios from "../../../axios";
import ClosedCaptionIcon from '@mui/icons-material/ClosedCaption';
import HearingIcon from '@mui/icons-material/Hearing';
import "./MyTickets.css";

function MyTickets() {
    const rows = ["A", "B", "C", "D", "E"];
    const [tickets, setTickets] = useState([]);

    // const [time, setTime] = useState();
    useEffect(() => { 
        axios.get('/user/myTickets')
        .then(response => {
            console.log(response.data);
            // console.log("timeslot");
            setTickets(response.data);
        })
    }, [])

    return (
        <div>
            <Header/>
            <div class="wishlist_title">
                <h1>My Tickets</h1>
            </div>
            <div class="Tickets">
                <div class="ticket_cont">
                    {tickets.map(ticket => 
                        <div class="ticket_info">
                            <div class="ticket_info_flex">
                                <div class="movie_image">
                                    <img src={ ticket.movie.image }></img>
                                </div>
                                <div class="movie_words">
                                    <div class="title">{ ticket.movie.title }</div>
                                    <div class="rate_time">
                                        <div>{ ticket.movie.rating }</div>
                                        <div class="right_info">{ ticket.movie.length }</div>
                                    </div>
                                    <div class="semi_info info_element">
                                        <div>Digital Cinema</div>
                                        <div class="right_info">Reserved Seating</div>
                                        <ClosedCaptionIcon />
                                        <HearingIcon />
                                    </div>
                                    <div class="time"><h1>{ ticket.time }</h1></div>
                                </div>
                            </div>
                            <div class="reserved_seats">
                                    {ticket.tickets.map(seat => 
                                        <div class="seat_outer_grid">
                                            <div class="seats">
                                                <b>Row</b> {rows[parseInt(seat / 20)]} <b class="number">Number</b> {seat % 20}
                                                {/* {seat} */}
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );   
}

export default MyTickets;
