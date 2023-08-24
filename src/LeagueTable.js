import {useState, useEffect} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import React from 'react';
import axios from 'axios'

const API_BASE_PATH = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;
const LEAGUE_SEASON_TABLE_PATH = API_BASE_PATH + "/lookuptable.php";


function LeagueTable(props){
    const params = useParams();
    const navigate = useNavigate();

    const [leagueTable, setLeagueTable] = useState([]);
    const [tableFound, setTableFound] = useState(false);

    const leagueTableParams = {params: {}};

    useEffect(() => {
      async function getLeagueTable(){
        try {

          leagueTableParams.params.l = props.league;
          leagueTableParams.params.s = props.season;

          const queryResponse = await axios.get(LEAGUE_SEASON_TABLE_PATH, leagueTableParams);

          if (typeof queryResponse.data === 'object'){
            const queryResult = await queryResponse.data.table;
            await setLeagueTable(queryResult);
            await setTableFound(true);
          }
          else{
            return;
          }

        }
        catch (err) {
          console.log(`ERROR QUERYING TABLE ${err}`);
          return;
        }
      }

      setTableFound(false);
      setLeagueTable([]);
      getLeagueTable();

    }, [props.league, props.season])


    return (<div className="league-table">
              {tableFound ? leagueTable.map(c => <>   <div> {c['intRank']} </div>
                                                      <img src={c['strTeamBadge']} alt={c['strTeam']} className="tiny-badge"/>
                                                      <div className="club-name" onClick={() => navigate(`/club/${c['idTeam']}`)}> {c['strTeam']} </div>
                                                      <div> {c['intPlayed']} </div>
                                                      <div className="wins"> {c['intWin']} </div>
                                                      <div className="draws"> {c['intDraw']} </div>
                                                      <div className="losses"> {c['intLoss']} </div>
                                                      <div> {c['intGoalsFor']} </div>
                                                      <div> {c['intGoalsAgainst']} </div>
                                                      <div className="points"> {c['intPoints']} </div>
                                                 </>) : <div> TABLE NOT FOUND </div>}
            </div>);

}

export default LeagueTable;
