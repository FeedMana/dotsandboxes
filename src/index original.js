import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.less';

function Square(props) {
  return (
    <button className="square" style={props.style}>
      {props.value}
    </button>
  );
}

// function Dot() {
//   return <div className="dot" />;
// }

// function Spacer() {
//   return <div className="spacer" />;
// }

function VertiLine(props) {
  let classSwitch;
  switch (props.pOneIsNext) {
    case true:
      classSwitch = 'verti-line line greenLine';
      break;
    case false:
      classSwitch = 'verti-line line orangeLine';
      break;
    default:
      break;
  }

  return (
    <button className={classSwitch} onClick={props.onClick} style={props.style}>
      {props.value}
    </button>
  );
}

function HoriLine(props) {
  var classSwitcher;
  switch (props.pOneIsNext) {
    case true:
      classSwitcher = 'hori-line line greenLine';
      break;
    case false:
      classSwitcher = 'hori-line line orangeLine';
      break;
    default:
      break;
  }

  return (
    <button
      className={classSwitcher}
      onClick={props.onClick}
      style={props.style}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  lineColor(i) {
    switch (this.props.lines[i]) {
      case 1:
        return '#7CEA9C';
      case 2:
        // return '#FFCB77';
        return '#ffc25e';
      default:
        return 'none';
    }
  }
  squareColor(i) {
    switch (this.props.squares[i]) {
      case 1:
        return '#7CEA9C';
      case 2:
        // return '#FFCB77';
        return '#ffc25e';
      default:
        return 'none';
    }
  }

  hoverColor(i) {
    switch (this.props.pOneIsNext) {
      case 1:
        return 'orangeLine';
      case 2:
        return 'greenLine';
    }
  }

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.handleClick(i)}
        style={{ color: this.squareColor(i) }}
      />
    );
  }

  renderVertiLine(i) {
    return (
      <VertiLine
        // value={this.props.lines[i]}
        // value={i}
        onClick={() => this.props.onClick(i)}
        style={{ backgroundColor: this.lineColor(i) }}
        pOneIsNext={this.props.pOneIsNext}
      />
    );
  }

  renderHoriLine(i) {
    return (
      <HoriLine
        // value={this.props.lines[i]}
        // value={i}
        onClick={() => this.props.onClick(i)}
        style={{ backgroundColor: this.lineColor(i) }}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderHoriLine(0)}
          {this.renderHoriLine(1)}
          {this.renderHoriLine(2)}
        </div>
        <div className="board-row">
          {this.renderVertiLine(3)}
          {this.renderSquare(0)}

          {this.renderVertiLine(4)}

          {this.renderSquare(1)}

          {this.renderVertiLine(5)}

          {this.renderSquare(2)}

          {this.renderVertiLine(6)}
        </div>
        <div className="board-row">
          {this.renderHoriLine(7)}

          {this.renderHoriLine(8)}

          {this.renderHoriLine(9)}
        </div>
        <div className="board-row">
          {this.renderVertiLine(10)}

          {this.renderSquare(3)}

          {this.renderVertiLine(11)}

          {this.renderSquare(4)}

          {this.renderVertiLine(12)}

          {this.renderSquare(5)}
          {this.renderVertiLine(13)}
        </div>
        <div className="board-row">
          {this.renderHoriLine(14)}

          {this.renderHoriLine(15)}

          {this.renderHoriLine(16)}
        </div>
        <div className="board-row">
          {this.renderVertiLine(17)}

          {this.renderSquare(6)}

          {this.renderVertiLine(18)}

          {this.renderSquare(7)}

          {this.renderVertiLine(19)}

          {this.renderSquare(8)}

          {this.renderVertiLine(20)}
        </div>
        <div className="board-row">
          {this.renderHoriLine(21)}

          {this.renderHoriLine(22)}

          {this.renderHoriLine(23)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          lines: Array(24).fill(null),
        },
      ],
      stepNumber: 0,
      pOneIsNext: true,
      point: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const lines = current.lines.slice();
    const squares = current.squares.slice();
    let player = false;
    let point = false;

    if (calculateWinner(current.squares) || lines[i]) {
      return;
    }

    lines[i] = this.state.pOneIsNext ? 1 : 2;
    const complete = completeSquare(lines, current.squares);

    if (complete != null) {
      player = this.state.pOneIsNext;
      point = true;
      // need to grab value of square to be filled in
      squares[complete] = this.state.pOneIsNext ? 1 : 2;
    } else {
      player = !this.state.pOneIsNext;
      point = false;
    }

    this.setState({
      history: history.concat([
        {
          lines: lines,
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      pOneIsNext: player,
      point: point,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      pOneIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // const moves = history.map((step, move) => {
    //   const desc = move ?
    //     'Go to move #' + move :
    //     'Go to game start';
    //   return (
    //     <li key={move}>
    //       <button onClick={() => this.jumpTo(move)}>{desc}</button>
    //     </li>
    //   );
    // });

    let status;
    let point = this.state.point;
    if (winner && winner[0][1] == winner[1][1]) {
      winner.sort(function (element_a, element_b) {
        return element_a[0] - element_b[0];
      });
      status =
        'Winners: Player ' + winner[0][0] + ' AND Player ' + winner[1][0] + '!';
    } else if (winner) {
      status =
        'Winner: Player ' +
        winner[0][0] +
        ' with ' +
        winner[0][1] +
        ' points!\nPlayer ' +
        winner[1][0] +
        ' finished with ' +
        winner[1][1] +
        ' points.';
    } else if (point) {
      status =
        'Player ' + (this.state.pOneIsNext ? 1 : 2) + ' gets another turn!';
    } else {
      status = 'Next player: ' + (this.state.pOneIsNext ? 1 : 2);
    }

    return (
      <div className="game ">
        <div className="game-board row">
          <div className="col"></div>
          <Board
            squares={current.squares}
            lines={current.lines}
            pOneIsNext={this.state.pOneIsNext}
            onClick={(i) => this.handleClick(i)}
            className="col"
          />
          <div className="col"></div>
        </div>
        <div className="game-info ">
          <div className="status">{status}</div>
          {/* <ol>{moves}</ol> */}
        </div>
      </div>
    );
  }
}

function completeSquare(lines, currentSquares) {
  //   /** This needs to be completed with the full array of move options */
  /** Need to make the baord recognize when a square has been filled and remove it from the equation
   * So that it stops returning "true" after the box has been filled.
   * Currently it will keep returning true because the first box is filled.
   */
  const fullSquares = [
    [0, 3, 4, 7],
    [1, 4, 5, 8],
    [2, 5, 6, 9],
    [7, 10, 11, 14],
    [8, 11, 12, 15],
    [9, 12, 13, 16],
    [14, 17, 18, 21],
    [15, 18, 19, 22],
    [16, 19, 20, 23],
  ];

  //figure out how to stop this whole function from triggering without click because
  //it triggers when the app is loaded and a second time after a click
  //which makes the 'currentLines' variable equal 'undefined'
  try {
    for (let i = 0; i < fullSquares.length; i++) {
      const [a, b, c, d] = fullSquares[i];

      if (lines[a] && lines[b] && lines[c] && lines[d] && !currentSquares[i]) {
        // fullSquares.splice(0,1)

        // return lines[a];
        return i;
      }
    }
  } catch (error) {}
  return null;
}

function calculateWinner(squares) {
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] == null) {
      return false;
    }
  }

  let pointOne = squares.filter((v) => v === 1).length;
  let pointTwo = squares.filter((v) => v === 2).length;

  let winner = [
    [1, pointOne],
    [2, pointTwo],
  ];
  return winner.sort(function (element_a, element_b) {
    return element_b[1] - element_a[1];
  });
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
