import {useState, useEffect} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import React from 'react';
import axios from 'axios'

const API_BASE_PATH = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`
const CLUB_INFO_PATH = API_BASE_PATH + '/lookupteam.php';
const CLUB_PLAYERS_PATH = API_BASE_PATH + '/lookup_all_players.php';
const CLUB_LAST_EVENTS_PATH = API_BASE_PATH + '/eventslast.php';
const CLUB_NEXT_EVENTS_PATH = API_BASE_PATH + '/eventsnext.php';

function ClubDetails(props){
    const params = useParams();
    const navigate = useNavigate();

    const queryParams = {params: {}};
    const [clubInfo, setClubInfo] = useState({});
    const [clubPlayers, setClubPlayers] = useState([]);
    const [lastFixtures, setLastFixtures] = useState([]);
    const [nextFixtures, setNextFixtures] = useState([]);


    const selectedClubInfoFields = ["strTeam",
                                    "intFormedYear",
                                    "strLeague",
                                    "strStadium",
                                    "strDescriptionEN"];

    const selectedPlayerFields = ["idPlayer",
                                  "strPlayer",
                                  "strNationality",
                                  "strPosition",
                                  "dateBorn",
                                  "strNumber",
                                  "strCutout"]

    const selectedEventFields = ["strHomeTeam",
                                 "idHomeTeam",
                                 "strAwayTeam",
                                 "idAwayTeam",
                                 "strLeague",
                                 "strSeason",
                                 "dateEvent",
                                 "intHomeScore",
                                 "intAwayScore"]

    console.log(params.id);


    useEffect(() => {
        console.log(`START OF USEEFFECT PARAMS VALUE ${params.id}`)

        async function getClubInfo(){
            try {

                await console.log(`START OF GETTING CLUB DETAILS ${params.id}`);

                const queryResponse = await axios.get(CLUB_INFO_PATH, queryParams);
                const queryResult = await queryResponse.data.teams[0];
                await console.log(queryResult);

                // const keyValArray = await clubObjectToArray(queryResult);

                await setClubInfo(queryResult);
                await console.log(`FINISHED GETTING CLUB DETAILS ${params.id}`);
                return;
            }
            catch {
                console.log(`ERROR DURING QUERYING DETAILS`);
                return;
            }
        }

        async function getClubPlayers(){
            try {

                await console.log(`START OF GETTING CLUB PLAYERS ${params.id}`);

                const queryResponse = await axios.get(CLUB_PLAYERS_PATH, queryParams);
                const queryResult = await queryResponse.data.player;
                await console.log(queryResult);

                await sortPlayers(queryResult);


                await console.log(queryResult);
                await setClubPlayers(queryResult);
                await console.log(`FINISHED GETTING CLUB PLAYERS ${params.id}`);
                return;
            }
            catch {
                console.log(`ERROR DURING QUERYING PLAYERS`);
                return;
            }
        }

        async function getFixtures(){
            try {

                await console.log(`START OF GETTING CLUB FIXTURES ${params.id}`);

                let queryResponse = await axios.get(CLUB_LAST_EVENTS_PATH, queryParams);
                let queryResult = await queryResponse.data.results;
                await console.log(queryResult);

                const lastEvents = await extractEvents(queryResult);
                await setLastFixtures(queryResult);


                queryResponse = await axios.get(CLUB_NEXT_EVENTS_PATH, queryParams);
                queryResult = await queryResponse.data.events;
                await console.log(queryResult);

                const nextEvents = await extractEvents(queryResult);
                await setNextFixtures(queryResult);

                await console.log(`FINISHED GETTING CLUB FIXTURES ${params.id}`);
                return;
            }
            catch {
                console.log(`ERROR DURING QUERYING FIXTURES`);
                return;
            }
        }

        queryParams.params.id = params.id;
        setClubInfo([]);
        setClubPlayers([]);
        setLastFixtures([]);
        setNextFixtures([]);

        getClubInfo();
        getClubPlayers();
        getFixtures();

    }, [params.id]);



    function clubObjectToArray(object) {

        const keyValArray = Array(selectedClubInfoFields.length);

        for (const key in object){
            if (selectedClubInfoFields.indexOf(key) != -1){
                const newKey = (str => str[0].toUpperCase()+str.slice(1,))(key.split("_").join(" "));
                if (object[key] === null){
                    continue;
                }
                else if (typeof object[key] === "string"){
                    let val = object[key];

                    keyValArray[selectedClubInfoFields.indexOf(key)] = [newKey, val];
                }
                else if (Array.isArray(object[key])){

                    let arrayVals = [];
                    for (let i = 0; i < object[key].length; i++){
                        if (typeof object[key][i] === "object" && "name" in object[key][i])
                            arrayVals.push(object[key][i]["name"]);
                    }
                    keyValArray[selectedClubInfoFields.indexOf(key)] = [newKey, arrayVals.join(", ")];
                }
                else {
                    let val = new String(object[key]);

                    keyValArray[selectedClubInfoFields.indexOf(key)] = [newKey, val];
                }
            }
        }
        console.log(keyValArray);
        return keyValArray;
    }



    function extractEvents(arr){

        const eventsArr = [];
        let i = 0;
        while (i < arr.length){
            const eventArr = Array(selectedEventFields.length);

            for (let j = 0; j < selectedEventFields.length; j++){
                if (arr[i][selectedEventFields[j]] != null){
                    eventArr[j] = arr[i][selectedEventFields[j]];
                }
                else {
                    eventArr[j] = "";
                }
            }

            eventsArr.push(eventArr);
            i++;
        }

        return eventsArr;
    }



    function sortPlayers(arr){

        arr.sort((a,b) => {
            const aNum = parseInt(a.strNumber), bNum = parseInt(b.strNumber);
            if (isNaN(aNum) && isNaN(bNum)) {
                return 1;
            }
            else if (!isNaN(aNum) && isNaN(bNum)) {
                return -1;
            }
            else if (isNaN(aNum) && !isNaN(bNum)) {
                return 1;
            }
            else {
                if (aNum > bNum)
                    return 1;
                else if (bNum > aNum)
                    return -1;
                else
                    return 0;
            }
        });
    }


    function colouriseMatch(obj){
        const homeScore = parseInt(obj['intHomeScore']), awayScore = parseInt(obj['intAwayScore']);

        if ((homeScore > awayScore && obj['idHomeTeam'] === clubInfo['idTeam']) || (homeScore < awayScore && obj['idAwayTeam'] === clubInfo['idTeam'])){
            return (<><div className="score-home wins"> {obj['intHomeScore']} </div>
                      <div className="score-separator wins"> - </div>
                      <div className="score-away wins"> {obj['intAwayScore']} </div></>);
        }
        else if ((homeScore < awayScore && obj['idHomeTeam'] === clubInfo['idTeam']) || (homeScore > awayScore && obj['idAwayTeam'] === clubInfo['idTeam'])) {
            return (<><div className="score-home losses"> {obj['intHomeScore']} </div>
                      <div className="score-separator losses"> - </div>
                      <div className="score-away losses"> {obj['intAwayScore']} </div></>);
        }
        else {
            return (<><div className="score-home draws"> {obj['intHomeScore']} </div>
                      <div className="score-separator draws"> - </div>
                      <div className="score-away draws"> {obj['intAwayScore']} </div></>);
        }
    }

    function renderDetails(){

        console.log(`START RENDERING CLUB ${params.id}`);


        return (<div className="main-body">
                  <div className="info-container">
                    <img src={clubInfo['strTeamBadge']+'/preview'} alt="Team Badge"/>
                    <div className="club-info-vals">
                        <div className="page-context"> {clubInfo['strTeam']} </div>
                        <div> Established: {clubInfo['intFormedYear']} </div>
                        <div> League: <span className="event-league" onClick={() => navigate(`/league/${clubInfo['idLeague']}`)}> {clubInfo['strLeague']} </span> </div>
                        <div> Stadium: {clubInfo['strStadium']} </div>
                        <div className="description"> {clubInfo['strDescriptionEN']} </div>
                    </div>
                  </div>

                  <h2>Squad</h2>
                  <div className="players-container">
                    {clubPlayers.map((obj) => <div className="player-row">
                                                  <img src={obj['strCutout']+'/preview'} className="player-mugshot" onClick={() => navigate(`/player/${obj['idPlayer']}`)} />
                                                  <div onClick={() => navigate(`/player/${obj['idPlayer']}`)} className="player-name"> {obj['strPlayer']} </div>
                                                  <span className="player-number"> {obj['strNumber']} </span>
                                                  <span className="player-position"> {obj['strPosition']} </span>
                                               </div>)
                    }
                  </div>

                  <h2>Last Games</h2>
                  <div className="last-events-container">
                    {lastFixtures.map((obj) => <>
                                                    <div className="event-date"> {obj['dateEvent']} </div>
                                                    <div className="event-league" onClick={() => navigate(`/league/${obj['idLeague']}`)}> {obj['strLeague']} </div>
                                                    <div className="event-home-team" onClick={() => navigate(`/club/${obj['idHomeTeam']}`)}> {obj['strHomeTeam']} </div>
                                                    {colouriseMatch(obj)}
                                                    <div className="event-away-team" onClick={() => navigate(`/club/${obj['idAwayTeam']}`)}> {obj['strAwayTeam']} </div>
                                               </>)
                    }
                  </div>

                  <h2>Next Games</h2>
                  <div className="next-events-container">
                    {nextFixtures.map((obj) => <>
                                                  <div className="event-date"> {obj['dateEvent']} </div>
                                                  <div className="event-league" onClick={() => navigate(`/league/${obj['idLeague']}`)}> {obj['strLeague']} </div>
                                                  <div className="event-home-team" onClick={() => navigate(`/club/${obj['idHomeTeam']}`)}> {obj['strHomeTeam']} </div>
                                                  <div className="score-separator"> vs </div>
                                                  <div className="event-away-team" onClick={() => navigate(`/club/${obj['idAwayTeam']}`)}> {obj['strAwayTeam']} </div>
                                               </>)
                    }
                  </div>

                </div>);

    }

    return renderDetails();

}


export default ClubDetails;
