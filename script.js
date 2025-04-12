document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const wordGrid = document.getElementById('wordGrid');
    const wordList = document.getElementById('wordList');
    const newGameBtn = document.getElementById('newGameBtn');
    const playAgainBtn = document.getElementById('playAgainBtn');
    const nextLevelBtn = document.getElementById('nextLevelBtn');
    const retryLevelBtn = document.getElementById('retryLevelBtn');
    const prevLevelBtn = document.getElementById('prevLevelBtn');
    const gridSizeSelect = document.getElementById('gridSize');
    const difficultySelect = document.getElementById('difficulty');
    const themeToggle = document.getElementById('themeToggle');
    const foundCount = document.getElementById('foundCount');
    const totalWords = document.getElementById('totalWords');
    const gameScore = document.getElementById('gameScore');
    const finalTime = document.getElementById('finalTime');
    const finalScore = document.getElementById('finalScore');
    const finalLevel = document.getElementById('finalLevel');
    const currentLevel = document.getElementById('currentLevel');
    const streakCount = document.getElementById('streakCount');
    const winModal = document.getElementById('winModal');
    const timeUpModal = document.getElementById('timeUpModal');
    const wrongWordModal = document.getElementById('wrongWordModal');
    const continueBtn = document.getElementById('continueBtn');
    const hintBtn = document.getElementById('hintBtn');
    const hintCount = document.getElementById('hintCount');
    const hintModal = document.getElementById('hintModal');
    const closeHintBtn = document.getElementById('closeHintBtn');
    const hintWord = document.getElementById('hintWord');
    const hintPosition = document.getElementById('hintPosition');
    const winMeme = document.getElementById('winMeme');
    const wrongWordMeme = document.getElementById('wrongWordMeme');
    const timeUpMeme = document.getElementById('timeUpMeme');
    const timeBar = document.getElementById('timeBar');
    const timeText = document.getElementById('timeText');
    const foundBeforeTimeUp = document.getElementById('foundBeforeTimeUp');
    const totalBeforeTimeUp = document.getElementById('totalBeforeTimeUp');
    const currentYear = document.getElementById('currentYear');

    // Set current year in footer
    currentYear.textContent = new Date().getFullYear();

    // Game state
    let grid = [];
    let words = [];
    let foundWords = [];
    let selectedCells = [];
    let gameTimer;
    let countdownTimer;
    let seconds = 0;
    let timeLeft = 120;
    let score = 0;
    let level = 1;
    let streak = 0;
    let hintsRemaining = 3;
    let isMouseDown = false;
    let currentDifficulty = 'medium';
    
    // Memes
    const winMemes = [
        'https://i.imgflip.com/4/1bij.jpg',
        'images/swag.png',
        'images/good boy.png'
    ];
    
    const wrongWordMemes = [
        'images/are.png',
        'images/hatt.png',
        'images/angry.png',
        'images/angryy.png',
        'images/angryyy.png',
        'images/bro sad.png'
    ];

    const timeUpMemes = [
        'https://i.imgflip.com/4/1bgw.jpg',
        'https://i.imgflip.com/9vct.jpg',
        'images/angry.png',
        'images/angryy.png',
        'images/sad.png',
        'images/angryyy.png'
    ];

    // Word banks by difficulty and category
    const wordBanks = {
        easy: {
            animals: ['CAT', 'DOG', 'COW', 'PIG', 'OWL', 'BAT', 'FOX', 'BEE', 'ANT', 'OWL', 'RAT', 'HEN'],
            food: ['EGG', 'PIE', 'TEA', 'HAM', 'JAM', 'FIG', 'PEA', 'NUT', 'RYE', 'OAT', 'TAP', 'CAN'],
            nature: ['SUN', 'SKY', 'SEA', 'ICE', 'DEW', 'FOG', 'MAP', 'LOG', 'LEA', 'POD', 'TAP', 'CAN'],
            objects: ['BED', 'CAR', 'CUP', 'HAT', 'MAT', 'PAN', 'PEN', 'RUG', 'SOX', 'TOY', 'VAN', 'ZIP']
        },
        medium: {
            animals: ['LION', 'BEAR', 'DEER', 'FROG', 'GOAT', 'CRAB', 'DOVE', 'SWAN', 'WOLF', 'KOALA', 'ZEBRA', 'SNAKE'],
            food: ['APPLE', 'BREAD', 'CHIPS', 'DATES', 'FRIES', 'GRAPE', 'HONEY', 'JUICE', 'KIWI', 'LEMON', 'MANGO', 'ONION'],
            nature: ['RIVER', 'FOREST', 'DESERT', 'MEADOW', 'VALLEY', 'ISLAND', 'CANYON', 'VOLCANO', 'OCEAN', 'JUNGLE', 'PLAINS', 'CLOUDS'],
            objects: ['CHAIR', 'TABLE', 'PHONE', 'WATCH', 'GLASS', 'PLATE', 'KNIFE', 'SPOON', 'BRICK', 'CLOCK', 'DOOR', 'LIGHT']
        },
        hard: {
            animals: ['ELEPHANT', 'GIRAFFE', 'KANGAROO', 'LEOPARD', 'RACCOON', 'BUFFALO', 'DOLPHIN', 'PENGUIN', 'CHEETAH', 'HIPPO', 'CROCODILE', 'PLATYPUS'],
            food: ['AVOCADO', 'BROCCOLI', 'CUCUMBER', 'DONUTS', 'ESPRESSO', 'GUACAMOLE', 'HAMBURGER', 'JALAPENO', 'LASAGNA', 'MACARONI', 'NECTARINE', 'PISTACHIO'],
            science: ['BIOLOGY', 'CHEMISTRY', 'PHYSICS', 'ASTRONOMY', 'GEOLOGY', 'ECOLOGY', 'GENETICS', 'VOLCANO', 'QUASAR', 'NEUTRON', 'ELECTRON', 'MOLECULE'],
            geography: ['CONTINENT', 'PENINSULA', 'ARCHIPELAGO', 'LONGITUDE', 'LATITUDE', 'HORIZON', 'EQUATOR', 'TERRITORY', 'BOUNDARY', 'FRONTIER', 'ATLANTIC', 'PACIFIC']
        },
        expert: {
            animals: ['CHAMELEON', 'ARMADILLO', 'RHINOCEROS', 'PLATYPUS', 'KOMODODRAGON', 'OCTOPUS', 'PEACOCK', 'PORCUPINE', 'TARANTULA', 'WALRUS', 'YAK', 'ZEBRA'],
            food: ['ASPARAGUS', 'BLUEBERRY', 'CAULIFLOWER', 'DRAGONFRUIT', 'EGGPLANT', 'FIG', 'GRAPEFRUIT', 'HONEYDEW', 'ICECREAM', 'JICAMA', 'KALE', 'LYCHEE'],
            science: ['ASTROPHYSICS', 'BIOCHEMISTRY', 'CRYSTALLOGRAPHY', 'ELECTROMAGNETISM', 'PALEONTOLOGY', 'QUANTUM', 'THERMODYNAMICS', 'VIROLOGY', 'ZOOLOGY', 'BOTANY', 'GENOMICS', 'NEUROSCIENCE'],
            geography: ['ANTARCTICA', 'CARIBBEAN', 'HIMALAYAS', 'MEDITERRANEAN', 'MESOPOTAMIA', 'PATAGONIA', 'SAHARA', 'SCANDINAVIA', 'SIBERIA', 'TIBET', 'YUKON', 'ZAMBIA']
        }
    };

    // Theme toggle
    themeToggle.addEventListener('change', toggleTheme);
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggle.checked = savedTheme === 'dark';
    }
    
    // Initialize game
    newGameBtn.addEventListener('click', () => {
        level = 1;
        streak = 0;
        startNewGame();
    });
    playAgainBtn.addEventListener('click', startNewGame);
    nextLevelBtn.addEventListener('click', nextLevel);
    retryLevelBtn.addEventListener('click', startNewGame);
    prevLevelBtn.addEventListener('click', previousLevel);
    continueBtn.addEventListener('click', () => wrongWordModal.style.display = 'none');
    hintBtn.addEventListener('click', showHint);
    closeHintBtn.addEventListener('click', () => hintModal.style.display = 'none');
    
    // Handle difficulty change
    difficultySelect.addEventListener('change', (e) => {
        currentDifficulty = e.target.value;
        startNewGame();
    });
    
    // Start first game
    startNewGame();
    
    function toggleTheme() {
        const theme = themeToggle.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }
    
    function startNewGame() {
        // Reset game state
        clearInterval(gameTimer);
        clearInterval(countdownTimer);
        seconds = 0;
        foundWords = [];
        selectedCells = [];
        hintsRemaining = 3;
        hintCount.textContent = hintsRemaining;
        hintBtn.disabled = false;
        
        // Set time based on difficulty
        timeLeft = getTimeForDifficulty();
        updateTimeDisplay();
        
        // Update level display
        currentLevel.textContent = level;
        streakCount.textContent = streak;
        
        // Get game settings
        const size = parseInt(gridSizeSelect.value);
        
        // Generate words based on difficulty
        words = generateWords(size, currentDifficulty);
        totalWords.textContent = words.length;
        foundCount.textContent = foundWords.length;
        score = 0;
        gameScore.textContent = score;
        
        // Create word grid
        grid = createWordGrid(size, words);
        renderGrid();
        renderWordList();
        
        // Hide modals if open
        winModal.style.display = 'none';
        wrongWordModal.style.display = 'none';
        hintModal.style.display = 'none';
        timeUpModal.style.display = 'none';
        
        // Start timers
        gameTimer = setInterval(updateTimer, 1000);
        countdownTimer = setInterval(updateCountdown, 1000);
    }
    
    function getTimeForDifficulty() {
        const baseTime = 120;
        const sizeFactor = parseInt(gridSizeSelect.value) / 10;
        const levelFactor = 1 + (level * 0.1);
        
        switch(currentDifficulty) {
            case 'easy': return Math.floor(baseTime * 1.5 * sizeFactor / levelFactor);
            case 'medium': return Math.floor(baseTime * sizeFactor / levelFactor);
            case 'hard': return Math.floor(baseTime * 0.8 * sizeFactor / levelFactor);
            case 'expert': return Math.floor(baseTime * 0.6 * sizeFactor / levelFactor);
            default: return Math.floor(baseTime * sizeFactor / levelFactor);
        }
    }
    
    function nextLevel() {
        level++;
        streak++;
        startNewGame();
    }
    
    function previousLevel() {
        if (level > 1) {
            level--;
            streak = 0;
        }
        startNewGame();
    }
    
    function generateWords(size, difficulty) {
        const categories = Object.keys(wordBanks[difficulty]);
        const selectedCategories = categories.sort(() => 0.5 - Math.random()).slice(0, 2);
        
        let wordPool = [];
        selectedCategories.forEach(category => {
            wordPool = wordPool.concat(wordBanks[difficulty][category]);
        });
        
        const maxLength = Math.floor(size * 0.8);
        wordPool = wordPool.filter(word => word.length <= maxLength);
        
        const wordCount = Math.min(Math.floor(size * 0.7), wordPool.length);
        const shuffled = [...wordPool].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, wordCount);
    }
    
    function createWordGrid(size, words) {
        const grid = Array(size).fill().map(() => Array(size).fill(''));
        
        for (const word of words) {
            placeWordInGrid(grid, word.toUpperCase());
        }
        
        fillEmptySpaces(grid);
        return grid;
    }
    
    function placeWordInGrid(grid, word) {
        const size = grid.length;
        const directions = [
            { dr: 0, dc: 1 }, { dr: 1, dc: 0 }, { dr: 1, dc: 1 },
            { dr: 1, dc: -1 }, { dr: -1, dc: 1 }, { dr: -1, dc: 0 },
            { dr: 0, dc: -1 }, { dr: -1, dc: -1 }
        ];
        
        let placed = false;
        let attempts = 0;
        const maxAttempts = 100;
        
        while (!placed && attempts < maxAttempts) {
            attempts++;
            const shuffledDirections = [...directions].sort(() => 0.5 - Math.random());
            
            for (const dir of shuffledDirections) {
                const startRow = Math.floor(Math.random() * size);
                const startCol = Math.floor(Math.random() * size);
                const endRow = startRow + dir.dr * (word.length - 1);
                const endCol = startCol + dir.dc * (word.length - 1);
                
                if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) continue;
                
                let canPlace = true;
                for (let i = 0; i < word.length; i++) {
                    const r = startRow + dir.dr * i;
                    const c = startCol + dir.dc * i;
                    const cell = grid[r][c];
                    
                    if (cell !== '' && cell !== word[i]) {
                        canPlace = false;
                        break;
                    }
                }
                
                if (canPlace) {
                    for (let i = 0; i < word.length; i++) {
                        const r = startRow + dir.dr * i;
                        const c = startCol + dir.dc * i;
                        grid[r][c] = word[i];
                    }
                    placed = true;
                    break;
                }
            }
        }
        return placed;
    }
    
    function fillEmptySpaces(grid) {
        const size = grid.length;
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const vowelFrequency = 'EEEEEEEEEEAAAAAAAAAIIIIIIIIIOOOOOOOOUUUU';
        
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (grid[r][c] === '') {
                    grid[r][c] = Math.random() < 0.3 
                        ? vowelFrequency[Math.floor(Math.random() * vowelFrequency.length)]
                        : letters[Math.floor(Math.random() * letters.length)];
                }
            }
        }
    }
    
    function renderGrid() {
        wordGrid.innerHTML = '';
        wordGrid.style.gridTemplateColumns = `repeat(${grid.length}, minmax(30px, 1fr))`;
        
        grid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellElement = document.createElement('div');
                cellElement.className = 'grid-cell';
                cellElement.textContent = cell;
                cellElement.dataset.row = rowIndex;
                cellElement.dataset.col = colIndex;
                
                const isFound = foundWords.some(word => 
                    word.cells.some(c => c.row === rowIndex && c.col === colIndex)
                );
                
                if (isFound) cellElement.classList.add('found');
                
                cellElement.addEventListener('mousedown', handleCellMouseDown);
                cellElement.addEventListener('mouseenter', handleCellMouseEnter);
                cellElement.addEventListener('mouseup', handleCellMouseUp);
                cellElement.addEventListener('touchstart', handleTouchStart, { passive: false });
                cellElement.addEventListener('touchmove', handleTouchMove, { passive: false });
                cellElement.addEventListener('touchend', handleTouchEnd);
                
                wordGrid.appendChild(cellElement);
            });
        });
    }
    
    function renderWordList() {
        wordList.innerHTML = '';
        words.forEach(word => {
            const wordElement = document.createElement('div');
            wordElement.className = 'word-item';
            wordElement.textContent = word.toUpperCase();
            
            if (foundWords.some(found => found.word === word.toUpperCase())) {
                wordElement.classList.add('found');
            }
            
            wordList.appendChild(wordElement);
        });
    }
    
    function handleCellMouseDown(e) {
        isMouseDown = true;
        document.body.classList.add('no-select');
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        selectedCells = [{ row, col }];
        updateSelectedCells();
    }
    
    function handleCellMouseEnter(e) {
        if (!isMouseDown) return;
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        
        if (!selectedCells.some(cell => cell.row === row && cell.col === col)) {
            const lastCell = selectedCells[selectedCells.length - 1];
            const isAdjacent = Math.abs(lastCell.row - row) <= 1 && Math.abs(lastCell.col - col) <= 1;
            
            if (isAdjacent) {
                selectedCells.push({ row, col });
                updateSelectedCells();
            }
        }
    }
    
    function handleCellMouseUp() {
        isMouseDown = false;
        document.body.classList.remove('no-select');
        
        if (selectedCells.length < 2) {
            selectedCells = [];
            updateSelectedCells();
            return;
        }
        
        const selectedWord = selectedCells.map(cell => grid[cell.row][cell.col]).join('');
        const reversedWord = selectedWord.split('').reverse().join('');
        const matchedWord = words.find(word => 
            word.toUpperCase() === selectedWord || word.toUpperCase() === reversedWord
        );
        
        if (matchedWord && !foundWords.some(found => found.word === matchedWord.toUpperCase())) {
            foundWords.push({
                word: matchedWord.toUpperCase(),
                cells: [...selectedCells]
            });
            
            const wordScore = matchedWord.length * 10 * level * (1 + streak * 0.1);
            score += Math.floor(wordScore);
            
            foundCount.textContent = foundWords.length;
            gameScore.textContent = score;
            streakCount.textContent = streak;
            renderGrid();
            renderWordList();
            
            if (foundWords.length === words.length) endGame();
        } else if (selectedWord.length >= 3) {
            showWrongWordMeme();
            streak = 0;
            streakCount.textContent = streak;
        }
        
        selectedCells = [];
        updateSelectedCells();
    }
    
    function updateSelectedCells() {
        document.querySelectorAll('.grid-cell').forEach(cell => {
            cell.classList.remove('selected');
        });
        
        selectedCells.forEach(cell => {
            const cellElement = document.querySelector(`.grid-cell[data-row="${cell.row}"][data-col="${cell.col}"]`);
            if (cellElement) cellElement.classList.add('selected');
        });
    }
    
    function showWrongWordMeme() {
        const randomMeme = wrongWordMemes[Math.floor(Math.random() * wrongWordMemes.length)];
        wrongWordMeme.innerHTML = `<img src="${randomMeme}" alt="Funny meme">`;
        wrongWordModal.style.display = 'flex';
    }
    
    function showHint() {
        if (hintsRemaining <= 0) return;
        const unfoundWords = words.filter(word => 
            !foundWords.some(found => found.word === word.toUpperCase())
        );
        
        if (unfoundWords.length === 0) return;
        const hintWord = unfoundWords[Math.floor(Math.random() * unfoundWords.length)];
        
        for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[r].length; c++) {
                if (grid[r][c] === hintWord[0]) {
                    const directions = [
                        { dr: 0, dc: 1 }, { dr: 1, dc: 0 }, { dr: 1, dc: 1 },
                        { dr: 1, dc: -1 }, { dr: -1, dc: 1 }, { dr: -1, dc: 0 },
                        { dr: 0, dc: -1 }, { dr: -1, dc: -1 }
                    ];
                    
                    for (const dir of directions) {
                        let match = true;
                        for (let i = 1; i < hintWord.length; i++) {
                            const newR = r + dir.dr * i;
                            const newC = c + dir.dc * i;
                            
                            if (newR < 0 || newR >= grid.length || newC < 0 || newC >= grid[0].length || 
                                grid[newR][newC] !== hintWord[i]) {
                                match = false;
                                break;
                            }
                        }
                        
                        if (match) {
                            hintsRemaining--;
                            hintCount.textContent = hintsRemaining;
                            if (hintsRemaining <= 0) hintBtn.disabled = true;
                            score = Math.max(0, score - 20 * level);
                            gameScore.textContent = score;
                            hintWord.textContent = hintWord;
                            hintPosition.textContent = `Row ${r + 1}, Column ${c + 1}`;
                            hintModal.style.display = 'flex';
                            return;
                        }
                    }
                }
            }
        }
    }
    
    function updateTimer() {
        seconds++;
    }
    
    function updateCountdown() {
        timeLeft--;
        updateTimeDisplay();
        if (timeLeft <= 0) timeUp();
    }
    
    function updateTimeDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timeText.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        const percentage = (timeLeft / getTimeForDifficulty()) * 100;
        timeBar.style.width = `${percentage}%`;
        
        if (percentage > 50) timeBar.style.backgroundColor = 'var(--time-bar-full)';
        else if (percentage > 20) timeBar.style.backgroundColor = 'var(--time-bar-medium)';
        else timeBar.style.backgroundColor = 'var(--time-bar-low)';
    }
    
    function timeUp() {
        clearInterval(gameTimer);
        clearInterval(countdownTimer);
        foundBeforeTimeUp.textContent = foundWords.length;
        totalBeforeTimeUp.textContent = words.length;
        const randomMeme = timeUpMemes[Math.floor(Math.random() * timeUpMemes.length)];
        timeUpMeme.innerHTML = `<img src="${randomMeme}" alt="Time's up meme">`;
        timeUpModal.style.display = 'flex';
        streak = 0;
        streakCount.textContent = streak;
    }
    
    function endGame() {
        clearInterval(gameTimer);
        clearInterval(countdownTimer);
        const timeBonus = Math.max(0, timeLeft) * level;
        score += timeBonus;
        gameScore.textContent = score;
        const randomMeme = winMemes[Math.floor(Math.random() * winMemes.length)];
        winMeme.innerHTML = `<img src="${randomMeme}" alt="Congratulations meme">`;
        finalTime.textContent = timeText.textContent;
        finalScore.textContent = score;
        finalLevel.textContent = level;
        winModal.style.display = 'flex';
    }
    
    function handleTouchStart(e) {
        e.preventDefault();
        isMouseDown = true;
        document.body.classList.add('no-select');
        const cell = e.target.closest('.grid-cell');
        if (!cell) return;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        selectedCells = [{ row, col }];
        updateSelectedCells();
    }
    
    function handleTouchMove(e) {
        if (!isMouseDown) return;
        e.preventDefault();
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        const cell = element?.closest('.grid-cell');
        
        if (cell) {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            
            if (!selectedCells.some(c => c.row === row && c.col === col)) {
                const lastCell = selectedCells[selectedCells.length - 1];
                const isAdjacent = Math.abs(lastCell.row - row) <= 1 && Math.abs(lastCell.col - col) <= 1;
                
                if (isAdjacent) {
                    selectedCells.push({ row, col });
                    updateSelectedCells();
                }
            }
        }
    }
    
    function handleTouchEnd() {
        isMouseDown = false;
        document.body.classList.remove('no-select');
        handleCellMouseUp();
    }
});