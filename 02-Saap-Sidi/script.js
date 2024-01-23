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

        if(currentNumber == 5){
            //Sidi functionality 5 to 25 only(Jump from 5 to 25)
            setTimeout( ()=>{
                sum = 25;
                playerMove(top,left);
                setTimeout( ()=>{
                    circle.style.transform = `translateY(-174.2px) translateX(273.75px)`;
                },5000);
            },i*1000);
        }
        else if(currentNumber == 34){
            //Saap functionality 34 to 4 only(Jump from 34 to 4)
            setTimeout( ()=>{
                sum = 4;
                playerMove(top,left);
                setTimeout( ()=>{
                    circle.style.transform = `translateY(-46.2px) translateX(209.75px)`;
                },34000);
            },i*1000);
        }
        else{
            setTimeout( ()=>{
                
            },1000);
            playerMove(top,left);
        }
    }
    console.log("Sum = ",sum);
}

function playerMove(top,left){
    // console.log("Curent Num",sum+" Top = ",top-624+" | Left = ",left-71);
    console.log("Current Num ",currentNumber);
    // circle.style.transform = `translateY(${top-688}px) translateX(${left-71}px)`; mobile
    circle.style.transform = `translateY(${top-697}px) translateX(${left-475}px)`;/*Desktop*/
    // circle.style.transform = `translateY(${top-697}px) translateX(${left-420}px)`;
}