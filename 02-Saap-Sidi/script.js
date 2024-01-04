let generatedNumber;
let sum = 0;
let dice = document.getElementById("sum");
function rollDice(){
    generatedNumber = Math.floor((Math.random()*6)+1);
    dice.innerText = generatedNumber;
    sum+=generatedNumber;
    console.log("Sum = ",sum);
}