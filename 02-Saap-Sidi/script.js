let generatedNumber;
let dice = document.getElementById("sum");
let button = document.getElementById("btn");
let circle = document.getElementById("circle");
let diceImage = document.getElementById("dImage");
let diceSound = new Audio("audio/diceSound.mp3");
let btn = document.getElementById("dice");
let playersbox = document.getElementById("players-box");
let d = parseInt(sessionStorage.getItem("pp"));
let p=1;
let o=1;
const winnersArray = [];

class Player{
    constructor(){
        this.sums = 0;
        this.previousNumbers = 1;
        this.currentNumbers = 0;
        this.generatedNumbers = 1;
        this.winnerStatus = false;
    }
    playerSum(generatedNumbers){
        this.getCurrentNum();
        this.sums+= generatedNumbers;
        this.currentNumbers = this.getCurrentNum()+ generatedNumber;
        this.previousNumbers = this.currentNumbers - this.previousNumbers;
        console.log("Player Current Sum = ",this.currentNumbers);
        return this;
    }
    setCurrentNum(cu){
        this.currentNumbers = cu;                                       
    }
    setsumsNum(sums){
        this.sums;                                       
    }
    setWinnerStatus(status){
        this.winnerStatus = status;
    }
    getWinnerStatus(){
        return this.winnerStatus;
    }
    getCurrentNum(){
       return this.currentNumbers;                                       
    }
    getsumsNum(){
       return this.sums;                                       
    }
}

let ps1 = new Player();
let ps2 = new Player();
let ps3 = new Player();
let ps4 = new Player();

function whichplayer(){
    if(o==5){
        o=1;
    }
    sessionStorage.setItem("Player-Number",o);
    o++;
    rollDice();
}

function rollDice(){
    let p = parseInt(sessionStorage.getItem("Player-Number")); 
    generatedNumber = Math.floor((Math.random()*6)+1);
    // generatedNumber = 6;
    if(generatedNumber == 6){
        o = p;
        // alert("You rolled a six! It's your turn again!",o);
    }
    if(p == 1){  
        
        // button.style.background = "#2C7408";
        button.style.color = "#000";
        
        if(ps1.getWinnerStatus()){
            sessionStorage.setItem("Player-Number",2);
            o++;
           
            console.log("Winner Status ",ps1.getWinnerStatus(),"player ",o);
            
        }
        else if(!(ps1.getWinnerStatus())){
            let ob1 = ps1.playerSum(generatedNumber);
            console.log("Player 1  Generated Num = ",generatedNumber);
            positionIteration(p,ob1);
        }
        if(ps2.getWinnerStatus()){
            o=3;
        }
        
    }
    if(p == 2){
        // button.style.background = "#00DDFF";
        button.style.color = "#000";
        
        if(ps2.getWinnerStatus()){
            sessionStorage.setItem("Player-Number",3);
            o++;
            
            console.log("Winner Status ",ps2.getWinnerStatus(),"player ",o);
        }
        else if(!(ps2.getWinnerStatus())){
            let ob2 = ps2.playerSum(generatedNumber);
            console.log("Player 2 Generated Num = ",generatedNumber);
        positionIteration(p,ob2);
        }
        if(ps3.getWinnerStatus()){
            o=4;
        }
        
    }
    if(p == 3){
        // button.style.background = "#9B10C5";
        button.style.color = "#000";
        
        if(ps3.getWinnerStatus()){
            sessionStorage.setItem("Player-Number",4);
            o++;
            
            console.log("Winner Status ",ps3.getWinnerStatus(),"player ",o);
        }
        else if(!(ps3.getWinnerStatus())){
            let ob3 = ps3.playerSum(generatedNumber);
            console.log("Player 3 Generated Num = ",generatedNumber);
        positionIteration(p,ob3);
        }
        if(ps4.getWinnerStatus()){
            o=1;
        }
        
    }
    if(p == 4){
        // button.style.background = "#DBF300";
        button.style.color = "#000";
        
        if(ps4.getWinnerStatus()){
            sessionStorage.setItem("Player-Number",1);
            o=1;
            
            console.log("Winner Status ",ps4.getWinnerStatus(),"player ",o);
        }
        else if(!(ps4.getWinnerStatus())){
            let ob4 = ps4.playerSum(generatedNumber);
            console.log("Player 4 Generated Num = ",generatedNumber);
        positionIteration(p,ob4);
        }
        if(ps1.getWinnerStatus()){
            o=2;
        }
        
    }
    console.log("----------------------------------");
    diceImage.src = `images/Untitled design/${generatedNumber}.png`;
    diceImage.style.transform = `rotate(${2*generatedNumber*180}deg)`;
    diceSound.play();

    function positionIteration(p,ob){
        let winnermsg = document.getElementById("winnermsg");
        let popup = document.querySelector('.popup');
        let confe = document.querySelector('#my-canvas');

        var confettiSettings = { target: 'my-canvas' };
        var confetti = new ConfettiGenerator(confettiSettings);
        confetti.render();
        
        let pns = 1;
        let cns = ob.currentNumbers;
        if(cns == 100){
            // winner status set
            ob.setWinnerStatus(true);

            //pushing winner in Array
            winnersArray.push(p);
            document.getElementById('players-box').innerHTML +=  `<div class="P1" id="p${p}">P${p}</div>`;
            
            setTimeout( ()=>{
                popup.classList.add('active');
                confe.classList.add('active');
                winnermsg.innerText = `Player ${p} is 🏆Winner🏆`
                // document.getElementById(`p${p}`).innerText = p;
            },1500);
            
            console.log("100 winner");
            setTimeout( ()=>{
                popup.classList.remove('active');
                confe.classList.remove('active');
            },5000);
        }
        
        if(cns<101){
            for (let i = pns; i <= cns; i++) {
                let boxValue = document.getElementById("box"+ i);
                let t = boxValue.offsetTop;
                let l = boxValue.offsetLeft;
                
                if(cns == 5){
                    //Sidi functionality 5 to 25 only(Jump from 5 to 26)
                    boxValue = document.getElementById("box26");
                    let tt = boxValue.offsetTop;
                    let ll = boxValue.offsetLeft;
                    ob.setCurrentNum(26);
                    playerMove(t,l,p);
                    setTimeout( ()=>{
                        saapSidi(tt,ll,p);
                    },1500)
                }
                else if(cns == 31){
                    //Saap functionality 34 to 4 only(Jump from 34 to 4)
                    sum = 8;
                    boxValue = document.getElementById("box8");
                    let tt = boxValue.offsetTop;
                    let ll = boxValue.offsetLeft;
                    ob.setCurrentNum(8);
                    playerMove(t,l,p);
                    setTimeout( ()=>{
                        saapSidi(tt,ll,p);
                    },1500);
                }
                else{
                    playerMove(t,l,p);
                }            
            }
            
        }
        else if(cns>100){
            cns = ob.setCurrentNum(cns-generatedNumber);
            console.log("Set CurrentNum after 100 = ",ob.getCurrentNum());
        }
    }
}
function saapSidi(tt,ll,p){
    let player = document.getElementById("player"+p);

    setTimeout( ()=>{
        player.style.top = tt+7+6+"px";
    player.style.left = ll-4+16+"px";
    },1000);
    
}

function playerMove(t,l,p){
    let player = document.getElementById("player"+p);

    setTimeout( ()=>{
        player.style.top = t+12+3-1+"px";
    player.style.left = l+13+3-2+"px";
    },1500);
    
}

window.onload = ()=>{
    if(p!=null){
        p=1;
        console.log("Onload P = ",p);
    }
}

