import './App.css';
import {useState} from 'react'
import { Route, Routes, HashRouter as Router, Link } from 'react-router-dom';

import SearchForm from './SearchForm'
import SearchResults from './SearchResults'
import ClubDetails from './ClubDetails'
import PlayerDetails from './PlayerDetails'
import LeagueDetails from './LeagueDetails'

function App(){

  const [queryResults, setQueryResults] = useState([]);
  const [clickedId, setClickedId] = useState(-1);

  const [showSearchResultsFocus, setSearchShowResultsFocus] = useState(false);
  const [showDetailsFocus, setShowDetailsFocus] = useState(false);

  return (
    <div>
      <Router>
        <nav>
          <Link to="/">Home</Link>
        </nav>
        <SearchForm searchCallback={(qr => setQueryResults(qr))} setSearchFocus={setSearchShowResultsFocus} setDetailsFocus={setShowDetailsFocus} />
        <Routes>
          <Route path="/search/:query" element={<SearchResults />} />
          <Route path="/player/:id" element={<PlayerDetails />} />
          <Route path="/club/:id" element={<ClubDetails />} />
          <Route path="/league/:id" element={<LeagueDetails />} />
        </Routes>
      </Router>

    </div>
  );
};

export default App;
