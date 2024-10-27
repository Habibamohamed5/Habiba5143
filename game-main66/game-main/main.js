const images = [
    { src: 'images/short.jpg', word: 'short' },
    { src: 'images/noisy.jpg', word: 'Noisy' },
    { src: 'images/quiet.jpg', word: 'quiet' },
    { src: 'images/long.jpg', word: 'long' },
    { src: 'images/small.jpg', word: 'small' },
    { src: 'images/strong.jpg', word: 'strong' },
    { src: 'images/weak.jpg', word: 'Weak' },
    { src: 'images/big.jpg', word: 'Big' },
];

let currentIndex = 0;
let selectedChoice = null;
let score = 0;
const winningScore = 8;

function setImage() {
    if (currentIndex >= images.length) {
        showCongrats();
        return;
    }

    const imageElement = document.getElementById('image');
    const currentImage = images[currentIndex];
    imageElement.src = currentImage.src;
    imageElement.dataset.word = currentImage.word;
    setChoices();
    updateProgressBar();
}

function setChoices() {
    const choicesContainer = document.getElementById('choices-container');
    const correctWord = images[currentIndex].word;
    const words = images.map(img => img.word).sort(() => 0.5 - Math.random());
    const choices = words.slice(0, 3);

    if (!choices.includes(correctWord)) {
        choices[Math.floor(Math.random() * 3)] = correctWord;
    }

    const choiceButtons = choicesContainer.getElementsByClassName('choice');
    for (let i = 0; i < choiceButtons.length; i++) {
        choiceButtons[i].innerText = choices[i];
        choiceButtons[i].dataset.word = choices[i];
        choiceButtons[i].classList.remove('selected');
    }
}

function selectChoice(button) {
    if (selectedChoice) {
        selectedChoice.classList.remove('selected');
    }
    selectedChoice = button;
    button.classList.add('selected');

    const audioElement = new Audio(`sounds/${button.dataset.word}.mp3`);
    audioElement.play();
}

function checkAnswer() {
    const imageElement = document.getElementById('image');
    const correctWord = imageElement.dataset.word;
    const result = document.getElementById('result');

    if (selectedChoice && selectedChoice.dataset.word === correctWord) {
        result.innerText = "Correct!";
        result.style.color = "green";
        new Audio('sounds/correct.mp3').play();
        score++;
    } else {
        result.innerText = "Try again!";
        result.style.color = "red";
        new Audio('sounds/wrong.mp3').play();
    }

    document.getElementById('score').innerText = `Score: ${score}`;
    nextImage();
}

function nextImage() {
    currentIndex++;
    selectedChoice = null;
    setImage();
}

function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const progress = ((currentIndex + 1) / images.length) * 100;
    progressBar.style.width = progress + '%';
}

function showCongrats() {
    const congratsModal = document.getElementById('congratsModal');
    const congratsContent = document.getElementById('congratsContent');
    if (score >= winningScore) {
        congratsContent.innerHTML = '🎉 Congratulations! You\'ve won! 🎉<p>Click anywhere to continue</p>';
        const congratsAudio = new Audio('sounds/congrats.mp3');
        congratsAudio.play();


    } else {
        congratsContent.innerHTML = 'Game Over!<p>Click anywhere to try again</p>';
    }
    congratsModal.style.display = 'flex';
}

function closeCongrats() {
    document.getElementById('congratsModal').style.display = 'none';
    document.getElementById('score').innerText = 'Score: 0';
    currentIndex = 0;
    score = 0;
    setImage();
}

window.onload = () => {
    setImage();
    document.getElementById('score').innerText = `Score: ${score}`;
    document.getElementById('congratsModal').style.display = 'none'; // Ensure the modal is hidden on load
};