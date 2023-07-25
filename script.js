const game = {
  gameboard: ['', '', '', '', '', '', '', '', ''],
  players: {
    playerOne: {
      name: 'Player One',
      marker: 'X',
    },
    playerTwo: {
      name: 'Player Two',
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
    const startGameButton = document.querySelector('.start-game');
    hideGameBoard();
    startGameButton.addEventListener('click', () => {
      // for now
      modalStartMenu.parentElement.classList.add('invisible');
      showGameBoard();
    });
  };

  const displayWinner = () => {
    const modalWinner = document.querySelector('.modal-winner');
  };

  const hideGameBoard = () => {
    const gameBoardContainer = document.querySelector('.gameboard-container');
    gameBoardContainer.style.display = 'none';
  };

  const showGameBoard = () => {
    const gameBoardContainer = document.querySelector('.gameboard-container');
    gameBoardContainer.style.display = 'flex';
  };

  return { displayMarkers, displayPlayers, scalePlayerTurn, displayStartMenu };
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
        return alert(`${player.name} WON!`);
      else if (game.gameboard.every((value) => value !== ''))
        return alert("It's a TIE!");
    }
    console.log(indexes, winCondition);
  };
  return { attachEvent };
})();

displayController.displayStartMenu();
displayController.displayPlayers();
gameBoard.attachEvent();
