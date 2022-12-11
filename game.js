const buttonColors = ['green', 'red', 'yellow', 'blue'] 
let gamePattern = []
let userClickedPattern = []
let level = 0
let isStarted = false
let time = 500

//!Game Start Here
$('#level-title').click(function() {
    if(!isStarted) {
        nextSequence()
        isStarted = true
    }
})


//? For Player Click
let userChosenColor

function playerClick() {
    userChosenColor = $(this).attr('id')
    playSound(userChosenColor)
    animatePress(userChosenColor)
    userClickedPattern.push(userChosenColor)
    checkAnswer(userClickedPattern.length-1)
} 

//? For nextSequence()
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const thingsToDo = () => {
    let randomNumber = Math.floor(Math.random() * 4)
    let randomChosenColor = buttonColors[randomNumber]
    $(`#${randomChosenColor}`).fadeOut(100).fadeIn(100)
    playSound(randomChosenColor)
    gamePattern.push(randomChosenColor)
}

//! Main Function
async function nextSequence() {
    //* Disable btn click, let the Simon do his thing first
    $('.btn').off('click')

    gamePattern = []
    level ++
    $('#level-title').text(`Level ${level}`)
    
    for(let i = 0; i < level; i++) {
        await sleep(time).then(() => thingsToDo())
    }

    //* Only then player can click the btn
    $('.btn').on('click', playerClick)
}

function startOver() {
    level = 0
    gamePattern = []
    userClickedPattern = []
    isStarted = false
}

//? General Functions, defining function with arrow function, no problem arise
const playSound = (name) => {
    let audio = new Audio(`./sounds/${name}.mp3`)
    audio.play()
}

const animatePress = (currentColor) => {
    $(`#${currentColor}`).addClass(`pressed`)
    setTimeout(() => {
        $(`#${currentColor}`).removeClass(`pressed`)
    }, 100);
}


//? Check Answer
async function checkAnswer(currentLevel) {
    if(gamePattern[currentLevel] !== userClickedPattern[currentLevel]) {
        $('.btn').off('click')
        playSound('wrong')
        $(document.body).addClass('game-over')
        setTimeout(()=> {
            $(document.body).removeClass('game-over')
        },100)
        $('#level-title').text(`Game Over, Click here to Restart`)
        startOver()
    } else {
        if(userClickedPattern.length === gamePattern.length) {
            time -= 10
            $('.btn').off('click')
            await sleep(1000).then(() => {
                userClickedPattern = []
                nextSequence();
            })
        }
    }
}
