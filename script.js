const game = {
  gameboard: [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ],
  players: {
    playerOne: {
      name: '',
      marker: 'X',
    },
    playerTwo: {
      name: '',
      marker: 'O',
    },
  },
  aiMode: false,
};

const displayController = (() => {
  const playerOne = document.querySelector('.player-one');
  const playerTwo = document.querySelector('.player-two');
  const displayMarkers = () => {
    const gameboardElement = document.querySelector('.gameboard');
    let mergedBoard = game.gameboard[0].concat(
      game.gameboard[1],
      game.gameboard[2]
    );
    mergedBoard.forEach((item, index) => {
      gameboardElement.children[index].textContent = item;
    });
  };

  const displayPlayers = () => {
    playerOne.textContent = game.players.playerOne.name;
    playerTwo.textContent = game.players.playerTwo.name;
  };

  const scalePlayerTurn = (currentPlayerTurn) => {
    if (currentPlayerTurn.name === game.players.playerOne.name) {
      playerOne.classList.add('scale');
      playerTwo.classList.remove('scale');
    } else {
      playerTwo.classList.add('scale');
      playerOne.classList.remove('scale');
    }
  };

  const displayStartMenu = () => {
    const modalStartMenu = document.querySelector('.modal-start');
    const playButton = document.querySelector('.play-game');
    hideGameBoard();
    modalStartMenu.classList.remove('invisible');
    playButton.addEventListener('click', () => {
      modalStartMenu.classList.add('invisible');
      displayModeSelection();
    });
  };

  const displayWinner = (winner) => {
    const modalWinner = document.querySelector('.modal-winner');
    const winnerTitle = document.querySelector('.winner-title');
    const restartButton = document.querySelector('.restart');
    const returnButton = document.querySelector('.return');
    hideGameBoard();
    modalWinner.parentElement.classList.remove('invisible');
    modalWinner.classList.remove('invisible');
    winnerTitle.textContent = `${winner}`;

    restartButton.addEventListener('click', () => {
      modalWinner.parentElement.classList.add('invisible');
      showGameBoard();
      gameBoard.restartGame();
    });

    returnButton.addEventListener('click', () => {
      game.aiMode = false;
      modalWinner.classList.add('invisible');
      gameBoard.restartGame();
      displayStartMenu();
    });
  };

  const displayModeSelection = () => {
    const modalSelection = document.querySelector('.modal-selection');
    const pvpButton = document.querySelector('.pvp-mode');
    const aiButton = document.querySelector('.ai-mode');
    modalSelection.classList.remove('invisible');

    pvpButton.addEventListener('click', () => {
      modalSelection.classList.add('invisible');
      displayPlayersModal();
    });

    aiButton.addEventListener('click', () => {
      modalSelection.classList.add('invisible');
      modalSelection.parentElement.classList.add('invisible');
      game.aiMode = true;
      gameBoard.namePlayers();
      showGameBoard();
    });
  };

  const displayPlayersModal = () => {
    const modalPlayerNames = document.querySelector('.modal-player-names');
    const startGameButton = document.querySelector('.start-game');
    modalPlayerNames.classList.remove('invisible');

    startGameButton.addEventListener('click', () => {
      modalPlayerNames.classList.add('invisible');
      modalPlayerNames.parentElement.classList.add('invisible');
      gameBoard.namePlayers();
      showGameBoard();
    });
  };

  const hideGameBoard = () => {
    const gameBoardContainer = document.querySelector('.gameboard-container');
    gameBoardContainer.classList.add('invisible');
  };

  const showGameBoard = () => {
    const gameBoardContainer = document.querySelector('.gameboard-container');
    gameBoardContainer.classList.remove('invisible');
  };

  return {
    displayMarkers,
    displayPlayers,
    scalePlayerTurn,
    displayStartMenu,
    displayWinner,
  };
})();

