import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [started, setStarted] = useState(false);
  var randomeScores = ['0', '1', '2', '3', '4', '5', '6', 'wd', 'nb', 'out'];
  var battingTeam = 'teamA';
  var bowlingTeam = 'teamB';
  function setPlayersData(id){
    return {
        id: id,
        runs: 0,
        balls: 0,
        dots: 0,
        fours: 0,
        sixes: 0,
        wketTakenById: 0,
        ballsBowled: 0,
        runsGiven: 0,
        wkts: 0,
        dotsBowled:0,
        foursGiven:0,
        sixesGiven: 0,
        wides: 0,
        nbs: 0
    }
  }
  function get12Players(){
    let players = [];let i = 0;
    while(i < 12){
      players.push(setPlayersData(i+1));
      i++;
    }
    return players;
  }
  function setDataForTeams(){
    return {
      score: 0,
      balls: 0,
      wkts: 0,
      overs: 0,
      activeBalls: 0,
      strikerId: 1,
      nonStrikerId: 2,
      bowlerId: 12,
      players: get12Players(),
    };
  }
  var teams = {
    teamA: setDataForTeams(),
    teamB: setDataForTeams(),
  }
  function toggle() {
    setStarted(!started);
  }
  function setIndividualPlayerData(id, randomScore, isBatting = true){
    if(isBatting){
    let previousData = teams[battingTeam].players[id];
      Object.assign(teams[battingTeam].players[id], {
        runs: previousData.runs+(+randomScore),
        balls: previousData.balls+1,
        dots: (randomScore === '0' ? previousData.dots + 1 : previousData.dots),
        fours: (randomScore === '4' ? previousData.fours + 1 : previousData.fours),
        sixes: (randomScore === '6' ? previousData.sixes + 1 : previousData.sixes)
      });
    } else{
    let previousData = teams[bowlingTeam].players[id];
      Object.assign(teams[bowlingTeam].players[id], {
        runsGiven: previousData.runsGiven+(+randomScore),
        ballsBowled: previousData.ballsBowled+1,
        dotsBowled: (randomScore === '0' ? previousData.dotsBowled + 1 : previousData.dotsBowled),
        foursGiven: (randomScore === '4' ? previousData.foursGiven + 1 : previousData.foursGiven),
        sixesGiven: (randomScore === '6' ? previousData.sixesGiven + 1 : previousData.sixesGiven),
        wides: (randomScore === 'wd' ? previousData.wides + 1 : previousData.wides),
        nbs: (randomScore === 'nb' ? previousData.nbs + 1 : previousData.nbs),
        wkts: (randomScore === 'out' ? previousData.wkts + 1 : previousData.wkts)
      });
    }
  }
  function updateRunsData(randomScore){
    setIndividualPlayerData(teams[battingTeam].strikerId -1, randomScore);
    if (['1', '3', '5'].indexOf(randomScore) > -1 || teams[battingTeam].activeBalls == 0){
      [teams[battingTeam].strikerId, teams[battingTeam].nonStrikerId] = [teams[battingTeam].nonStrikerId, teams[battingTeam].strikerId];
    }
  } 


  useEffect(() => {
    console.log('useeff');
    let interval = null;
    
    if (started) {
      interval = setInterval(() => {
        // setSeconds(seconds => seconds + 1);
        bowl();
      }, 5000);
    } else if (!started) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [started]);

  function bowl(){
    debugger
    const randomScore = randomeScores[Math.floor(Math.random() * randomeScores.length)];
    console.log(randomScore);
    if(teams[battingTeam].balls > 120){
     // clearInterval(interval);
      return;
    }
    if (!isNaN(randomScore)){
      Object.assign(teams[battingTeam], {
        score: teams[battingTeam].score+(+randomScore),
        balls: teams[battingTeam].balls+1,
        overs: teams[battingTeam].activeBalls == 5 ? teams[battingTeam].overs + 1 :  teams[battingTeam].overs,
        activeBalls: teams[battingTeam].activeBalls == 5 ? 0 : teams[battingTeam].activeBalls + 1,
      }); 
      if (teams[battingTeam].activeBalls === 0){
        teams[bowlingTeam].bowlerId -= 1;
      } 
    }
    let bowlerPrevious =  teams[bowlingTeam].bowlerId -1;
    if (randomeScores.indexOf(randomScore) < 7){
         updateRunsData(randomScore);
         setIndividualPlayerData(teams[bowlingTeam].bowlerId -1, randomScore, false);
    } else if(randomeScores.indexOf(randomScore) == 7){
      Object.assign(teams[bowlingTeam].players[teams[bowlingTeam].bowlerId-1], {
        runsGiven: bowlerPrevious.runsGiven+1,
        ballsBowled: bowlerPrevious.ballsBowled+1,
        wides: bowlerPrevious.wides+1
      });
    } else if(randomeScores.indexOf(randomScore) == 8){
      Object.assign(teams[bowlingTeam].players[teams[bowlingTeam].bowlerId-1], {
        runsGiven: bowlerPrevious.runsGiven+1,
        ballsBowled: bowlerPrevious.ballsBowled+1,
        nbs: bowlerPrevious.nbs+1
      });
    }  else if(randomeScores.indexOf(randomScore) == 9){
      Object.assign(teams[bowlingTeam].players[teams[bowlingTeam].bowlerId-1], {
        dotsBowled: bowlerPrevious.dotsBowled+1,
        ballsBowled: bowlerPrevious.ballsBowled+1,
        wkts: bowlerPrevious.wkts+1
      });
      const ppd = teams[battingTeam].players[teams[battingTeam].strikerId - 1];
      Object.assign(teams[battingTeam].players[teams[battingTeam].strikerId - 1], {
        balls: ppd.balls+1,
        dots: ppd.dots + 1,
        wketTakenById: teams[bowlingTeam].bowlerId 
      });

      Object.assign(teams[battingTeam], {
        wkts: teams[battingTeam].wkts+1,
        balls: teams[battingTeam].balls+1,
        overs: teams[battingTeam].activeBalls == 5 ? teams[battingTeam].overs + 1 :  teams[battingTeam].overs,
        activeBalls: teams[battingTeam].activeBalls == 5 ? 0 : teams[battingTeam].activeBalls + 1,
      }); 
      if (teams[battingTeam].strikerId > teams[battingTeam].nonStrikerId){
        teams[battingTeam].strikerId += 1 
      } else{
        teams[battingTeam].nonStrikerId += 1 
      }
    }
    console.log(teams);
  }
  return (
    // <div className="App">
    //   <h1>Team A win the Toss and elected to Bat First</h1>
    //    <button onClick={onClickStartStop} className="btn btn-secondary mr-2" type="buttom" 
    //     >{started ? 'Stop' : 'Start'}</button>
    // </div>
    <div className="app">
      <div className="time">
        {/* {seconds}s */}
      </div>
      <div className="row">
        <button className={`button button-primary button-primary-${started ? 'active' : 'inactive'}`} onClick={toggle}>
          {started ? 'Stop' : 'Start'}
        </button>
        {/* <button className="button" onClick={reset}>
          Reset
        </button> */}
      </div>
    </div>
  );
}

export default App;
