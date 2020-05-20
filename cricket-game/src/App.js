import React, { useState, useEffect } from 'react';
import './App.css';
import { Table, Card, Button,Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [started, setStarted] = useState(false);
  const [battingTeam, setBattingTeam] = useState('teamA');
  const [bowlingTeam, setBowlingTeam] = useState('teamB');
  const [lastBallResult, setLastBallResult] = useState();

  const [result, setResult] = useState('');
  const [teams, setTeams] = useState({
    teamA: setDataForTeams(),
    teamB: setDataForTeams()
  })

  var randomeScores = ['0', '1', '2', '3', '4', '5', '6', 'wd', 'nb', 'out'];
  function setPlayersData(id) {
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
      dotsBowled: 0,
      foursGiven: 0,
      sixesGiven: 0,
      wides: 0,
      nbs: 0
    }
  }
  function get12Players() {
    let players = []; let i = 0;
    while (i < 12) {
      players.push(setPlayersData(i + 1));
      i++;
    }
    return players;
  }
  function setDataForTeams() {
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
  function getFormmatedLabel(label){
    return label === 'teamA' ? 'Team A' : 'Team B';
  }
  function setIndividualPlayerData(id, randomScore, isBatting = true) {
    let previousData = teams[isBatting? battingTeam: bowlingTeam].players[id];
    if (isBatting) {
      Object.assign(teams[battingTeam].players[id], {
        runs: previousData.runs + (+randomScore),
        balls: previousData.balls + 1,
        dots: (randomScore === '0' ? previousData.dots + 1 : previousData.dots),
        fours: (randomScore === '4' ? previousData.fours + 1 : previousData.fours),
        sixes: (randomScore === '6' ? previousData.sixes + 1 : previousData.sixes)
      });

    } else {
      Object.assign(teams[bowlingTeam].players[id], {
        runsGiven: previousData.runsGiven + (+randomScore),
        ballsBowled: previousData.ballsBowled + 1,
        activeBalls: (previousData.activeBalls === 5) ? 0 : previousData.activeBalls + 1,
        oversBowled: (previousData.activeBalls === 5) ? previousData.oversBowled + 1 : previousData.oversBowled,
        dotsBowled: (randomScore === '0' ? previousData.dotsBowled + 1 : previousData.dotsBowled),
        foursGiven: (randomScore === '4' ? previousData.foursGiven + 1 : previousData.foursGiven),
        sixesGiven: (randomScore === '6' ? previousData.sixesGiven + 1 : previousData.sixesGiven)
      });
    }
  }
  function interchangeStrikers(randomScore){
    if ((['1', '3', '5'].indexOf(randomScore) > -1 || teams[battingTeam].activeBalls === 0) && !(['1', '3', '5'].indexOf(randomScore) > -1 && teams[battingTeam].activeBalls === 0)) {
      [teams[battingTeam].strikerId, teams[battingTeam].nonStrikerId] = [teams[battingTeam].nonStrikerId, teams[battingTeam].strikerId];
    }
  }
  useEffect(() => {
    let interval = null;
    if (started) {
      interval = setInterval(() => {
        bowl();
      }, 1000);
    } else if (!started) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [started]);

  function bowl() {
    const randomScore = randomeScores[Math.floor(Math.random() * randomeScores.length)];
    if (teams[battingTeam].balls >= 120 || teams[battingTeam].wkts > 9 || (battingTeam === 'teamB' && teams[battingTeam].score > teams[bowlingTeam].score)) {
      setLastBallResult('');
      if (battingTeam === 'teamA') {
        alert(`${getFormmatedLabel(battingTeam)} completed Batting click on start to ${getFormmatedLabel(bowlingTeam)} inngs`);
        setBattingTeam('teamB');
        setBowlingTeam('teamA');
      } else {
        alert('Match completed');
        if (teams[battingTeam].score > teams[bowlingTeam].score) {
          setResult(`${getFormmatedLabel(battingTeam)} win by ${10 - teams[battingTeam].wkts} Wickets`);
        } else if(teams[battingTeam].score === teams[bowlingTeam].score){
          setResult(`Match tied.`);
        } else{
          setResult(`${getFormmatedLabel(bowlingTeam)} win by ${teams[bowlingTeam].score - teams[battingTeam].score} runs`);
        }
      }
      setStarted(false);
      return;
    }
    setLastBallResult(randomScore);
    if (!isNaN(randomScore)) {
      Object.assign(teams[battingTeam], {
        score: teams[battingTeam].score + (+randomScore),
        balls: teams[battingTeam].balls + 1,
        overs: teams[battingTeam].activeBalls === 5 ? teams[battingTeam].overs + 1 : teams[battingTeam].overs,
        activeBalls: teams[battingTeam].activeBalls === 5 ? 0 : teams[battingTeam].activeBalls + 1,
      });
    }
    let bowlerPrevious = teams[bowlingTeam].players[teams[bowlingTeam].bowlerId - 1];
    if (randomeScores.indexOf(randomScore) < 7) {
      setIndividualPlayerData(teams[battingTeam].strikerId - 1, randomScore);
      interchangeStrikers(randomScore);
      setIndividualPlayerData(teams[bowlingTeam].bowlerId - 1, randomScore, false);
      if (teams[battingTeam].activeBalls === 0) {
        teams[bowlingTeam].bowlerId = teams[bowlingTeam].bowlerId < 7 ? 12 : teams[bowlingTeam].bowlerId - 1;
      }
    } else if (randomeScores.indexOf(randomScore) === 7 || randomeScores.indexOf(randomScore) === 8) {
      let temp = {};
      if (randomeScores.indexOf(randomScore) === 7){
        temp = {wides: bowlerPrevious.wides + 1}
      }else{
        temp = {nbs: bowlerPrevious.nbs + 1}
      }
      teams[battingTeam].score += 1;
      Object.assign(teams[bowlingTeam].players[teams[bowlingTeam].bowlerId - 1], {
        runsGiven: bowlerPrevious.runsGiven + 1,
        ballsBowled: bowlerPrevious.ballsBowled + 1,
      },temp);
    } else if (randomeScores.indexOf(randomScore) === 9) {
      Object.assign(teams[bowlingTeam].players[teams[bowlingTeam].bowlerId - 1], {
        dotsBowled: bowlerPrevious.dotsBowled + 1,
        ballsBowled: bowlerPrevious.ballsBowled + 1,
        activeBalls: (bowlerPrevious.activeBalls === 5) ? 0 : bowlerPrevious.activeBalls + 1,
        oversBowled: (bowlerPrevious.activeBalls === 5) ? bowlerPrevious.oversBowled + 1 : bowlerPrevious.oversBowled,
        wkts: bowlerPrevious.wkts + 1
      });
      const ppd = teams[battingTeam].players[teams[battingTeam].strikerId - 1];
      Object.assign(teams[battingTeam].players[teams[battingTeam].strikerId - 1], {
        balls: ppd.balls + 1,
        dots: ppd.dots + 1,
        wketTakenById: teams[bowlingTeam].bowlerId
      });
      Object.assign(teams[battingTeam], {
        wkts: teams[battingTeam].wkts + 1,
        balls: teams[battingTeam].balls + 1,
        overs: teams[battingTeam].activeBalls === 5 ? teams[battingTeam].overs + 1 : teams[battingTeam].overs,
        activeBalls: teams[battingTeam].activeBalls === 5 ? 0 : teams[battingTeam].activeBalls + 1,
      });
      teams[battingTeam].strikerId = teams[battingTeam].strikerId > teams[battingTeam].nonStrikerId ? teams[battingTeam].strikerId + 1 : teams[battingTeam].nonStrikerId + 1;
      if (teams[battingTeam].activeBalls === 0) {
        teams[bowlingTeam].bowlerId = teams[bowlingTeam].bowlerId < 7 ? 12 : teams[bowlingTeam].bowlerId - 1;
        [teams[battingTeam].strikerId, teams[battingTeam].nonStrikerId] = [teams[battingTeam].nonStrikerId, teams[battingTeam].strikerId];
      }
    }
    setTeams({
      teamA: teams.teamA,
      teamB: teams.teamB
    });
  }
  return (<React.Fragment key="app">
    <div className="container-fluid border m-3 pt-5" >
      <div className="row pb-4">
        <div className="col-sm-4  offset-md-2">

          <Button onClick={toggle} block variant="primary">{started ? 'Stop' : 'Start'}</Button>
          
        </div>
        <div className="col-sm-4">
          <Card
            bg='success'
            text={'white'}
          >
            <Card.Header>Score Card  {lastBallResult && `-----Last Ball:  ${lastBallResult}`}</Card.Header>
            <Card.Body>
                <Row>
                  Team A  Score: {teams.teamA?.score} / {teams.teamA?.wkts}, {`(R.R  ${teams.teamA?.score && (teams.teamA?.score * 6/(teams.teamA?.overs*6+teams.teamA?.activeBalls)).toFixed(2)})`} Overs  {teams.teamA?.overs}.{teams.teamA?.activeBalls}
                </Row>
                <Row>
  Team B  Score: {teams.teamB?.score} / {teams.teamB?.wkts}, {battingTeam === 'teamB' && `target ${teams.teamA?.score}, `} Overs  {teams.teamB?.overs}.{teams.teamB?.activeBalls}
                </Row>
            </Card.Body>
          </Card>
        </div>

      </div>

      {result && <div className="alert alert-success" role="alert">
        {result}
      </div>}

      {
        Object.keys(teams).map((tm, i) => {
          return (<>

            <div className="row" >
              <div className="col-sm-6">{getFormmatedLabel(i ? bowlingTeam : battingTeam)}  Batting
    <Table striped bordered hover variant="dark" >
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
                    {teams[i ? bowlingTeam : battingTeam].players.map((e, id)=> {
                      if (e.balls || id < 2){
                      return (<tr key={id}>
                        <td>{`Player - ${e.id}`} {!i && teams[i ? bowlingTeam : battingTeam].strikerId === e.id ? '*' : ''}</td>
                        <td>{e.runs}</td>
                        <td>{e.balls}</td>
                        <td>{e.fours}</td>
                        <td>{e.sixes}</td>
                        <td>{e.wketTakenById ? `Player - ${e.wketTakenById}` : ''}</td>
                        <td>{(e.runs || e.balls) ? ((e.runs / e.balls) * 100).toFixed(2) : ''}</td>
                      </tr>);
                        } 
                    })}
                  </tbody>
                </Table></div>
              <div className="col-sm-6">


                {getFormmatedLabel(i ? battingTeam : bowlingTeam)}  Bowling
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
                    {teams[i ? battingTeam : bowlingTeam].players.map((e, i)=> {
                      if (e.ballsBowled || i === 11) {
                        return (
                          <tr key={i}>
                            <td>{`Player - ${e.id}`}</td>
                            <td>{e.oversBowled}.{e.activeBalls}</td>
                            <td>{e.runsGiven}</td>
                            <td>{e.wkts}</td>
                            <td>{(e.runsGiven && (e.oversBowled || e.activeBalls)) ? (e.runsGiven / (e.oversBowled*6 + e.activeBalls)*6).toFixed(2) : ''}</td>
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
                </Table>
              </div>
            </div>
          </>)
        })
      }

    </div>
  </React.Fragment>);

}
export default App;