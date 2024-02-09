let generatedNumber;
let sum = 0;
let previousNumber = 1;
let currentNumber = 0;
let dice = document.getElementById("sum");
let player = document.getElementById("player");
let circle = document.getElementById("circle");
let diceImage = document.getElementById("dImage");
let diceSound = new Audio("audio/diceSound.mp3");
let btn = document.getElementById("dice");

function rollDice(){
    generatedNumber = Math.floor((Math.random()*6)+1);
    diceImage.src = `images/Untitled design/${generatedNumber}.png`;
    diceImage.style.transform = `rotate(${2*generatedNumber*180}deg)`;
    diceSound.play();
    // dice.textContent = generatedNumber;
    sum+=generatedNumber;
    currentNumber = sum;

    if(sum==100){
        console.log(sum,"sum");
        btn.disabled = true;
    }

    for (let i = previousNumber; i <= currentNumber; i++) {
        let boxValue = document.getElementById("box"+ i);
        let t = boxValue.offsetTop;
        let l = boxValue.offsetLeft;

        if(currentNumber == 5){
            //Sidi functionality 5 to 25 only(Jump from 5 to 25)
            sum = 26;
            playerMove(t,l);
            setTimeout( ()=>{
                sidi();
            },1500)
        }
        else if(currentNumber == 34){
            //Saap functionality 34 to 4 only(Jump from 34 to 4)
            sum = 4;
            playerMove(t,l);
            setTimeout( ()=>{
                saap();
            },1500)
            
        }
        else{
            playerMove(t,l);
        }
    }
    console.log("Sum = ",sum);
}
function saap(){
    player.style.top = 657+"px";
    player.style.left = 327+"px";
}

function sidi(){
    player.style.top = 529+"px";
    player.style.left = 448+"px";
}

function playerMove(t,l){
    player.style.top = t+64+"px";
    player.style.left = l+"px";
}