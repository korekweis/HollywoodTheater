import React, { useState, useEffect } from 'react'
import Header from "../Header";
import { Button } from '@mui/material';
import SeatPicker from "react-seat-picker";
import axios from "../../axios";
import "./Seats.css";
import { useParams, useLocation } from 'react-router';
import { useNavigate } from 'react-router-dom';

function Seats() {
    let navigate = useNavigate();
    let { state } = useLocation();
    const [rows, setRows] = useState([]);
    const [seats, setSeats] = useState([]);
    const [testLoad,setTestLoad] = useState(false);
    const movie = state.movie;
    const time = state.time;
    const [data_movie, setMovie] = useState(null);
    const [data_time, setTime] = useState(null);
    let { movieId, timeId } = useParams(); 
    let data = "";
    let chosen_seats = [];
    
    useEffect(() => { 
         axios.get(`/rows/:${movieId}/:${timeId}`)
            .then(response => {
                data = response.data;
                setRows(data['seats']);
                setMovie(data['movie']);
                setTime(data['time']);
                setTestLoad(true);
            });
    }, [])

    const addSeatCallback = ({ row, number, id }, addCb) => {
        // setLoading(true);
        new Promise(resolve => setTimeout(resolve, 1500));
        console.log(`Added seat ${number}, row ${row}, id ${id}`);
        const newTooltip = `tooltip for id-${id} added by callback`;
        addCb(row, number, id, newTooltip);
        chosen_seats.push(id);
        console.log(chosen_seats);
        // setLoading(false);
    }
     
    const removeSeatCallback = ({ row, number, id }, removeCb) => {
        // setLoading(true);
        new Promise(resolve => setTimeout(resolve, 1500))
        console.log(`Removed seat ${number}, row ${row}, id ${id}`)
        // A value of null will reset the tooltip to the original while '' will hide the tooltip
        const newTooltip = ['A', 'B', 'C'].includes(row) ? null : ''
        removeCb(row, number, newTooltip)
        for (var i = 0; i<chosen_seats.length; i++) { 
            if (id === chosen_seats[i]) { 
                chosen_seats.splice(i, 1);
            }
        }
        console.log(chosen_seats);
        // setLoading(false);
    }

    const Continue = () => { 
        setSeats(chosen_seats);
        navigate(`/confirm/${movieId}/${timeId}`, { state: {seats_selected: chosen_seats, full_data: rows, time: data_time, movie: data_movie}});
    }
          
    return (
        <div>
            <header className="App-header">
                <Header />
            </header>
            <div className="seats">
                <div class="movie_info">
                    <div class="movie_info_cont"> 
                        <img src={ movie.image }></img>
                        <div className="info">
                            <h2>{ movie.title }</h2>
                            <h3>{ time }</h3>
                        </div>
                    </div>
                </div>
                <div class="screen"> 
                    <h2> SCREEN </h2>
                </div>
                <div className="seats-selection">
                    {testLoad && <SeatPicker rows={ rows } 
                        visible 
                        addSeatCallback={ addSeatCallback }
                        removeSeatCallback={ removeSeatCallback }
                        maxReservableSeats={8}
                        alpha
                        selectedByDefault
                        // loading={ isLoading }
                        tooltipProps={{ multiline: true }}
                    />}
                </div>
                <Button onClick={ Continue }>Continue</Button>
            </div>
        </div>
    )
}

export default Seats
