let generatedNumber;
let sum = 0;
let previousNumber = 1;
let currentNumber = 0;
let dice = document.getElementById("sum");
let player = document.getElementById("player");
let circle = document.getElementById("circle");
let btn = document.getElementById("dice");

function rollDice(){
    generatedNumber = Math.floor((Math.random()*6)+1);
    dice.innerText = generatedNumber;
    sum+=generatedNumber;
    currentNumber = sum;

    if(sum==100){
        console.log(sum,"sum");
        btn.disabled = true;
    }

    for (let i = previousNumber; i <= currentNumber; i++) {
        let boxValue = document.getElementById("box"+ i);
        const rect = boxValue.getBoundingClientRect();
        const position = {
            left: rect.right,
            top: rect.top,
        };

        let top = position.top;
        let left = position.left;

        
        setTimeout( ()=>{
            playerMove(top,left);
        },i*1000);
        // playerMove(top,left);
        
        // break;   
    }
    // console.log("Sum = ",sum);
}

function playerMove(top,left){
    // console.log("Curent Num",sum+" Top = ",top-624+" | Left = ",left-71);
    console.log("-----------------");
    circle.style.transform = `translateY(${top-688}px) translateX(${left-71}px)`; mobile
    // circle.style.transform = `translateY(${top-696}px) translateX(${left-427}px)`;/*Desktop*/
}