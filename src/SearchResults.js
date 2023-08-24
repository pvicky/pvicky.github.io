import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import React from 'react'
import axios from 'axios'

const API_BASE_PATH = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;
const PLAYER_SEARCH_PATH = API_BASE_PATH + `/searchplayers.php`;
const CLUB_SEARCH_PATH = API_BASE_PATH + `/searchteams.php`;

function SearchResults(props){
    const params = useParams();
    const navigate = useNavigate();

    const [playerSearchEntries, setPlayerSearchEntries] = useState([]);
    const [clubSearchEntries, setClubSearchEntries] = useState([]);

    const playerSearchParams = {params: {}};
    const clubSearchParams = {params: {}};


    useEffect(() => {
      async function queryPlayerSearch(){
        try {

          const queryResponse = await axios.get(PLAYER_SEARCH_PATH, playerSearchParams);
          await console.log(queryResponse);

          const queryResult = await queryResponse.data.player;
          if (queryResult === null){
            setPlayerSearchEntries([]);
            return;
          }

          await console.log(queryResult);
          await setPlayerSearchEntries(queryResult.filter(p => p.strSport === "Soccer"));
          await console.log(playerSearchEntries);
          return;
        }
        catch {
          console.log(`Error`);
          return;
        }
      }

      async function queryClubSearch(){
        try {

          const queryResponse = await axios.get(CLUB_SEARCH_PATH, clubSearchParams);
          await console.log(queryResponse);

          const queryResult = await queryResponse.data.teams;
          if (queryResult === null){
            setClubSearchEntries([]);
            return;
          }

          await console.log(queryResult);
          await setClubSearchEntries(queryResult.filter(c => c.strSport === "Soccer"));
          await console.log(clubSearchEntries);
          return;
        }
        catch {
          console.log(`Error`);
          return;
        }
      }

      playerSearchParams.params.p = params.query;
      clubSearchParams.params.t = params.query;

      queryPlayerSearch();
      queryClubSearch();

    }, [params.query]);




    return (<div className="search-container">
              <div className="player-search-container">
                {playerSearchEntries.map((p) => React.createElement('div',
                                                             {className:"search-entry"},
                                                             <>
                                                               <div className="entry-title" data-id={p.idPlayer} onClick={() => navigate(`/player/${p.idPlayer}`)}> {p.strPlayer} </div>
                                                               <div className="entry-exclude-title">
                                                                 {p.strCutout != null ? <img className="search-thumb" data-id={p.idPlayer} onClick={() => navigate(`/player/${p.idPlayer}`)} src={p.strCutout+`/preview`} alt={p.strPlayer}/> : <></>}
                                                                 <div className="entry-misc">
                                                                   <div className="entry-country"> {p.strNationality} </div>
                                                                   <div className="entry-club"> {p.strTeam} </div>
                                                                   <div className="entry-birth"> {p.dateBorn} </div>
                                                                   <div className="entry-position"> {p.strPosition} </div>
                                                                 </div>
                                                               </div>
                                                             </>))}
              </div>
              <div className="club-search-container">
                {clubSearchEntries.map((c) => React.createElement('div',
                                                             {className:"search-entry"},
                                                             <>
                                                               <div className="entry-title" data-id={c.idTeam} onClick={() => navigate(`/club/${c.idTeam}`)}> {c.strTeam} </div>
                                                               <div className="entry-exclude-title">
                                                                 {c.strTeamBadge != null ? <img className="search-thumb" data-id={c.idTeam} onClick={() => navigate(`/club/${c.idTeam}`)} src={c.strTeamBadge+`/preview`} alt={c.strTeam}/> : <></>}
                                                                 <div className="entry-misc">
                                                                   <div className="entry-country"> {c.strCountry} </div>
                                                                   <div className="entry-league"> {c.strLeague} </div>
                                                                   <div className="entry-formed"> {c.intFormedYear} </div>
                                                                 </div>
                                                               </div>
                                                             </>))}
            </div>
          </div>
    );
}


export default SearchResults;
