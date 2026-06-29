import React from 'react';
import Squares from './Squares.js';
import './App.css';
import sonic from './sonic.png';
import eggman from './eggman.png';

const PLAYERS = {
  sonic: {
    id: 'sonic',
    name: 'Sonic',
    image: sonic,
    alt: 'Sonic token',
    resultTitle: 'Sonic victory dash!',
    resultText: 'Gold rings fly across the track while Sonic takes the round.',
    resultKicker: 'Finish line crossed',
  },
  eggman: {
    id: 'eggman',
    name: 'Dr. Eggman',
    image: eggman,
    alt: 'Dr. Eggman token',
    resultTitle: 'Eggman takeover!',
    resultText: 'Warning lights flash as Dr. Eggman claims the board.',
    resultKicker: 'Machine activated',
  },
};

const CELEBRATION_RINGS = Array.from({ length: 7 }, (_, index) => index);
const CELEBRATION_SPARKS = Array.from({ length: 12 }, (_, index) => index);
const SPEED_LINES = Array.from({ length: 6 }, (_, index) => index);

const WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const emptySquares = () => Array(9).fill(null);

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: emptySquares(),
      currentPlayer: PLAYERS.sonic.id,
      winner: null,
      winningLine: [],
      isDraw: false,
      scores: {
        sonic: 0,
        eggman: 0,
        draws: 0,
      },
      gamesPlayed: 0,
    };
  }

  findWinner = (squares) => {
    for (let i = 0; i < WINNING_COMBOS.length; i += 1) {
      const [a, b, c] = WINNING_COMBOS[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {
          winner: squares[a],
          winningLine: WINNING_COMBOS[i],
        };
      }
    }

    return {
      winner: null,
      winningLine: [],
    };
  };

  handleSquareClick = (index) => {
    this.setState((prevState) => {
      if (prevState.squares[index] || prevState.winner || prevState.isDraw) {
        return null;
      }

      const nextSquares = prevState.squares.slice();
      nextSquares[index] = prevState.currentPlayer;
      const result = this.findWinner(nextSquares);
      const isDraw = !result.winner && nextSquares.every(Boolean);
      const nextPlayer =
        prevState.currentPlayer === PLAYERS.sonic.id ? PLAYERS.eggman.id : PLAYERS.sonic.id;
      const scores = { ...prevState.scores };

      if (result.winner) {
        scores[result.winner] += 1;
      }

      if (isDraw) {
        scores.draws += 1;
      }

      return {
        squares: nextSquares,
        currentPlayer: result.winner || isDraw ? prevState.currentPlayer : nextPlayer,
        winner: result.winner,
        winningLine: result.winningLine,
        isDraw,
        scores,
        gamesPlayed: result.winner || isDraw ? prevState.gamesPlayed + 1 : prevState.gamesPlayed,
      };
    });
  };

  resetRound = () => {
    this.setState({
      squares: emptySquares(),
      currentPlayer: PLAYERS.sonic.id,
      winner: null,
      winningLine: [],
      isDraw: false,
    });
  };

  resetMatch = () => {
    this.setState({
      squares: emptySquares(),
      currentPlayer: PLAYERS.sonic.id,
      winner: null,
      winningLine: [],
      isDraw: false,
      scores: {
        sonic: 0,
        eggman: 0,
        draws: 0,
      },
      gamesPlayed: 0,
    });
  };

  getStatusText = () => {
    const { currentPlayer, isDraw, winner } = this.state;

    if (winner) {
      return `${PLAYERS[winner].name} wins the round!`;
    }

    if (isDraw) {
      return 'Draw round. Nobody gets the chaos emerald.';
    }

    return `${PLAYERS[currentPlayer].name} is up.`;
  };

  getResultDetails = () => {
    const { isDraw, winner } = this.state;

    if (winner) {
      return {
        tone: winner,
        title: PLAYERS[winner].resultTitle,
        text: PLAYERS[winner].resultText,
        kicker: PLAYERS[winner].resultKicker,
        playerId: winner,
      };
    }

    if (isDraw) {
      return {
        tone: 'draw',
        title: 'Draw round',
        text: 'Both rivals crash through the same finish line. Run it back.',
        kicker: 'Photo finish',
      };
    }

    return null;
  };

  renderToken = (playerId) => {
    if (!playerId) {
      return null;
    }

    const player = PLAYERS[playerId];
    return <img src={player.image} alt={player.alt} />;
  };

  renderResultAnimation = () => {
    const details = this.getResultDetails();

    if (!details) {
      return null;
    }

    const opponentId =
      details.playerId && details.playerId === PLAYERS.sonic.id ? PLAYERS.eggman.id : PLAYERS.sonic.id;

    return (
      <section
        className={`result-animation result-animation--${details.tone}`}
        aria-live="polite"
        aria-label={details.title}
      >
        <div className="result-stage" aria-hidden="true">
          <div className="result-sky">
            {CELEBRATION_RINGS.map((ring) => (
              <span key={`ring-${ring}`} className={`result-ring result-ring--${ring + 1}`} />
            ))}
            {CELEBRATION_SPARKS.map((spark) => (
              <span key={`spark-${spark}`} className={`result-spark result-spark--${spark + 1}`} />
            ))}
          </div>
          <div className="speed-lane">
            {SPEED_LINES.map((line) => (
              <span key={`line-${line}`} className={`speed-line speed-line--${line + 1}`} />
            ))}
          </div>
          <span className="finish-line" />
          {details.playerId ? (
            <>
              <div className={`winner-avatar winner-avatar--${details.playerId}`}>
                {this.renderToken(details.playerId)}
              </div>
              <div className={`runner-shadow runner-shadow--${details.playerId}`} />
              <div className="opponent-avatar">{this.renderToken(opponentId)}</div>
            </>
          ) : (
            <div className="draw-avatars">
              <div className="draw-avatar draw-avatar--sonic">{this.renderToken(PLAYERS.sonic.id)}</div>
              <div className="draw-avatar draw-avatar--eggman">{this.renderToken(PLAYERS.eggman.id)}</div>
            </div>
          )}
        </div>
        <div className="result-copy">
          <span className="result-kicker">{details.kicker}</span>
          <h2>{details.title}</h2>
          <p>{details.text}</p>
        </div>
      </section>
    );
  };

  render() {
    const { currentPlayer, gamesPlayed, isDraw, scores, squares, winner, winningLine } = this.state;
    const statusTone = winner ? 'win' : isDraw ? 'draw' : 'active';

    return (
      <main className="game-shell">
        <section className="game-card" aria-labelledby="game-title">
          <div className="game-header">
            <div>
              <p className="eyebrow">Sonic vs. Dr. Eggman</p>
              <h1 id="game-title">Tic Tac Toe</h1>
            </div>
            <div className={`status-pill status-pill--${statusTone}`} aria-live="polite">
              {this.getStatusText()}
            </div>
          </div>

          <div className="scoreboard" aria-label="Match score">
            <div>
              <span>Sonic</span>
              <strong>{scores.sonic}</strong>
            </div>
            <div>
              <span>Draws</span>
              <strong>{scores.draws}</strong>
            </div>
            <div>
              <span>Eggman</span>
              <strong>{scores.eggman}</strong>
            </div>
          </div>

          <div className="turn-card">
            <span>Current token</span>
            <div className="token-preview">{this.renderToken(currentPlayer)}</div>
          </div>

          <div className="gameboard" role="grid" aria-label="Tic Tac Toe board">
            {squares.map((value, index) => (
              <Squares
                key={index}
                value={value}
                index={index}
                isHighlighted={winningLine.includes(index)}
                isDisabled={Boolean(value || winner || isDraw)}
                onSquareClick={this.handleSquareClick}
                renderToken={this.renderToken}
              />
            ))}
          </div>

          {this.renderResultAnimation()}

          <div className="controls" aria-label="Game controls">
            <button type="button" className="primary-button" onClick={this.resetRound}>
              New round
            </button>
            <button type="button" className="secondary-button" onClick={this.resetMatch}>
              Reset match
            </button>
            <span className="games-played">{gamesPlayed} completed</span>
          </div>
        </section>
      </main>
    );
  }
}

export default Board;
