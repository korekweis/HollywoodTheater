import './App.css';
import Header from './Components/Header';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <Header />
      </header>
      <body>
        <ViewMovies />
      </body>
    </div>
  );
}

export default App;
