import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { Table, Card, Button,Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [started, setStarted] = useState(false);
  const [battingTeam, setBattingTeam] = useState('teamA');
  const [bowlingTeam, setBowlingTeam] = useState('teamB');
  const [result, setResult] = useState('');
  const [teams, setTeams] = useState({
    teamA: setDataForTeams(),
    teamB: setDataForTeams()
  })

  var randomeScores = ['0', '1', '2', '3', '4', '5', '6', 'wd', 'nb', 'out'];
  // console.log('app');
  // var isNb = false;
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
        oversBowled: 0,
        activeBalls: 0,
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
        activeBalls: (previousData.activeBalls == 5) ? 0 : previousData.activeBalls+1,
        oversBowled: (previousData.activeBalls == 5) ? previousData.oversBowled+1 : previousData.oversBowled,
        dotsBowled: (randomScore === '0' ? previousData.dotsBowled + 1 : previousData.dotsBowled),
        foursGiven: (randomScore === '4' ? previousData.foursGiven + 1 : previousData.foursGiven),
        sixesGiven: (randomScore === '6' ? previousData.sixesGiven + 1 : previousData.sixesGiven),
        wides: (randomScore === 'wd' ? previousData.wides + 1 : previousData.wides),
        nbs: (randomScore === 'nb' ? previousData.nbs + 1 : previousData.nbs),
        wkts: (randomScore === 'out' ? previousData.wkts + 1 : previousData.wkts)
      });
    }
    // setTeams(teams);
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
      }, 1000);
    } else if (!started) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [started]);

  function bowl(){
    // debugger
    const randomScore = randomeScores[Math.floor(Math.random() * randomeScores.length)];
    console.log(randomScore);
    if(teams[battingTeam].balls >= 18 || teams[battingTeam].wkts >= 3 || (battingTeam === 'teamB' && teams[battingTeam].score > teams[bowlingTeam].score)){
     // clearInterval(interval);
     console.log(battingTeam, bowlingTeam);
     if (battingTeam === 'teamA'){
        alert(`${battingTeam} completed Batting click on start to ${bowlingTeam} inngs`);
        setBattingTeam('teamB');
        setBowlingTeam('teamA');
     } else{
          alert('Match completed');
          if (teams[battingTeam].score > teams[bowlingTeam].score){
            setResult(`${battingTeam} win by ${10 -teams[battingTeam].wkts} Wickets` );
          } else{
            setResult(`${bowlingTeam} win by ${teams[bowlingTeam].score - teams[battingTeam].score} runs` );
          }
     }
     setStarted(false);
      return;
    }

    if (!isNaN(randomScore)){
      Object.assign(teams[battingTeam], {
        score: teams[battingTeam].score+(+randomScore),
        balls: teams[battingTeam].balls+1,
        overs: teams[battingTeam].activeBalls === 5 ? teams[battingTeam].overs + 1 :  teams[battingTeam].overs,
        activeBalls: teams[battingTeam].activeBalls === 5 ? 0 : teams[battingTeam].activeBalls + 1,
      }); 
    }
    let bowlerPrevious =  teams[bowlingTeam].players[teams[bowlingTeam].bowlerId-1];
    if (randomeScores.indexOf(randomScore) < 7){
         updateRunsData(randomScore);
         setIndividualPlayerData(teams[bowlingTeam].bowlerId -1, randomScore, false);
         if (teams[battingTeam].activeBalls === 0){
          teams[bowlingTeam].bowlerId = teams[bowlingTeam].bowlerId < 7 ? 12 : teams[bowlingTeam].bowlerId -1;
        } 
    } else if(randomeScores.indexOf(randomScore) == 7){
      teams[battingTeam].score +=1;
      Object.assign(teams[bowlingTeam].players[teams[bowlingTeam].bowlerId-1], {
        runsGiven: bowlerPrevious.runsGiven+1,
        ballsBowled: bowlerPrevious.ballsBowled+1,
        wides: bowlerPrevious.wides+1
      });
    } else if(randomeScores.indexOf(randomScore) == 8){
      teams[battingTeam].score +=1; 
      Object.assign(teams[bowlingTeam].players[teams[bowlingTeam].bowlerId-1], {
        runsGiven: bowlerPrevious.runsGiven+1,
        ballsBowled: bowlerPrevious.ballsBowled+1,
        nbs: bowlerPrevious.nbs+1
      });
    }  else if(randomeScores.indexOf(randomScore) == 9){
      Object.assign(teams[bowlingTeam].players[teams[bowlingTeam].bowlerId-1], {
        dotsBowled: bowlerPrevious.dotsBowled+1,
        ballsBowled: bowlerPrevious.ballsBowled+1,
        activeBalls: (bowlerPrevious.activeBalls == 5) ? 0 : bowlerPrevious.activeBalls+1,
        oversBowled: (bowlerPrevious.activeBalls == 5) ? bowlerPrevious.oversBowled+1 : bowlerPrevious.oversBowled,
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
      teams[battingTeam].strikerId = teams[battingTeam].strikerId > teams[battingTeam].nonStrikerId ? teams[battingTeam].strikerId+1 : teams[battingTeam].nonStrikerId+1 ;
      if (teams[battingTeam].activeBalls === 0){
        teams[bowlingTeam].bowlerId = teams[bowlingTeam].bowlerId < 7 ? 12 : teams[bowlingTeam].bowlerId -1;
      } 
    }
    setTeams({
      teamA: teams.teamA,
      teamB: teams.teamB
    });
    console.log(teams);
  }
  return (<>
    <div className="row">
      <div>
        <Row className="justify-content-md-center">
        <Button onClick={toggle} variant="primary">{started ? 'Stop' : 'Start'}</Button></Row>
      </div>
      <Card
      bg='success'
      text={ 'white'}
      style={{ width: '18rem' }}
    >
      <Card.Header>Score Card</Card.Header>
      <Card.Body>
        <Card.Title></Card.Title>
        <Card.Text>
        <Row>
          Team A Score: {teams.teamA?.score} / {teams.teamA?.wkts}, Overs  {teams.teamA?.overs}.{teams.teamA?.activeBalls}
        </Row>
        <Row>
        Team B Score: {teams.teamB?.score} / {teams.teamB?.wkts}, Overs  {teams.teamB?.overs}.{teams.teamB?.activeBalls}
        </Row>
        </Card.Text>
      </Card.Body>
    </Card>
    <h2>{result}</h2>
    {
      Object.keys(teams).map((tm,i)=>{
        return(<>
         {tm} Batting
        <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Bastman Name</th>
            <th>Runs</th>
            <th>Balls</th>
            <th>4's</th>
            <th>6's</th>
            <th>Wicket By</th>
            <th>Strike Rate</th>
          </tr>
        </thead>
        <tbody>
          {teams[tm].players.map(e => {
          // if (e.runs || e.balls){
              return(<tr>
                <td>{`Player - ${e.id}`}</td>
                <td>{e.runs}</td>
                <td>{e.balls}</td>
                <td>{e.fours}</td>
                <td>{e.sixes}</td>
                <td>{e.wketTakenById ? `Player - ${e.wketTakenById}` : ''}</td>
                <td>{ (e.runs || e.balls) ? ((e.runs/e.balls)*100).toFixed(2) : ''}</td>
                </tr>);
           //  } 
            })}
        </tbody>
      </Table>
  
      {tm} Bowling
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Bowler Name</th>
            <th>Overs</th>
            <th>Runs</th>
            <th>Wickets</th>
            <th>Econ</th>
            <th>0's</th>
            <th>4's</th>
            <th>6's</th>
            <th>WD</th>
            <th>NB</th>
          </tr>
        </thead>
        <tbody>
          {teams[tm].players.map(e => {
            if (e.ballsBowled || e.activeBalls){
              return (
                <tr>
                <td>{`Player - ${e.id}`}</td>
                <td>{e.oversBowled}.{e.activeBalls}</td>
                <td>{e.runsGiven}</td>
                <td>{e.wkts}</td>
                <td>{(e.runsGiven && e.oversBowled) ? (e.runsGiven/e.oversBowled).toFixed(2) : ''}</td>
                <td>{e.dotsBowled}</td>
                <td>{e.foursGiven}</td>
                <td>{e.sixesGiven}</td>
                <td>{e.wides}</td>
                <td>{e.nbs}</td>
                 </tr>
              );
            } 
          })}
        </tbody>
      </Table></>)
    })
  }
  </div></>);

}
export default App;
