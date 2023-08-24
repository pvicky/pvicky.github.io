import {useState, useEffect} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import React from 'react';
import axios from 'axios'

const API_BASE_PATH = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;
const PLAYER_DETAILS_PATH = API_BASE_PATH + "/lookupplayer.php";
const PLAYER_PAST_CLUBS_PATH = API_BASE_PATH + "/lookupformerteams.php";

function PlayerDetails(props){
    const params = useParams();
    const navigate = useNavigate();

    const queryParams = {params: {}};
    const [playerDetails, setPlayerDetails] = useState({});
    const [pastClubs, setPastClubs] = useState([]);


    const selectedPlayerFields = ["strPlayer",
                                  "strNationality",
                                  "dateBorn",
                                  "strStatus",
                                  "strTeam",
                                  "strPosition",
                                  "strDescriptionEN"];

    console.log(params.id);


    useEffect(() => {
        console.log(`START OF USEEFFECT PARAMS VALUE ${params.id}`)

        async function getPlayerDetails(){
            try {

                await console.log(`START OF GETTING PLAYER DETAILS ${params.id}`);

                const queryResponse = await axios.get(PLAYER_DETAILS_PATH, queryParams);
                const queryResult = await queryResponse.data.players[0];
                await console.log(queryResult);


                await setPlayerDetails(queryResult);
                await console.log(`FINISHED GETTING PLAYER DETAILS ${params.id}`);
                return;
            }
            catch {
                console.log(`ERROR DURING QUERYING DETAILS`);
                return;
            }
        }

        async function getPastClubs(){
            try {

                await console.log(`START OF GETTING PLAYER PAST CLUBS ${params.id}`);

                const queryResponse = await axios.get(PLAYER_PAST_CLUBS_PATH, queryParams);
                const queryResult = await queryResponse.data.formerteams;
                await console.log(queryResult);

                if (queryResult != null){
                    await setPastClubs(queryResult);
                }
                await console.log(`FINISHED GETTING PLAYER PAST CLUBS ${params.id}`);
                return;
            }
            catch {
                console.log(`ERROR DURING QUERYING PAST CLUBS`);
                return;
            }
        }



        queryParams.params.id = params.id;
        setPlayerDetails({});
        setPastClubs([]);
        getPlayerDetails();
        getPastClubs();

    }, [params.id]);



    function playerObjectToArray(object) {

        const keyValArray = Array(selectedFields.length);

        for (const key in object){
            if (selectedFields.indexOf(key) != -1){
                const newKey = (str => str[0].toUpperCase()+str.slice(1,))(key.split("_").join(" "));
                if (object[key] === null){
                    continue;
                }
                else if (typeof object[key] === "string"){
                    let val = object[key];

                    keyValArray[selectedFields.indexOf(key)] = [newKey, val];
                }
                else if (Array.isArray(object[key])){

                    let arrayVals = [];
                    for (let i = 0; i < object[key].length; i++){
                        if (typeof object[key][i] === "object" && "name" in object[key][i])
                            arrayVals.push(object[key][i]["name"]);
                    }
                    keyValArray[selectedFields.indexOf(key)] = [newKey, arrayVals.join(", ")];
                }
                else {
                    let val = new String(object[key]);

                    keyValArray[selectedFields.indexOf(key)] = [newKey, val];
                }
            }
        }
        console.log(keyValArray);
        return keyValArray;
    }


    function renderDetails(){


        console.log(`START RENDERING PLAYER ${params.id}`);


        return (<div className="main-body">
                    <img src={playerDetails['strCutout']+'/preview'} className="details-poster"/>
                    <div className="details-keyVals">
                      <div className="details-keyVal">
                        <div className="page-context"> {playerDetails["strPlayer"]} </div>
                        <div> Nationality: {playerDetails["strNationality"]} </div>
                        <div> Birth date: {playerDetails["dateBorn"]} </div>
                        <div> {playerDetails["strStatus"]} </div>
                        <div> Club: <span className="club-name" onClick={() => navigate(`/club/${playerDetails["idTeam"]}`)}> {playerDetails["strTeam"]} </span> </div>
                        <div> Position: {playerDetails["strPosition"]} </div>
                        <div className="description"> {playerDetails["strDescriptionEN"]} </div>
                      </div>
                    </div>

                    <h2>Past Clubs</h2>
                    <div className="entries-club">
                      {pastClubs.map(c => <div className="entry-club">
                                            <img src={c['strTeamBadge']+'/tiny'} onClick={() => navigate(`/club/${c['idFormerTeam']}`)} alt={c['strFormerTeam']}/>
                                            <div className="club-name" onClick={() => navigate(`/club/${c['idFormerTeam']}`)}> {c['strFormerTeam']} </div>
                                            <div className="event-date"> {c['strJoined']} - {c['strDeparted']} </div>
                                          </div>)}
                    </div>

                </div>);

    }

    return renderDetails();

}


export default PlayerDetails;
