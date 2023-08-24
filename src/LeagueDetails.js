import {useState, useEffect} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import React from 'react';
import axios from 'axios'
import LeagueTable from './LeagueTable'

const API_BASE_PATH = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;
const LEAGUE_DETAILS_PATH = API_BASE_PATH + "/lookupleague.php";
const LEAGUE_SEASON_SEARCH_PATH = API_BASE_PATH + "/search_all_seasons.php";

function LeagueDetails(){
    const params = useParams();
    const navigate = useNavigate();

    const [leagueSeason, setLeagueSeason] = useState(null);
    const [leagueSeasons, setLeagueSeasons] = useState([]);
    const [leagueInfo, setLeagueInfo] = useState({});


    const leageInfoParams = {params: {}};


    useEffect(() => {
      async function getLeagueInfo(){
        try {
          let queryResponse = await axios.get(LEAGUE_DETAILS_PATH, leageInfoParams);
          await console.log(queryResponse);

          let queryResult = await queryResponse.data.leagues[0];
          await setLeagueInfo(queryResult);
          await setLeagueSeason(queryResult['strCurrentSeason']);

          queryResponse = await axios.get(LEAGUE_SEASON_SEARCH_PATH, leageInfoParams);
          await setLeagueSeasons(queryResponse.data.seasons.reverse());


        }
        catch {
          console.log(`ERROR QUERYING INFO`);
          return;
        }
      }


      leageInfoParams.params.id = params.id;


      setLeagueInfo({});
      setLeagueSeason(null);
      setLeagueSeasons([]);

      getLeagueInfo();

    }, [params.id])

    function renderLeagueDetails(){
        return (<div className="main-body">
                  <img src={leagueInfo['strBadge']+'/preview'} alt={leagueInfo['strLeague']} />
                  <div className="page-context"> {leagueInfo['strLeague']} </div>

                  <div className="description"> {leagueInfo['strDescriptionEN']} </div>

                  <select name="seasons" onChange={(ev) => setLeagueSeason(ev.target.value)}>
                    {leagueSeasons.map(s => <option value={s['strSeason']}> {s['strSeason']} </option>)}
                  </select>
                  <LeagueTable league={params.id} season={leagueSeason} />

                </div>);
    }

    return renderLeagueDetails();

}

export default LeagueDetails;
