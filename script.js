const game = {
  gameboard: ['', '', '', '', '', '', '', '', ''],
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
};

const displayController = (() => {
  const playerOne = document.querySelector('.player-one');
  const playerTwo = document.querySelector('.player-two');
  const displayMarkers = (gameboardElement) => {
    game.gameboard.forEach((item, index) => {
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
      modalWinner.classList.add('invisible');
      gameBoard.restartGame();
      displayStartMenu();
    });
  };

  const displayModeSelection = () => {
    const modalSelection = document.querySelector('.modal-selection');
    const pvpButton = document.querySelector('.pvp-mode');
    modalSelection.classList.remove('invisible');
    pvpButton.addEventListener('click', () => {
      modalSelection.classList.add('invisible');
      displayPlayersModal();
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
      if (
        game.gameboard[
          Array.from(gameboardElement.children).indexOf(e.target)
        ] !== ''
      )
        return;
      game.gameboard[Array.from(gameboardElement.children).indexOf(e.target)] =
        currentPlayerTurn.marker;
      win(currentPlayerTurn);
      switchPlayerTurn();
      displayController.scalePlayerTurn(currentPlayerTurn);
      displayController.displayMarkers(gameboardElement);
    });
  };

  const switchPlayerTurn = () =>
    currentPlayerTurn === game.players.playerOne
      ? (currentPlayerTurn = game.players.playerTwo)
      : (currentPlayerTurn = game.players.playerOne);

  const win = (player) => {
    const winCondition = {
      0: [0, 1, 2],
      1: [3, 4, 5],
      2: [6, 7, 8],
      3: [0, 3, 6],
      4: [1, 4, 7],
      5: [2, 5, 8],
      6: [0, 4, 8],
      7: [2, 4, 6],
    };
    let indexes = [];
    const filtered = game.gameboard.filter((item, index) => {
      if (item === player.marker) indexes.push(index);
    });
    for (let i = 0; i < Object.keys(winCondition).length; i++) {
      if (winCondition[i].every((value) => indexes.includes(value)))
        return displayController.displayWinner(`${player.name} has Won!`);
      else if (game.gameboard.every((value) => value !== ''))
        return displayController.displayWinner("It's a Tie!");
    }
    console.log(indexes, winCondition);
  };

  const restartGame = () => {
    const gameboardElement = document.querySelector('.gameboard');
    game.gameboard = ['', '', '', '', '', '', '', '', ''];
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
    displayController.displayPlayers();
  };

  return { attachEvent, restartGame, namePlayers };
})();

displayController.displayStartMenu();
gameBoard.attachEvent();
