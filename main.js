function createPlayer(name, mark){

    return {name, mark};
};

const displayController = (() => {
    const renderMessage = (message) => {
        document.querySelector("#message").innerHTML = message
    }
    return {renderMessage}
})();

const GameBoard = (() => {
    let gameboard = ["", "" , "", "", "", "", "", "", ""]

    const render = () => {
        let boardHTML = "";
        gameboard.forEach((square, index) => {
            boardHTML += `<div class="square" id="square-${index}">${square}</div>`
        })
        document.querySelector("#gameBoard").innerHTML = boardHTML;

        const squares = document.querySelectorAll(".square");
        squares.forEach(square =>{
            square.addEventListener("click", Game.handleClick)
        })
    };

    const update = (index, value) => {
        gameboard[index] = value;
        render();
    };

    const getGameboard = () => gameboard;

    return{
        render,
        update,
        getGameboard
    };

})();

const Game = (() => {
    let players = [];
    let currentPlayerIndex ;
    let gameOver;


    const start = () => {
        let player1 = document.querySelector("#player1").value;
        let player2 = document.querySelector("#player2").value;
        players = [createPlayer(player1, "X"), createPlayer(player2, "O")]
        currentPlayerIndex = 0;
        gameOver = false;
        GameBoard.render();
    }

    const handleClick = (e) => {
        if (gameOver){
            return;
        }
        let index = e.target.id.split("-")[1];
        if (GameBoard.getGameboard()[index] !== ""){
            return;
        }

        GameBoard.update(index, players[currentPlayerIndex].mark);

        if(checkForWin(GameBoard.getGameboard(), players[currentPlayerIndex].mark)){
            gameOver = true;
            displayController.renderMessage(`${players[currentPlayerIndex].name} Won!`);
        } else if (checkForTie(GameBoard.getGameboard())){
            gameOver
            displayController.renderMessage("it's a tie");
        }
        currentPlayerIndex = currentPlayerIndex == 0 ? 1 : 0;
    }

    const restart = () => {
        for (let i = 0; i < 9; i++){
            GameBoard.update(i,"");
        }
        GameBoard.render();
        gameOver = false;
        document.querySelector("#message").innerHTML = "";
    }

    return {
        start,
        restart,
        handleClick
    }
})();

function checkForWin(board){
    const winningCombos = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ]
    for(let i = 0; i < winningCombos.length; i++){
        const [a,b,c] = winningCombos[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]){
            return true;
        }
    }
    return false;
}

function checkForTie(board){
    return board.every(cell => cell !== "")
}

const restartButton = document.querySelector("#reset-btn");
restartButton.addEventListener("click", () =>{
    Game.restart()
})

const startButton = document.querySelector("#submit-btn");
startButton.addEventListener("click", () =>{
    let player1 = document.querySelector("#player1").value;
    let player2 = document.querySelector("#player2").value;
    if (player1 == "" || player2 == ""){
        let error = document.querySelector("#error")
        error.style.display = "inline"
        event.preventDefault()
    } else{
        let error = document.querySelector("#error")
        error.style.display = "none"
        let gameboard = document.querySelector("#gameBoard")
        gameboard.style.display = "grid"
        Game.start()
        event.preventDefault()
    }
})