let generatedNumber;
let sum = 0;
let previousNumber = 1;
let currentNumber = 0;
let dice = document.getElementById("sum");
let player = document.getElementById("player");
let circle = document.getElementById("circle");

function rollDice(){
    generatedNumber = Math.floor((Math.random()*6)+1);
    dice.innerText = generatedNumber;
    sum+=generatedNumber;
    currentNumber = sum;

    for (let i = previousNumber; i <= currentNumber; i++) {
        let boxValue = document.getElementById("box"+ i);
        const rect = boxValue.getBoundingClientRect();
        const position = {
            left: rect.left,
            top: rect.top,
        };

        let top = position.top;
        let left = position.left;

        playerMove(top,left);
    }
    // console.log("Sum = ",sum);
}

function playerMove(top,left){
    console.log("PLayer Move");
    player.style.transform = `translateY(${top-189}px) translateX(${left-21}px)`;
}