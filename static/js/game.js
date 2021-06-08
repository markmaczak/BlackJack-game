'use strict';
import * as bob from "./card.js";

const playButton = document.getElementById("play-button");
playButton.addEventListener("click", function () {
  initGame();
  playButton.style.display = "none";
  const logo = document.querySelector("#bj-logo");
  logo.className = "logo";
});

function initGame() {
  const chip25 = document.querySelector("#chip-25");
  const chip50 = document.querySelector("#chip-50");
  const chip100 = document.querySelector("#chip-100");
  const chip500 = document.querySelector("#chip-500");
  let betTotal = document.querySelector(".bet-total");
  let balance = document.querySelector("#money");
  const DStartCardSlot = document.querySelector(".d-start");
  const PStartCardSlots = document.querySelectorAll(".p-start");
  const underCard = document.querySelector(".under");
  const hitButton = document.querySelector("#btn-hit");
  const standButton = document.querySelector("#btn-stand");
  const currentPointHead = document.querySelector("#current-point-head");
  const bets = document.querySelector(".chips");
  const balanceHead = document.querySelector("#balance-head");
  const dealerThirdSlot = document.querySelector("#d-3");
  const dealerFourthSlot = document.querySelector("#d-4");
  const dealerFivthSlot = document.querySelector("#d-5");
  const playerThirdSlot = document.querySelector("#p-3");
  const playerFourthSlot = document.querySelector("#p-4");
  const playerFivthSlot = document.querySelector("#p-5");
  let turn = 0;
  const dealButton = document.querySelector("#deal");
  const betCards = document.querySelectorAll(".bet");
  let runGame = false;
  let coinEarn = false;
  const winTitle = document.querySelector(".winner");
  const loseTitle = document.querySelector(".loser");
  const overlay = document.querySelector(".overlay");
  const exit = document.querySelectorAll('.close');

  if (parseInt(sessionStorage.getItem('newBalance')) > 0){
    balance.value = sessionStorage.getItem('newBalance');
  }
    
    for(let e of exit){
        e.addEventListener('click', function(){
            location.reload();
        })
    }

  function addCard(name, nameClass) {
    let cardImage = document.createElement("img");
    let card = getCard();
    cardImage.setAttribute("src", card.image);
    cardImage.setAttribute("value", card.value);
    cardImage.classList.add(nameClass);
    name.appendChild(cardImage);
  }

  dealButton.addEventListener("click", deal);

  function deal() {
    dealButton.style.display = "none";
    sessionStorage.setItem('finalBet', betTotal.textContent);
    sessionStorage.setItem('balance', balance.value);
    for (let b of betCards) {
      b.innerHTML = "";
    }
    let underCardImage = document.createElement("img");
    underCardImage.setAttribute("src", "/static/img/card-back.png");
    underCard.appendChild(underCardImage);
    currentPointHead.classList.remove("hidden");
    currentPointHead.classList.add("initial");
    addCard(DStartCardSlot, "d-card");
    for (let start of PStartCardSlots) {
      addCard(start, "p-card");
    }
    standButton.addEventListener("click", function () {
      if (runGame === true) {
        if (dealerCardsValue() <= 18) {
          if (turn === 0) {
            underCard.innerHTML = "";
            addCard(underCard, "d-card");
            if (dealerCardsValue() <= 18) {
              addCard(dealerThirdSlot, "d-card");
              if (dealerCardsValue() <= 18) {
                addCard(dealerFourthSlot, "d-card");
                if (dealerCardsValue() <= 18) {
                  addCard(dealerFivthSlot, "d-card");
                  checkWinner('s');
                } else {
                  checkWinner('s');
                }
              } else {
                checkWinner('s');
              }
            } else {
              checkWinner('s');
            }
          } else if (turn === 1) {
            addCard(dealerThirdSlot, "d-card");
              if (dealerCardsValue() <= 18) {
                addCard(dealerFourthSlot, "d-card");
                if (dealerCardsValue() <= 18) {
                  addCard(dealerFivthSlot, "d-card");
                  checkWinner('s');
                } else {
                  checkWinner('s');
                }
              } else {
                checkWinner('s');
              }
          } else if (turn === 2) {
            addCard(dealerThirdSlot, "d-card");
            if (dealerCardsValue() <= 18) {
              addCard(dealerFourthSlot, "d-card");
              if (dealerCardsValue() <= 18) {
                addCard(dealerFivthSlot, "d-card");
                checkWinner('s');
              } else {
                checkWinner('s');
              }
            } else {
              checkWinner('s');
            }
          } else if (turn === 3) {
            addCard(dealerFourthSlot, "d-card");
            if (dealerCardsValue() <= 18) {
              addCard(dealerFivthSlot, "d-card");
              checkWinner('s');
            } else {
              checkWinner('s');
            }
          }
        } else {
          checkWinner('s');
        }
      }
    });
    playerCardsValue();
    runGame = true;
    coinEarn = false;
    checkWinner('d');
  }

  function gameStart() {
    coinEarn = true;
    balanceHead.classList.remove("hidden");
    bets.classList.remove("hidden");
    bets.classList.add("initial");
    hitButton.classList.remove("hidden");
    hitButton.classList.add("initial");
    standButton.classList.remove("hidden");
    standButton.classList.add("initial");
    for (let b of betCards) {
      let basicCard = document.createElement("img");
      basicCard.setAttribute("src", "/static/img/card-back.png");
      b.appendChild(basicCard);
    }
  }

  gameStart();

  hitButton.addEventListener("click", function hitCards() {
    if (runGame === true) {
      turn += 1;
      if (turn === 1) {
        if (playerCardsValue() < 21) {
          addCard(playerThirdSlot, "p-card");
        }
        underCard.innerHTML = "";
        addCard(underCard, "d-card");
        playerCardsValue();
        dealerCardsValue();
      } else if (turn === 2) {
        if (playerCardsValue() < 21) {
          addCard(playerFourthSlot, "p-card");
        }
        if (dealerCardsValue() <= 18) {
          addCard(dealerThirdSlot, "d-card");
          dealerCardsValue();
        }
        playerCardsValue();
      } else if (turn === 3) {
        if (playerCardsValue() < 21) {
          addCard(playerFivthSlot, "p-card");
        }
        if (dealerCardsValue() <= 18) {
          addCard(dealerFourthSlot, "d-card");
          dealerCardsValue();
        }
        playerCardsValue();
      }
      checkWinner('h');
    }
  });

  function addCoin(name, money) {
    name.addEventListener("click", function add() {
      if (balance.value >= money && coinEarn === true) {
        let value = parseInt(betTotal.textContent) + money;
        balance.value -= money;
        betTotal.textContent = String(value);
      }
    });
  }

  addCoin(chip25, 25);
  addCoin(chip50, 50);
  addCoin(chip100, 100);
  addCoin(chip500, 500);

  function getCard() {
    let number = Math.floor(Math.random() * 2);
    if (number === 1) {
      let card = choose(bob.red_cards);
      bob.red_cards.splice(card.index, 1);
      return card;
    } else if (number === 0) {
      let card = choose(bob.black_cards);
      bob.black_cards.splice(card.index, 1);
      return card;
    }
  }

  function choose(choices) {
    let index = Math.floor(Math.random() * choices.length);
    return choices[index];
  }

  function playerCardsValue() {
    const cards = document.querySelectorAll(".p-card");
    const currentPoint = document.querySelector("#current-point");
    let counter = 0;
    for (let c of cards) {
      counter += parseInt(c.getAttribute("value"));
    }
    for (let c of cards) {
      if (
        (c.getAttribute("src") == "/static/img/card-b-ace.png" ||
          c.getAttribute("src") == "/static/img/card-r-ace.png") &&
        counter > 21
      ) {
        counter -= 10;
      }
    }
    currentPoint.textContent = String(counter);
    return counter;
  }

  function dealerCardsValue() {
    const dcards = document.querySelectorAll(".d-card");
    let counter = 0;
    for (let d of dcards) {
      counter += parseInt(d.getAttribute("value"));
    }
    for (let c of dcards) {
      if (
        (c.getAttribute("src") == "/static/img/card-b-ace.png" ||
          c.getAttribute("src") == "/static/img/card-r-ace.png") &&
        counter > 21
      ) {
        counter -= 10;
      }
    }
    return counter;
  }

  function checkWinner(buttonName){
    setTimeout(function() {
      let playerPoints = playerCardsValue();
      let dealerPoints = dealerCardsValue();
      let finalBet = parseInt(sessionStorage.getItem('finalBet'));
      let balanced = parseInt(sessionStorage.getItem('balance'));
      if (playerPoints === 21 || dealerPoints > 21) {
        runGame = false;
        let newBalance = finalBet * 2 + balanced;
        sessionStorage.setItem('newBalance', newBalance);
        balance.value = String(finalBet * 2 + newBalance);
        winTitle.classList.remove("hidden");
        overlay.classList.remove("hidden");
      }
      if (dealerPoints === 21 || playerPoints > 21) {
        runGame = false;
        let newBalance = balanced;
        sessionStorage.setItem('newBalance', newBalance);
        loseTitle.classList.remove("hidden");
        overlay.classList.remove("hidden");
      }
      if (buttonName === 's'){
        if (playerPoints > dealerPoints){
          runGame = false;
          let newBalance = finalBet * 2 + balanced;
          sessionStorage.setItem('newBalance', newBalance);
          balance.value = String(finalBet * 2 + newBalance);
          winTitle.classList.remove("hidden");
          overlay.classList.remove("hidden");
        }
        else{
          runGame = false;
          let newBalance = balanced;
          sessionStorage.setItem('newBalance', newBalance);
          loseTitle.classList.remove("hidden");
          overlay.classList.remove("hidden");
        }
      }
    }, 3000);
  }
}
