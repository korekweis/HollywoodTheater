import React, { useState, useEffect } from 'react'
import Header from "../Header";
import { Button } from '@mui/material';
import SeatPicker from "react-seat-picker";
import axios from "../../axios";
import "./Seats.css";
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';

function Seats() {
    let navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [seats, setSeats] = useState([]);
    const [testLoad,setTestLoad] = useState(false);
    const [movie, setMovie] = useState(null);
    const [time, setTime] = useState(null);
    let { movieId, timeId } = useParams(); 
    let data = "";
    let chosen_seats = [];
    
    useEffect(() => { 
         axios.get(`/rows/:${movieId}/:${timeId}`)
            .then(response => {
                data = response.data
                console.log("HELLO INSIDE HERE");
                console.log(data);
                // data.forEach((item) => {
                //     temp_rows.push(item['seats'])  
                // });
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
        // console.log("inside confirm");
        // console.log(seats);
        // console.log("chosen seats")
        // console.log(chosen_seats);
        navigate(`/confirm/${movieId}/${timeId}`, { state: {seats_selected: chosen_seats, full_data: rows, time: time, movie: movie}});
    }
    // const rows = [
    //     [
    //       { row: "A", id: 1, number: 1, tooltip: "Reserved by you" },
    //       { id: 2, number: 2, tooltip: "Cost: 15$" },
    //       { id: 3, number: 3, tooltip: "Reserved by Rogger"},
    //       { id: 4, number: 4 },
    //       { id: 5, number: 5 },
    //       { id: 6, number: 6 },
    //       { id: 7, number: 7 },
    //       { id: 8, number: 8 },
    //       { id: 9, number: 9 },
    //       { id: 10, number: 10 },
    //       null,
    //       null,
    //       { id: 11, number: 11, isSelected: true, tooltip: "Reserved by you" },
    //       { id: 12, number: 12, tooltip: "Cost: 15$" },
    //       { id: 13, number: 13, tooltip: "Reserved by Andie"},
    //       { id: 14, number: 14 },
    //       { id: 15, number: 15 },
    //       { id: 16, number: 16 },
    //       { id: 26, number: 6 }, 
    //       { id: 27, number: 7 },
    //       { id: 28, number: 8 },
    //       { id: 29, number: 9 },
    //       { id: 30, number: 10 },
    //       null,
    //       null,
    //       { id: 31, number: 11 },
    //       { id: 32, number: 12, tooltip: "Cost: 15$" },
    //       { id: 33, number: 13, tooltip: "Reserved by Andie"},
    //       { id: 34, number: 14 },
    //       { id: 35, number: 15 },
    //       { id: 36, number: 16 },
    //       { id: 37, number: 17 },
    //       { id: 38, number: 18 },
    //       { id: 39, number: 19 },
    //       { id: 40, number: 20 },
    //     ],
    //     [
    //       { id: 41, number: 1 },
    //       { id: 42, number: 2 },
    //       { id: 43, number: 3, isReserved: true },
    //       { id: 44, number: 4 },
    //       { id: 45, number: 5 },
    //       { id: 46, number: 6 },
    //       { id: 47, number: 7 },
    //       { id: 48, number: 8 },
    //       { id: 49, number: 9 },
    //       { id: 50, number: 10 },
    //       null,
    //       null,
    //       { id: 51, number: 11 },
    //       { id: 52, number: 12, tooltip: "Cost: 15$" },
    //       { id: 53, number: 13, tooltip: "Reserved by Andie"},
    //       { id: 54, number: 14 },
    //       { id: 55, number: 15 },
    //       { id: 56, number: 16 },
    //       { id: 57, number: 17 },
    //       { id: 58, number: 18 },
    //       { id: 59, number: 19 },
    //       { id: 60, number: 20 },
    //     ],
    //     [
    //       { id: 61, number: 1, tooltip: "Cost: 25$" },
    //       { id: 62, number: 2 },
    //       { id: 63, number: 3 },
    //       { id: 64, number: 4 },
    //       { id: 65, number: 5 },
    //       { id: 66, number: 6 },
    //       { id: 67, number: 7 },
    //       { id: 68, number: 8 },
    //       { id: 69, number: 9 },
    //       { id: 70, number: 10 },
    //       null,
    //       null,
    //       { id: 71, number: 11 },
    //       { id: 72, number: 12, tooltip: "Cost: 15$" },
    //       { id: 73, number: 13, tooltip: "Reserved by Andie"},
    //       { id: 74, number: 14 },
    //       { id: 75, number: 15 },
    //       { id: 76, number: 16 },
    //       { id: 77, number: 17 },
    //       { id: 78, number: 18 },
    //       { id: 79, number: 19 },
    //       { id: 80, number: 20 }
    //     ],
    //     [
    //       { id: 81, number: 1, tooltip: "Cost: 25$" },
    //       { id: 82, number: 2 },
    //       { id: 83, number: 3 },
    //       { id: 84, number: 4 },
    //       { id: 85, number: 5 },
    //       { id: 86, number: 6 },
    //       { id: 87, number: 7 },
    //       { id: 88, number: 8 },
    //       { id: 89, number: 9 },
    //       { id: 90, number: 10 },
    //       null,
    //       null,
    //       { id: 91, number: 11 },
    //       { id: 92, number: 12, tooltip: "Cost: 15$" },
    //       { id: 93, number: 13, tooltip: "Reserved by Andie"},
    //       { id: 94, number: 14 },
    //       { id: 95, number: 15 },
    //       { id: 96, number: 16 },
    //       { id: 97, number: 17 },
    //       { id: 98, number: 18 },
    //       { id: 99, number: 19 },
    //       { id: 100, number: 20 }
    //     ]
    // ];
          
    return (
        <div>
            <header className="App-header">
                <Header />
            </header>
            <div className="seats">
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
