let generatedNumber;
// let sum = 0;
// let previousNumber = 1;
// let currentNumber = 0;
let dice = document.getElementById("sum");

let button = document.getElementById("btn");
let circle = document.getElementById("circle");
let diceImage = document.getElementById("dImage");
let diceSound = new Audio("audio/diceSound.mp3");
let btn = document.getElementById("dice");
let d = parseInt(sessionStorage.getItem("pp"));
let p=1;
let o=1;

class Player{
    constructor(){
        this.sums = 0;
        this.previousNumbers = 1;
        this.currentNumbers = 0;
        this.generatedNumbers = 1;
    }

    playerSum(generatedNumbers){
        this.sums+= generatedNumbers;
        this.currentNumbers = this.sums;
        this.previousNumbers = this.currentNumbers - this.previousNumbers;
        console.log("Player Current Sum = ",this.currentNumbers);
        return this;
    }
}

let ps1 = new Player();
let ps2 = new Player();
let ps3 = new Player();
let ps4 = new Player();

function whichplayer(){
    if(o==5){
        console.log("Op = ",o);
        o=1;
    }
    sessionStorage.setItem("Player-Number",o);
    o++;
    rollDice();
}

function rollDice(){
    let il = parseInt(sessionStorage.getItem("Player-Number"));
    console.log(il);
    
    p=il;
    generatedNumber = Math.floor((Math.random()*6)+1);

    if(il == 1){
        let ob1 = ps1.playerSum(generatedNumber);
        console.log("Player 1  Generated Num = ",generatedNumber);
        positionIteration(il,ob1.currentNumbers);
    }
    if(il == 2){
        let ob2 = ps2.playerSum(generatedNumber);
        console.log("Player 2 Generated Num = ",generatedNumber);
        positionIteration(il,ob2.currentNumbers);
    }
    if(il == 3){
        let ob3 = ps3.playerSum(generatedNumber);
        console.log("Player 3 Generated Num = ",generatedNumber);
        positionIteration(il,ob3.currentNumbers);
    }
    if(il == 4){
        let ob4 = ps4.playerSum(generatedNumber);
        console.log("Player 4 Generated Num = ",generatedNumber);
        positionIteration(il,ob4.currentNumbers);
    }
    diceImage.src = `images/Untitled design/${generatedNumber}.png`;
    diceImage.style.transform = `rotate(${2*generatedNumber*180}deg)`;
    diceSound.play();
    // dice.textContent = generatedNumber;
    sum+=generatedNumber;
    currentNumber = sum;

    if(sum>=100){
        console.log(sum,"sum");
        button.removeAttribute("onclick");
        button.style.display = 'none';

        //Winneer Window will show here
        
    }

    function positionIteration(p,cns){
        let pns = 1;
        for (let i = pns; i <= cns; i++) {
            let boxValue = document.getElementById("box"+ i);
            let t = boxValue.offsetTop;
            let l = boxValue.offsetLeft;
            playerMove(t,l,p);
        }
    }
    // for (let i = previousNumber; i <= currentNumber; i++) {
    //     console.log("i = ",i);
    //     let boxValue = document.getElementById("box"+ i);
    //     let t = boxValue.offsetTop;
    //     let l = boxValue.offsetLeft;

    //     if(currentNumber == 5){
    //         //Sidi functionality 5 to 25 only(Jump from 5 to 25)
    //         sum = 26;
    //         boxValue = document.getElementById("box26");
    //         let tt = boxValue.offsetTop;
    //         let ll = boxValue.offsetLeft;
    //         playerMove(t,l,p);
    //         setTimeout( ()=>{
    //             saapSidi(tt,ll,p);
                
    //         },1500)
    //     }
    //     else if(currentNumber == 31){
    //         //Saap functionality 34 to 4 only(Jump from 34 to 4)
    //         sum = 8;
    //         boxValue = document.getElementById("box8");
    //         let tt = boxValue.offsetTop;
    //         let ll = boxValue.offsetLeft;
    //         playerMove(t,l,p);
    //         setTimeout( ()=>{
    //             saapSidi(tt,ll,p);
    //         },1500)
            
    //     }
    //     else{
    //         playerMove(t,l,p);
    //     }
    // }
}
function saapSidi(tt,ll,p){
    let player = document.getElementById("player"+p);
    player.style.top = tt+7+"px"; 
    player.style.left = ll-4+"px";
}

function playerMove(t,l,p){
    // console.log("PlayerMove = ",p);
    let player = document.getElementById("player"+p);
    player.style.top = t+12+"px";
    player.style.left = l+13+"px";
}

window.onload = ()=>{
    if(p!=null){
        p=1;
        console.log("Onload P = ",p);
    }
  }