const gameBoard = (() => {
  let currentPlayerTurn = game.players.playerOne;
  displayController.scalePlayerTurn(currentPlayerTurn);
  const gameboardElement = document.querySelector('.gameboard');
  const attachEvent = () => {
    gameboardElement.addEventListener('click', (e) => {
      if (checkWinner() !== null) return;
      if ([Array.from(gameboardElement.children).indexOf(e.target)] < 3) {
        if (
          game.gameboard[0][
            Array.from(gameboardElement.children).indexOf(e.target)
          ] !== ''
        )
          return;
        game.gameboard[0][
          Array.from(gameboardElement.children).indexOf(e.target)
        ] = currentPlayerTurn.marker;
      } else if (
        [Array.from(gameboardElement.children).indexOf(e.target)] > 2 &&
        Array.from(gameboardElement.children).indexOf(e.target) < 6
      ) {
        if (
          game.gameboard[1][
            Array.from(gameboardElement.children).indexOf(e.target) - 3
          ] !== ''
        )
          return;
        game.gameboard[1][
          Array.from(gameboardElement.children).indexOf(e.target) - 3
        ] = currentPlayerTurn.marker;
      } else if (
        Array.from(gameboardElement.children).indexOf(e.target) > 5 &&
        Array.from(gameboardElement.children).indexOf(e.target) < 9
      ) {
        if (
          game.gameboard[2][
            Array.from(gameboardElement.children).indexOf(e.target) - 6
          ] !== ''
        )
          return;
        game.gameboard[2][
          Array.from(gameboardElement.children).indexOf(e.target) - 6
        ] = currentPlayerTurn.marker;
      }
      findWinner();
      switchPlayerTurn();

      if (game.aiMode === false)
        displayController.scalePlayerTurn(currentPlayerTurn);
      displayController.displayMarkers();
      if (game.aiMode === true && checkWinner() === null) findBestMove();
    });
  };

  const switchPlayerTurn = () =>
    currentPlayerTurn === game.players.playerOne
      ? (currentPlayerTurn = game.players.playerTwo)
      : (currentPlayerTurn = game.players.playerOne);

  const checkWinner = () => {
    const equals3 = (a, b, c) => {
      return a === b && b === c && a !== '';
    };
    for (let i = 0; i < 3; i++) {
      if (
        equals3(
          game.gameboard[i][0],
          game.gameboard[i][1],
          game.gameboard[i][2]
        )
      ) {
        return game.gameboard[i][0];
      }
    }
    for (let i = 0; i < 3; i++) {
      if (
        equals3(
          game.gameboard[0][i],
          game.gameboard[1][i],
          game.gameboard[2][i]
        )
      ) {
        return game.gameboard[0][i];
      }
    }
    if (
      equals3(game.gameboard[0][0], game.gameboard[1][1], game.gameboard[2][2])
    ) {
      return game.gameboard[0][0];
    }

    if (
      equals3(game.gameboard[2][0], game.gameboard[1][1], game.gameboard[0][2])
    ) {
      return game.gameboard[2][0];
    }

    let mergedBoard = game.gameboard[0].concat(
      game.gameboard[1],
      game.gameboard[2]
    );

    if (mergedBoard.every((elem) => elem !== '')) {
      return 'tie';
    }
    return null;
  };

  const findWinner = () => {
    if (checkWinner() === 'X') {
      displayController.displayWinner(
        `${game.players.playerOne.name} has Won!`
      );
    } else if (checkWinner() === 'O') {
      displayController.displayWinner(
        `${game.players.playerTwo.name} has Won!`
      );
    } else if (checkWinner() === 'tie') {
      displayController.displayWinner("It's a Tie!");
    }
  };

  const restartGame = () => {
    const gameboardElement = document.querySelector('.gameboard');
    game.gameboard = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
    currentPlayerTurn = game.players.playerOne;
    displayController.scalePlayerTurn(currentPlayerTurn);
    displayController.displayMarkers(gameboardElement);
  };

  const namePlayers = () => {
    const playerOneInput = document.querySelector('#player-one');
    const playerTwoInput = document.querySelector('#player-two');
    game.players.playerOne.name = playerOneInput.value;
    game.players.playerTwo.name = playerTwoInput.value;
    if (game.players.playerOne.name === '')
      game.players.playerOne.name = playerOneInput.getAttribute('placeholder');
    if (game.players.playerTwo.name === '')
      game.players.playerTwo.name = playerTwoInput.getAttribute('placeholder');
    if (game.aiMode === true) {
      game.players.playerOne.name = 'Player One';
      game.players.playerTwo.name = 'AI';
    }
    displayController.displayPlayers();
  };

  const findBestMove = () => {
    let bestScore = -Infinity;
    let bestMove;
    for (let i = 0; i < 3; i++) {
      for (let k = 0; k < 3; k++) {
        if (game.gameboard[i][k] === '') {
          game.gameboard[i][k] = game.players.playerTwo.marker;
          let score = minimax(game.gameboard, 0, false);
          game.gameboard[i][k] = '';
          if (score > bestScore) {
            bestScore = score;
            bestMove = { i, k };
          }
        }
      }
    }
    game.gameboard[bestMove.i][bestMove.k] = game.players.playerTwo.marker;
    displayController.displayMarkers();
    findWinner();
    switchPlayerTurn();
  };

  let scores = {
    X: -1,
    O: 1,
    tie: 0,
  };

  const minimax = (gameboard, depth, isMaximizing) => {
    let result = checkWinner();
    if (result !== null) {
      return scores[result];
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let k = 0; k < 3; k++) {
          if (gameboard[i][k] === '') {
            gameboard[i][k] = game.players.playerTwo.marker;
            let score = minimax(gameboard, depth + 1, false);
            gameboard[i][k] = '';
            bestScore = Math.max(score, bestScore);
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 3; i++) {
        for (let k = 0; k < 3; k++) {
          if (gameboard[i][k] === '') {
            gameboard[i][k] = game.players.playerOne.marker;
            let score = minimax(gameboard, depth + 1, true);
            gameboard[i][k] = '';
            bestScore = Math.min(score, bestScore);
          }
        }
      }
      return bestScore;
    }
  };

  return { attachEvent, restartGame, namePlayers };
})();

displayController.displayStartMenu();
gameBoard.attachEvent();
