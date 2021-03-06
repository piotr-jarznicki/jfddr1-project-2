const gameBoard = document.querySelector(".game-board");
const gameScore = document.querySelector(".game-score");
const buttonPlay = document.querySelector(".game-start");
const buttonExit = document.querySelector(".win-overlay .exit");
const popUp = document.querySelector(".win-overlay");
const highscorePopUp = document.querySelector(".highscore-overlay");
const showHighscorePopUpButton = document.querySelector(".game-highscore");
const hideHighscorePopUpButton = document.querySelector(".exit-highscore");
const addUsernameButton = document.querySelector(".add-username");
const resultNumber = document.querySelector(".result-number");
buttonPlay.addEventListener("click", startGame);
buttonExit.addEventListener("click", exitPopUp);
showHighscorePopUpButton.addEventListener("click", showHighscorePopUp);
hideHighscorePopUpButton.addEventListener("click", hideHighscorePopUp);
addUsernameButton.addEventListener("click", addUsername);

let imagesArray = [];

firebase
  .firestore()
  .collection("memo-highscores")
  .orderBy("highscore")
  .onSnapshot((highscores) => {
    renderHighscores(highscores);
  });

function renderHighscores(highscores) {
  const list = document.querySelector(".highscore-list");
  list.innerHTML = "";
  highscores.forEach((highscore) => {
    const data = highscore.data();
    list.innerHTML += `
  <li>${data.username} <span>${data.highscore}</span></li>
  `;
  });
}

function addUsername() {
  const input = document.querySelector(".username-input");
  if (input.value !== "") {
    firebase.firestore().collection("memo-highscores").add({
      username: input.value,
      highscore: game.moves,
    });
    input.value = "";
    game.moves = 0;
    gameScore.innerText = game.moves;
    resultNumber.innerText = game.moves;
  } else {
    alert("Input jest pusty, podaj właściwą nazwę użytkownika!");
  }
}

function showHighscorePopUp() {
  highscorePopUp.style.display = "flex";
}
function hideHighscorePopUp() {
  highscorePopUp.style.display = "none";
}
const game = {
  moves: 0,
  tilesChecked: [],
  pairsArray: [],
  tilesImages: [
    "img2/item_1.png ",
    "img2/item_2.png ",
    "img2/item_3.png ",
    "img2/item_4.png ",
    "img2/item_5.png ",
    "img2/item_6.png ",
    "img2/item_7.png ",
    "img2/item_8.png ",
    "img2/item_9.png ",
    "img2/item_10.png ",
    "img2/item_1.png ",
    "img2/item_2.png ",
    "img2/item_3.png ",
    "img2/item_4.png ",
    "img2/item_5.png ",
    "img2/item_6.png ",
    "img2/item_7.png ",
    "img2/item_8.png ",
    "img2/item_9.png ",
    "img2/item_10.png ",
  ],
};

const addTiles = () => {
  function sortTilesImages() {
    const sortedTilesImages = game.tilesImages.sort((arr) => {
      return 0.5 - Math.random();
    });
    return sortedTilesImages;
  }
  const sortedTilesImages = sortTilesImages();
  sortedTilesImages.forEach((el, index) => {
    const div = document.createElement("div");

    div.addEventListener("click", showTile);
    div.classList.add("game-tile");
    const img = document.createElement("img");
    img.setAttribute("draggable", "false");
    img.src = `${sortedTilesImages[index]}`;
    div.appendChild(img);
    gameBoard.append(div);
    imagesArray.push(img);
  });
};

function showTile(e) {
  if (game.tilesChecked.length < 2) {
    e.target.classList.remove("hide");
    addTileToArray(e);
  } else {
    return;
  }
  if (game.tilesChecked.length === 2) {
    checkPair();
  }
}

function addTileToArray(e) {
  if (
    game.tilesChecked.includes(e.target.parentNode) ||
    game.tilesChecked.length === 2
  ) {
    return;
  } else {
    game.tilesChecked.push(e.target.parentNode);
  }
}

function checkPair() {
  const img0 = [...game.tilesChecked[0].children];
  [img2] = img0;
  const img1 = [...game.tilesChecked[1].children];
  [img3] = img1;

  if (img2.src === img3.src) {
    game.pairsArray.push(img2, img3);
    game.tilesChecked.length = "";
  } else {
    game.moves += 1;
    gameScore.innerText = game.moves;
    resultNumber.innerText = game.moves;
    setTimeout(hideImage, 1000);
  }
  checkResult();
}

function checkResult() {
  if (game.pairsArray.length === 20) {
    popUp.style.display = "flex";
  }
}

function hideImage() {
  const img0 = [...game.tilesChecked[0].children];
  [img2] = img0;
  const img1 = [...game.tilesChecked[1].children];
  [img3] = img1;
  img2.classList.add("hide");
  img3.classList.add("hide");
  game.tilesChecked.length = "";
}

function setImagesVisibilitybleToNone() {
  if (imagesArray.length === 20) {
    imagesArray.forEach((el) => el.classList.add("hide"));
  }
  imagesArray = [];
}

function startGame() {
  gameBoard.innerHTML = "";
  addTiles();
  game.pairsArray = [];
  game.tilesChecked = [];
  game.moves = 0;
  gameScore.innerText = game.moves;
  setTimeout(setImagesVisibilitybleToNone, 2000);
}

function exitPopUp() {
  popUp.style.display = "none";
  startGame();
}
