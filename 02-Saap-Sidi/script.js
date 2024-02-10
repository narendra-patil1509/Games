let generatedNumber;
let sum = 0;
let previousNumber = 1;
let currentNumber = 0;
let dice = document.getElementById("sum");
let player = document.getElementById("player");
let button = document.getElementById("btn");
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

    

    if(sum>=100){
        console.log(sum,"sum");
        button.removeAttribute("onclick");
    }

    for (let i = previousNumber; i <= currentNumber; i++) {
        let boxValue = document.getElementById("box"+ i);
        let t = boxValue.offsetTop;
        let l = boxValue.offsetLeft;

        if(currentNumber == 5){
            //Sidi functionality 5 to 25 only(Jump from 5 to 25)
            sum = 26;
            boxValue = document.getElementById("box26");
            let tt = boxValue.offsetTop;
            let ll = boxValue.offsetLeft;
            playerMove(t,l);
            setTimeout( ()=>{
                saapSidi(tt,ll);
            },1500)
        }
        else if(currentNumber == 31){
            //Saap functionality 34 to 4 only(Jump from 34 to 4)
            sum = 8;
            boxValue = document.getElementById("box8");
            let tt = boxValue.offsetTop;
            let ll = boxValue.offsetLeft;
            playerMove(t,l);
            setTimeout( ()=>{
                saapSidi(tt,ll);
            },1500)
            
        }
        else{
            playerMove(t,l);
        }
    }
    // console.log("Sum = ",sum);
}
function saapSidi(tt,ll){
    player.style.top = tt+68+"px"; 
    player.style.left = ll-4+"px";
}

function playerMove(t,l){
    player.style.top = t+68+"px";
    player.style.left = l-4+"px";
}