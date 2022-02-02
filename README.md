# Hollywood Theater
A theater ticketing website created with MERN Stack. 
- MongoDB
- Express.js
- React.js 
- Node.js

## Creating React Application 
`npx create-react-app <Theater>`

## Running React 
`npm start`

## Install for Multilingual User Interface (MUI)
`npm install @mui/material`

`npm install @material-ui/icons`

`yarn add @emotion/styled`

`npm install @emotion/core@10.1.1`

`npm install @mui/icons-material`

## Install React Router and React Router Dom
`npm i react-router`
`npm i react-router-dom`

## Install React Seat Picker 
`npm i react-seat-picker`

## Install axios 
`npm i axios`

## Install nodemon
`sudo npm install -g nodemon`

## Run backend
`npx nodemon server.js`

## Install express.js and mongoose 
`npm i express mongoose`

## Install express session 
`npm install express-session`

## Install cookie parser
`npm install cookie-parser`

# Hollywood Theater Features

### Homepage 
- Users can view the movies that are now showing 
- Users have the option to register or login their accounts

![Home Page](/Images/Home.png "Homepage")

### Register 
- Users can register by providing their First Name, Last Name, email address which is unique, and password 

![Register](/Images/Register.png "Register")

### Login 
- Users can login by providing their email address and password 

![Login](/Images/Login.png "Login")

### Reserving Seats
- Once the user chooses a movie in a specific time, he/she can reserve seats 
- Seats can be selected on the screen 
- The user can reserve a maximum of 7 seats 
- react-seat-picker was used to display the seats 

![Seats](/Images/Seats.png "Seats")

### Confirm the Chosen Seats 
- Once the seats are chosen, the program confirms with the user if the seats chosen are correct 
- The title, time, and seat numbers are displayed on the screen 

![Confirm](/Images/Confirm.png "Confirm")

### Seats reserved
- Once confirmed, the seats on the screen will now be confirmed

![Saved](/Images/Saved.png "Saved")

### My Tickets
- The user is able to view the tickets he/she has bought 
- It displays the movie title, time, and the tickets purchased

![MyTickets](/Images/MyTickets.png "MyTickets")

### Watchlist 
- As seen on the homepage, the user is able to place a movie to his/her watchlist 
- The user is able to view the movies added to his/her watchlist on this page 

![Watchlist](/Images/Watchlist.png "Watchlist")
