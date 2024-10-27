const wordsColumn1 = [
    { word: 'Long', image: 'images/long.jpg', sound: 'sounds/long.mp3', opposite: 'Short' },
    { word: 'Big', image: 'images/big.jpg', sound: 'sounds/big.mp3', opposite: 'Small' },
    { word: 'Quiet', image: 'images/quiet.jpg', sound: 'sounds/quiet.mp3', opposite: 'Noisy' },
    { word: 'Strong', image: 'images/strong.jpg', sound: 'sounds/strong.mp3', opposite: 'Weak' }
];

const wordsColumn2 = [
    { word: 'Short', image: 'images/short.jpg', sound: 'sounds/short.mp3', opposite: 'Long' },
    { word: 'Noisy', image: 'images/noisy.jpg', sound: 'sounds/noisy.mp3', opposite: 'Quiet' },
    { word: 'Weak', image: 'images/weak.jpg', sound: 'sounds/weak.mp3', opposite: 'Strong' },
    { word: 'Small', image: 'images/small.jpg', sound: 'sounds/small.mp3', opposite: 'Big' }
];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const wordsContainer = document.getElementById('words');
    const oppositesContainer = document.getElementById('opposites');
    shuffle(wordsColumn1);
    shuffle(wordsColumn2);
    wordsColumn1.forEach(data => {
        const wordContainer = document.createElement('div');
        wordContainer.classList.add('word-container');

        const imgElement = document.createElement('img');
        imgElement.src = data.image;
        imgElement.alt = data.word;

        const wordElement = document.createElement('p');
        wordElement.classList.add('word');
        wordElement.setAttribute('data-sound', data.sound);
        wordElement.setAttribute('data-word', data.word.toLowerCase());
        wordElement.setAttribute('data-opposite', data.opposite.toLowerCase());
        wordElement.innerText = data.word;

        wordContainer.appendChild(imgElement);
        wordContainer.appendChild(wordElement);
        wordsContainer.appendChild(wordContainer);

        const audioElement = document.createElement('audio');
        audioElement.id = data.sound;
        audioElement.src = data.sound;
        document.body.appendChild(audioElement);
    });

    wordsColumn2.forEach(data => {
        const oppositeContainer = document.createElement('div');
        oppositeContainer.classList.add('word-container');

        const imgElement = document.createElement('img');
        imgElement.src = data.image;
        imgElement.alt = data.word;

        const oppositeElement = document.createElement('p');
        oppositeElement.classList.add('opposite');
        oppositeElement.setAttribute('data-sound', data.sound);
        oppositeElement.setAttribute('data-word', data.word.toLowerCase());
        oppositeElement.setAttribute('data-opposite', data.opposite.toLowerCase());
        oppositeElement.innerText = data.word;

        oppositeContainer.appendChild(imgElement);
        oppositeContainer.appendChild(oppositeElement);
        oppositesContainer.appendChild(oppositeContainer);

        const audioElement = document.createElement('audio');
        audioElement.id = data.sound;
        audioElement.src = data.sound;
        document.body.appendChild(audioElement);
    });

    const words = document.querySelectorAll('.word');
    const opposites = document.querySelectorAll('.opposite');
    let selectedWord = null;
    let selectedOpposite = null;
    const connections = [];

    words.forEach(word => {
        word.addEventListener('click', () => {
            if (selectedWord) {
                selectedWord.classList.remove('selected');
            }
            selectedWord = word;
            word.classList.add('selected');
            if (selectedOpposite) {
                createConnection();
            }
        });

        word.addEventListener('click', () => {
            const soundId = word.getAttribute('data-sound');
            const audioElement = document.getElementById(soundId);
            if (audioElement) {
                audioElement.play();
            }
        });
    });

    opposites.forEach(opposite => {
        opposite.addEventListener('click', () => {
            if (selectedOpposite) {
                selectedOpposite.classList.remove('selected');
            }
            selectedOpposite = opposite;
            opposite.classList.add('selected');
            if (selectedWord) {
                createConnection();
            }
        });

        opposite.addEventListener('click', () => {
            const soundId = opposite.getAttribute('data-sound');
            const audioElement = document.getElementById(soundId);
            if (audioElement) {
                audioElement.play();
            }
        });
    });

    function createConnection() {
        connections.forEach(connection => {
            if (connection.word === selectedWord) {
                connection.line.remove();
                connections.splice(connections.indexOf(connection), 1);
            }
        });

        const line = new LeaderLine(selectedWord, selectedOpposite);
        connections.push({ word: selectedWord, opposite: selectedOpposite, line });
        selectedWord.classList.remove('selected');
        selectedOpposite.classList.remove('selected');
        selectedWord = null;
        selectedOpposite = null;
    }

    document.getElementById('checkButton').addEventListener('click', () => {
        words.forEach(word => {
            word.classList.remove('correct', 'incorrect');
        });
        opposites.forEach(opposite => {
            opposite.classList.remove('correct', 'incorrect');
        });

        connections.forEach(connection => {
            const wordText = connection.word.getAttribute('data-word');
            const oppositeText = connection.opposite.getAttribute('data-word');
            const wordOpposite = connection.word.getAttribute('data-opposite');
            if (wordOpposite === oppositeText) {
                connection.word.classList.add('correct');
                connection.opposite.classList.add('correct');
            } else {
                connection.word.classList.add('incorrect');
                connection.opposite.classList.add('incorrect');
            }
        });
    });

    document.getElementById('resetButton').addEventListener('click', () => {
        // Reset colors
        words.forEach(word => {
            word.classList.remove('correct', 'incorrect');
        });
        opposites.forEach(opposite => {
            opposite.classList.remove('correct', 'incorrect');
        });

        // Remove all connections
        connections.forEach(connection => {
            connection.line.remove();
        });
        connections.length = 0;
    });
});