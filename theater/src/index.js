import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import ViewMovies from "./Components/NavBar/MoviesNav/ViewMovies";
import WishList from "./Components/NavBar/MoviesNav/Wishlist";
import Seats from "./Components/Seats/Seats";
import Confirmation from "./Components/Seats/Confirmation";
import MyTickets from "./Components/NavBar/MoviesNav/MyTickets";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<ViewMovies />} />
      <Route path="wishlist" element={<WishList />}/>
      <Route path="myTickets" element={<MyTickets />}/>
      <Route path="seats" element={ <Seats /> } >
        <Route path=":movieId/:timeId" component={ <Seats /> }/>
      </Route>
      <Route path="confirm" element={ <Confirmation /> }>
        <Route path=":movieId/:timeId" component={ <Confirmation /> }/>
      </Route>
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
