let courses = [];
let scores = [];
let holeIndex = 0;
let totalScore = 0;
let selectedScores = {};
let show = false;
let roundIdCounter = 1;
const startRoundBtn = document.querySelector('.start-round');
const modal = document.querySelector('.modal');
const originalModalContent = modal.innerHTML;

document.addEventListener('DOMContentLoaded', () => {
    const getScores = async () => {
        const response = await fetch('http://localhost:4000/scores');
        const data = await response.json();
        scores = data;
        console.log('Scores', scores);
        displayHandicap();
      }
      
    const getCourses = async () => {
        const response = await fetch('http://localhost:4000/courses');
        const data = await response.json();
        courses = data;
        console.log('Courses', courses);
        renderCourses();
    };
      
    const fetchData = async () => {
      await Promise.all([getScores(), getCourses()]);
      renderCourses();
      displayHandicap();
      renderUserCard();
  };

    fetchData();

    const renderCourses = () => {
        const courseList = document.querySelector('.course-container');
        courseList.innerHTML = '';
        courses.forEach((course, index) => {
            courseList.innerHTML += `
            <div class='course-card bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-sm mx-auto my-4 cursor-pointer hover:shadow-xl' data-index='${index}'>
                <img src='${course.image}' alt='${course.name}' class='w-full h-48 object-cover transition-transform duration-300 ease-in-out transform hover:scale-105'>
                <div class='p-4'>
                    <h1 class='text-2xl font-bold mb-2'>${course.name}</h1>
                    <p class='text-gray-700 mb-2 font-semibold'>${course.location}</p>
                    <p class='text-gray-600 mb-4'>${course.description}</p>
                    <button class='bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-600 font-bold'>View Details</button>
                </div>
            </div>
            `;
        });
        addCourseCardEventListeners();
        closeModalEventListener();
        closeModalAnywhere();
    }

    const searchCourses = () => {
        const searchInput = document.querySelector('.search');
        searchInput.addEventListener('input', () => {
          const searchTerm = searchInput.value.toLowerCase();
          const filteredCourses = courses.filter(course => course.name.toLowerCase().includes(searchTerm));
          renderFilteredCourses(filteredCourses);
        });
    };

    const renderFilteredCourses = (filteredCourses) => {
        const courseContainer = document.querySelector('.course-container');
        courseContainer.innerHTML = '';
        filteredCourses.forEach(course => {
          const index = courses.indexOf(course);
          courseContainer.innerHTML += `
            <div class='course-card bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-sm mx-auto my-4 cursor-pointer hover:shadow-xl' data-index='${index}'>
                <img src='${course.image}' alt='${course.name}' class='w-full h-48 object-cover transition-transform duration-300 ease-in-out transform hover:scale-105'>
                <div class='p-4'>
                    <h1 class='text-2xl font-bold mb-2'>${course.name}</h1>
                    <p class='text-gray-700 mb-2 font-semibold'>${course.location}</p>
                    <p class='text-gray-600 mb-4'>${course.description}</p>
                    <button class='bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-600 font-bold'>View Details</button>
                </div>
            </div>
          `;
        });
        addCourseCardEventListeners();
        closeModalEventListener();
        closeModalAnywhere();
    }

    const renderModal = (event) => {
        modal.classList.remove('hidden');
    
        const courseCard = event.currentTarget;
        const courseIndex = courseCard.getAttribute('data-index');
        const courseData = courses[courseIndex];
    
        const courseTitle = modal.querySelector('.course-title');
        const courseLocation = modal.querySelector('.course-location');
        const courseImage = modal.querySelector('.course-image');
        const courseRating = modal.querySelector('.course-rating');
        const slopeRating = modal.querySelector('.slope-rating');
        const coursePar = modal.querySelector('.course-par');
        const courseLength = modal.querySelector('.course-length');
    
        courseTitle.textContent = courseData.name;
        courseLocation.textContent = courseData.location;
        courseLength.textContent = `Length: ${courseData.length} yards`;
        courseRating.textContent = `Rating: ${courseData.courseRating}`;
        slopeRating.textContent = `Slope: ${courseData.slopeRating}`;
        coursePar.textContent = `Par: ${courseData.par}`;
        courseImage.src = courseData.image; 

    
        const startRoundBtn = modal.querySelector('.start-round');
        if (startRoundBtn) {
          startRoundBtn.addEventListener('click', () => startRound(courseData));
        }
    };

    const addCourseCardEventListeners = () => {
        const courseCards = document.querySelectorAll('.course-card');
        courseCards.forEach(card => {
            card.addEventListener('click', renderModal);
        });
    };

    const closeModal = () => {
        modal.classList.add('hidden');
        modal.innerHTML = originalModalContent; 
        closeModalEventListener();
        addCourseCardEventListeners();
    }
    
      const closeModalAnywhere = () => {
        window.onclick = (e) => {
          if (e.target === modal) {
            closeModal();
          }
        };
      }
    
      const closeModalEventListener = () => {
        const closeBtn = document.querySelector('.close-btn');
        closeBtn.addEventListener('click', closeModal);
      }

      const startRound = (courseData) => {
        holeIndex = 0;
        selectedScores = {};
        const innerContent = document.querySelector('.inner');
        innerContent.innerHTML = ''; 
        innerContent.innerHTML = `
            <div class='flex flex-col items-center p-6 bg-white w-full max-w-lg'>
                <h1 class='text-3xl font-bold mb-6'>Enter The Player Name</h1>
                <div class='w-full'>
                    <label class='block text-lg font-medium text-gray-700 mb-2' for='player-name'>Name</label>
                    <input type='text' id='player-name' placeholder='Name' class='player-name w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500'>
                    <p id="nameError" class="text-red-500 text-sm hidden">Please enter your name.</p>
                </div>
                <div class='w-full'>
                    <label class='block text-lg font-medium text-gray-700 mb-2' for='current-date'>Date</label>
                    <input type='date' id='current-date' class='current-date w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500'>
                    <p id="dateError" class="text-red-500 text-sm hidden">Please enter a date.</p>
                </div>
                <button class='submit-scores bg-green-700 text-white font-bold py-3 px-6 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500'>Submit</button>
            </div>
        `;
        submitEventListener(courseData);
    };

      const getPlayerName = () => {
        const playerName = document.querySelector('.player-name').value;
        return playerName;
      }
    
      const getDate = () => {
        const currentDate = document.querySelector('.current-date').value;
        return currentDate;
      }
    
      const submitForm = (courseData) => {
        const playerName = getPlayerName();
        const currentDate = getDate();
        const nameError = document.getElementById('nameError');
        const dateError = document.getElementById('dateError');

        let valid = true;

        if (playerName.trim() === '') {
            nameError.classList.remove('hidden');
            valid = false;
        } else {
            nameError.classList.add('hidden');
        }

        if (currentDate.trim() === '') {
            dateError.classList.remove('hidden');
            valid = false;
        } else {
            dateError.classList.add('hidden');
        }

        if (!valid) {
            return;
        }
        
        courseData.playerName = playerName; 
        courseData.currentDate = currentDate;
        holeIndex = 0; 
        console.log('Player Name:', playerName);
        console.log('Date:', currentDate);
        console.log(courseData);
        updateModalContent(courseData);
      }

      const submitEventListener = (courseData) => {
        const submitBtn = document.querySelector('.submit-scores');
        if (submitBtn) {
          submitBtn.addEventListener('click', () => submitForm(courseData));
        }
      }

      const prevHole = (courseData) => {
        if (holeIndex > 0) {
            holeIndex--;
        } else {
            holeIndex = courseData.holes.length - 1;
        }
        updateModalContent(courseData);
    };
    
    const nextHole = (courseData) => {
        if (selectedScores[holeIndex] === undefined) {
            totalScore += selectedScores[holeIndex];
        }
    
        if (holeIndex < courseData.holes.length - 1) {
            holeIndex++;
        } else {
            holeIndex = 0;
        }
        updateModalContent(courseData);
    };
    
      const attachNavigationEventListeners = (courseData) => {
        const prevHoleBtn = document.querySelector('.prev-hole');
        const nextHoleBtn = document.querySelector('.next-hole');
    
        if (prevHoleBtn) {
          prevHoleBtn.addEventListener('click', () => prevHole(courseData));
          prevHoleBtn.classList.add('hover:bg-gray-400');
        }
    
        if (nextHoleBtn) {
          nextHoleBtn.addEventListener('click', () => nextHole(courseData));
          nextHoleBtn.classList.add('hover:bg-gray-400');
        }
      };

      const updateModalContent = (courseData) => {
        const hole = courseData.holes[holeIndex];
        const innerContent = document.querySelector('.inner');
        innerContent.innerHTML = ''; 
        innerContent.innerHTML = `
            <div class='flex items-center justify-between w-full p-4 relative'>
                <button class='${holeIndex === 0 ? 'hidden' : ''} prev-hole bg-gray-300 p-2 rounded-full hover:bg-gray-400 absolute left-0 top-1/2 transform -translate-y-1/2'>
                    <i class="fas fa-arrow-left text-xl"></i>
                </button>
                <div class='flex flex-col items-center w-full hole-details'>
                    <div class='flex flex-col items-center mb-4'>
                        <h1 class='text-3xl font-bold mb-2'>Hole ${hole.number}</h1>
                        <p class='text-lg hole-par'>Par ${hole.par}</p>
                        <p class='text-lg'>Distance ${hole.length} yards</p>
                        <p class='you-got-message hidden'>You got a ${youGot(selectedScores[holeIndex], hole.par)}</p>
                    </div>
                    <img src='${hole.image}' alt='${courseData.name}' class='w-full h-48 object-cover rounded-lg mb-4'>
                    <div class='flex flex-row mt-3'>
                        ${renderPars(holeIndex, hole.par)}
                    </div>
                    <button class='finish-round ${holeIndex === 17 ? '' : 'hidden'} bg-green-700 border-none px-4 py-2 rounded-md text-white font-bold w-96 m-auto text-center hover:bg-green-600 mt-4'>Finish Round</button>
                </div>
                <button class='${holeIndex === 17 ? 'hidden' : ''} next-hole bg-gray-300 p-2 rounded-full hover:bg-gray-400 absolute right-0 top-1/2 transform -translate-y-1/2'>
                    <i class="fas fa-arrow-right text-xl"></i>
                </button>
            </div>
        `;
        attachNavigationEventListeners(courseData); 
        attachScoreEventListeners();
        getTotalScore();
        finishRoundEventListener(courseData);
    };

    const renderPars = (holeIndex, par) => {
        let html = '';
        for (let i = 1; i <= 8; i++) {
            html += `
                <input 
                    class='btn mx-1 border border-black rounded-md py-2 px-3 hover:bg-gray-200 cursor-pointer' 
                    value=${i} 
                    type='button' 
                    data-hole-index='${holeIndex}' 
                    data-score='${i}'
                    data-par='${par}'
                />`;
        }
        return html;
    };

      const youGot = (score, par) => {
        const scoreDifference = score - par;
        switch(scoreDifference) {
            case -3:
                return 'Albatross! 🦅';
            case -2:
                return 'Eagle! 🦅';
            case -1:
                return 'Birdie! 🐦';
            case 0:
                return 'Par! ⛳️';
            case 1:
                return 'Bogey! 😬';
            case 2:
                return 'Double Bogey! 😬';
            case 3:
                return 'Triple Bogey! 😬';
            case 4:
                return 'Quadruple Bogey! 😬';
            default:
                if (score === 1) {
                    return 'Hole in one! 🎉';
                }
                return '';
        }
    };

    const attachScoreEventListeners = () => {
        const scoreButtons = document.querySelectorAll('.btn');
        const youGotMessage = document.querySelector('.you-got-message');
        scoreButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const holeIndex = event.target.getAttribute('data-hole-index');
                const score = event.target.getAttribute('data-score');
                const par = event.target.getAttribute('data-par'); 
                youGotMessage.classList.remove('hidden');
                selectScore(holeIndex, score, par, event.target);

            });
        });
    
        document.addEventListener('keydown', (event) => {
            const key = event.key;
            if (key >= '1' && key <= '8') {
                const score = key;
                const activeButton = document.querySelector('.btn[data-score="' + score + '"]');
                if (activeButton) {
                    const holeIndex = activeButton.getAttribute('data-hole-index');
                    const par = activeButton.getAttribute('data-par'); 
                    youGotMessage.classList.remove('hidden');
                    selectScore(holeIndex, score, par, activeButton);
                }
            }
        });
    };
    
    const selectScore = (holeIndex, score, par, element) => {
        selectedScores[holeIndex] = score;
        document.querySelectorAll('.btn').forEach(btn => {
            btn.classList.remove('bg-blue-200');
        });
        element.classList.add('bg-blue-200');
    
        const youGotMessage = document.querySelector('.you-got-message');
        if (youGotMessage) {
            youGotMessage.textContent = `You got a ${youGot(score, par)}`;
        }
    };

      const getTotalScore = () => {
        let total = 0;
        for (let key in selectedScores) {
          total += parseInt(selectedScores[key]);
        }
        return total;
      }

      const finishRound = (courseData) => {
        if (Object.keys(selectedScores).length !== 18) {
            showErrorModal();
            return;
        }
    
        const playerName = courseData.playerName;
        const currentDate = courseData.currentDate;
        const roundScores = { ...selectedScores };
        const totalScore = getTotalScore();
    
        Object.keys(roundScores).forEach(holeIndex => {
            roundScores[holeIndex] = parseInt(roundScores[holeIndex], 10);
        });
    
        const newRound = {
            id: roundIdCounter++,
            round: scores.length + 1,
            playerName,
            date: currentDate,
            roundScores,
            totalScore,
            courseId: courseData.id 
        };
    
        fetch('http://localhost:4000/scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRound)
        })
        .then(response => response.json())
        .then(data => {
            console.log('New round added:', data);
            scores.push(data);
            displayNewRound(); 
            displayHandicap();
        })
        .catch(error => {
            console.error('Error adding new round:', error);
        });
    
        const innerContent = document.querySelector('.inner');
        innerContent.innerHTML = ''; 
        innerContent.innerHTML = `
            <div class='flex flex-col items-center p-6 bg-white rounded-lg shadow-md'>
                <h1 class='text-3xl font-bold mb-4'>Round Summary</h1>
                <p class='text-xl mb-2'>Your total score is <span class='font-bold'>${totalScore}</span><span>${totalScoreEmoji(totalScore)}</span></p>
                <div class='w-full mb-4'>
                    <h2 class='text-2xl font-semibold mb-2'>Hole Scores</h2>
                    <ul class='list-disc list-inside'>
                        ${Object.keys(selectedScores).map(holeIndex => `
                            <li class='text-lg'>Hole ${parseInt(holeIndex) + 1}: ${selectedScores[holeIndex]}</li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
    };

    const showErrorModal = () => {
        const errorModal = document.createElement('div');
        errorModal.id = 'error-modal';
        errorModal.classList.add('fixed', 'z-50', 'inset-0', 'flex', 'items-center', 'justify-center', 'bg-black', 'bg-opacity-50');
        errorModal.innerHTML = `
            <div class='modal-content bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-4'>
                <div class='inner w-full flex flex-col gap-4 justify-center m-auto'>
                    <h1 class='text-2xl font-bold text-center text-gray-800 mb-2'>Error</h1>
                    <p class='text-center text-gray-600 font-medium mb-4'>You haven't finished all of the holes. Please complete all 18 holes before finishing your round.</p>
                    <button class='close-error-modal bg-green-700 border-none px-4 py-2 rounded-md text-white font-bold w-full text-center hover:bg-green-600 transition duration-300 ease-in-out'>Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(errorModal);
    
        document.querySelectorAll('.close-error-modal').forEach(button => {
            button.addEventListener('click', closeErrorModal);
        });
    };
    
    const closeErrorModal = () => {
        const errorModal = document.getElementById('error-modal');
        if (errorModal) {
            document.body.removeChild(errorModal);
        }
    };

    const totalScoreEmoji = (totalScore) => {
      if (totalScore < 72) {
        return '🔥';
      } else if (totalScore === 72 || totalScore <= 85) {
        return '👌';
      } else {
        return '💩';
      }
    }

      const finishRoundEventListener = (courseData) => {
        const finishRoundBtn = document.querySelector('.finish-round');
        finishRoundBtn.addEventListener('click', () => finishRound(courseData));
      }

      const displayRounds = () => {
        const roundsContainer = document.querySelector('.rounds');
        const tabs = scores.map((round, index) => `
            <button class='tab-button px-4 py-2 rounded-t-lg ${index === 0 ? 'bg-green-700 text-white' : 'bg-gray-200'}' data-index='${index}'>Round ${index + 1}</button>
        `).join('');
    
        const roundDetails = scores.map((round, index) => `
            <div id='round-details-${index}' class='round-details ${index === 0 ? '' : 'hidden'} p-4 bg-white rounded-lg shadow-md relative max-w-xl mx-auto'>
                <span class='text-red-500 text-xl cursor-pointer hover:text-red-700 delete-round absolute top-4 right-4' data-index='${index}'>
                    <i class="fa fa-trash"></i>
                </span>
                <p class='text-xl mb-2'>Player: <span class='font-bold'>${round.playerName}</span></p>
                <p class='text-xl mb-2'>Date: <span class='font-bold'>${round.date}</span></p>
                <p class='text-xl mb-2'>Total Score: <span class='font-bold total-score'>${round.totalScore}</span></p>
                <h2 class='text-2xl font-semibold mb-2'>Hole Scores</h2>
                <div class='grid grid-cols-3 gap-4'>
                    ${Object.entries(round.roundScores).map(([holeIndex, score]) => `
                        <div class='score-div flex justify-between items-center p-2 bg-gray-100 rounded-md cursor-pointer'>
                            <span class='text-lg font-semibold'>Hole ${parseInt(holeIndex) + 1}</span>
                            <span class='score text-lg' data-round-index='${index}' data-hole-index='${holeIndex}'>${score}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    
        roundsContainer.innerHTML = `
            <div class='tabs-container relative overflow-hidden max-w-xl mx-auto'>
                <div class='tabs flex space-x-2 overflow-x-auto scrollbar-hide'>
                    ${tabs}
                </div>
                <div class='fade-left absolute left-0 top-0 bottom-0 w-8  pointer-events-none'></div>
                <div class='fade-right absolute right-0 top-0 bottom-0 w-8 pointer-events-none'></div>
            </div>
            <div class='tab-content'>
                ${roundDetails}
            </div>
        `;
    
        addEventListenersToTabButtons();
        addEventListenersToScoreSpans();
        deleteRoundEventListener();
        addEventListenersToViewScoresButton(); 
    };
    
    const addEventListenersToTabButtons = () => {
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', ({ target }) => {
                const index = parseInt(target.getAttribute('data-index'), 10);
                showRound(index);
            });
        });
    };
    
    const showRound = (index) => {
        document.querySelectorAll('.round-details').forEach((details, i) => {
            details.classList.toggle('hidden', i !== index);
        });
        document.querySelectorAll('.tab-button').forEach((button, i) => {
            button.classList.toggle('bg-green-700', i === index);
            button.classList.toggle('text-white', i === index);
            button.classList.toggle('bg-gray-200', i !== index);
        });
    };
    
    const deleteRound = (index) => {
        scores.splice(index, 1);
        displayRounds();
        renderUserCard(); 
    };
    
    const deleteRoundEventListener = () => {
        document.querySelectorAll('.delete-round').forEach((button, index) => {
            button.addEventListener('click', () => {
                deleteModalConfirmation(index);
            });
        });
    };

    const toggleRounds = (index) => {
        const roundDetails = document.querySelector(`#round-details-${index}`);
        if (roundDetails) {
            roundDetails.classList.toggle('hidden');
        }
    };

    const addEventListenersToViewScoresButton = () => {
        document.querySelectorAll('.view-scores-btn').forEach(button => {
            button.addEventListener('click', ({ target }) => {
                const index = target.getAttribute('data-index');
                toggleRounds(index);
            });
        });
    };
  
    const addEventListenersToScoreSpans = () => {
        document.querySelectorAll('.score-div').forEach(div => {
            div.addEventListener('click', () => {
                const scoreSpan = div.querySelector('span.score');
                const score = scoreSpan.textContent;
                const roundIndex = scoreSpan.dataset.roundIndex;
                const holeIndex = scoreSpan.dataset.holeIndex;
    
                const input = document.createElement('input');
                input.type = 'number';
                input.value = Number(score);
                input.classList.add('score-input', 'w-8', 'text-center');
                input.dataset.roundIndex = roundIndex;
                input.dataset.holeIndex = holeIndex;
                scoreSpan.replaceWith(input);
    
                input.focus();
    
                let save = false;
    
                const saveScore = () => {
                    if (save) return;
                    save = true;
    
                    const newScore = Number(input.value);
                    const newScoreSpan = document.createElement('span');
                    newScoreSpan.textContent = newScore;
                    newScoreSpan.classList.add('score', 'text-lg');
                    newScoreSpan.dataset.roundIndex = roundIndex;
                    newScoreSpan.dataset.holeIndex = holeIndex;
    
                    if (scores[roundIndex] && scores[roundIndex].roundScores) {
                        scores[roundIndex].roundScores[holeIndex] = newScore;
                        updateTotalScore(roundIndex); 
                        saveScoreToServer(roundIndex, holeIndex, newScore); 
                    } else {
                        console.error('Round or hole not found');
                    }
    
                    input.replaceWith(newScoreSpan);
                    addEventListenersToScoreSpans();
                };
    
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        saveScore();
                    }
                });
    
                input.addEventListener('blur', saveScore);
            });
        });
    };
    
    const updateTotalScore = (roundIndex) => {
        const totalScore = Object.values(scores[roundIndex].roundScores).reduce((sum, score) => sum + Number(score), 0);
        scores[roundIndex].totalScore = totalScore;
        const totalScoreElement = document.querySelector(`#round-details-${roundIndex} .total-score`);
        if (totalScoreElement) {
            totalScoreElement.textContent = totalScore;
        } else {
            console.error(`Total score element not found for round ${roundIndex}`);
        }
    };

    const saveScoreToServer = (roundIndex, holeIndex, newScore) => {
        fetch(`http://localhost:4000/scores/${scores[roundIndex].round}`, { 
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                roundIndex,
                holeIndex,
                newScore
            })
        })
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                console.error('Failed to save score to server');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

const displayNewRound = () => {
    const roundsContainer = document.querySelector('.rounds');
    const tabsContainer = roundsContainer.querySelector('.tabs');
    const tabContentContainer = roundsContainer.querySelector('.tab-content');

    const newRoundIndex = scores.length - 1;
    const newRound = scores[newRoundIndex];

    const newTabButton = document.createElement('button');
    newTabButton.className = 'tab-button px-4 py-2 rounded-t-lg bg-gray-200';
    newTabButton.dataset.index = newRoundIndex;
    newTabButton.textContent = `Round ${newRoundIndex + 1}`;
    newTabButton.addEventListener('click', () => showRound(newRoundIndex));

    tabsContainer.appendChild(newTabButton);

    const newRoundDetails = document.createElement('div');
    newRoundDetails.id = `round-details-${newRoundIndex}`;
    newRoundDetails.className = 'round-details hidden p-4 bg-white rounded-lg shadow-md relative max-w-xl';
    newRoundDetails.innerHTML = `
        <span class='text-red-500 text-xl cursor-pointer hover:text-red-700 delete-round absolute top-4 right-4' data-index='${newRoundIndex}'>
            <i class="fa fa-trash"></i>
        </span>
        <p class='text-xl mb-2'>Player: <span class='font-bold'>${newRound.playerName}</span></p>
        <p class='text-xl mb-2'>Date: <span class='font-bold'>${newRound.date}</span></p>
        <p class='text-xl mb-2'>Total Score: <span class='font-bold total-score'>${newRound.totalScore}</span></p>
        <h2 class='text-2xl font-semibold mb-2'>Hole Scores</h2>
        <div class='grid grid-cols-3 gap-4'>
            ${Object.entries(newRound.roundScores).map(([holeIndex, score]) => `
                <div class='score-div flex justify-between items-center p-2 bg-gray-100 rounded-md cursor-pointer'>
                    <span class='text-lg font-semibold'>Hole ${parseInt(holeIndex) + 1}</span>
                    <span class='score text-lg' data-round-index='${newRoundIndex}' data-hole-index='${holeIndex}'>${score}</span>
                </div>
            `).join('')}
        </div>
    `;

    tabContentContainer.appendChild(newRoundDetails);

    addEventListenersToScoreSpans();
    deleteRoundEventListener();
};

const calculateHandicap = () => {
  if (scores.length === 0 || courses.length === 0) {
      return 0;
  }

  const differentials = scores.map(round => {
      const course = courses.find(course => course.id === round.courseId);
      const differential = (round.totalScore - course.courseRating) * 113 / course.slopeRating;
      return differential;
  }).filter(differential => differential !== null);

  if (differentials.length === 0) {
      return 0;
  }

  const averageDifferential = differentials.reduce((sum, differential) => sum + differential, 0) / differentials.length;
  const handicapIndex = averageDifferential * 0.96;
  const course = courses[0];

  const courseHandicap = (handicapIndex * (course.slopeRating / 113)) + (course.courseRating - course.par);
  if (courseHandicap < 0) {
      return `+${Math.abs(courseHandicap).toFixed(1)}`;
  }

  return courseHandicap.toFixed(1);
};

const displayHandicap = () => {
    const handicap = calculateHandicap();
    const handicapContainer = document.querySelector('.handicap');
    handicapContainer.innerHTML = '';
    handicapContainer.innerHTML = `
        <div class='flex flex-col items-center p-6 bg-white rounded-lg shadow-md mb-4 w-full max-w-2xl m-auto'>
            <h1 class='text-3xl font-bold mb-4'>Handicap</h1>
            <p class='text-xl mb-2'>Your handicap is <span class='font-bold'>${handicap}</span></p>
        </div>
    `;
}

const deleteModalConfirmation = (index) => {
    const modal = document.createElement('div');
    modal.classList.add('fixed', 'z-50', 'inset-0', 'flex', 'items-center', 'justify-center', 'bg-black', 'bg-opacity-50');
    modal.innerHTML = `
        <div class='flex flex-col items-center p-6 bg-white rounded-lg shadow-md'>
            <h1 class='text-3xl font-bold mb-4'>Delete Confirmation</h1>
            <p class='text-xl mb-4'>Are you sure you want to delete round ${index + 1}?</p>
            <div class='flex space-x-4'>
                <button class='confirm-delete bg-red-700 text-white font-bold py-3 px-6 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500'>Yes</button>
                <button class='cancel-delete bg-green-700 text-white font-bold py-3 px-6 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500'>No</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const confirmButton = modal.querySelector('.confirm-delete');
    const cancelButton = modal.querySelector('.cancel-delete');

    confirmButton.addEventListener('click', () => {
        deleteRound(index);
        document.body.removeChild(modal);
    });

    cancelButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
};

const renderUserCard = () => {
    const userCardContainer = document.querySelector('.user-card');
    userCardContainer.innerHTML = `
        <div class='flex flex-col items-center justify-center w-full'>
            <img src="../assets/profilePlaceholder.jpg" alt="User" class="user-image rounded-full w-48 h-48 mb-4 cursor-pointer">
            <input type="file" class="hidden image-upload" accept="image/*">
            <h2 class="text-2xl font-bold mb-2">Jace Randolph</h2>
            <div class="stats w-96 mt-4">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-lg font-semibold">Rounds:</span>
                    <span class="text-lg font-bold">${scores.length}</span>
                </div>
                <div class="flex justify-between items-center mb-2">
                    <span class="text-lg font-semibold">Handicap:</span>
                    <span class="text-lg font-bold">${calculateHandicap()}</span>
                </div>
                <div class="flex justify-between items-center mb-2">
                    <span class="text-lg font-semibold">Best Score:</span>
                    <span class="text-lg font-bold">${bestScore()}</span>
                </div>
                <div class="flex justify-between items-center mb-2">
                    <span class="text-lg font-semibold">Favorite Course:</span>
                    <span class="text-lg font-bold">${favoriteCourse()}</span>
                </div>
            </div>
        </div>
        <div class="rounds-container mx-auto p-6 w-full">
            <h1 class='text-3xl font-bold mb-6'>Rounds</h1>
            <div class="rounds flex flex-col w-full gap-4"></div>
        </div>
    `;
    displayRounds();
    updateUserImage();
};

const updateUserImage = () => {
    const userImage = document.querySelector('.user-image');
    const imageUpload = document.querySelector('.image-upload');

    fetch('http://localhost:4000/user-image')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.imagePath) {
                userImage.src = `http://localhost:4000${data.imagePath}`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

    userImage.addEventListener('click', () => {
        imageUpload.click();
    });

    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);

            fetch('http://localhost:4000/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    userImage.src = `http://localhost:4000${data.filePath}`; 
                } else {
                    console.error('Failed to upload image');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    });
};

const bestScore = () => {
    if (scores.length === 0) {
        return 0; 
    }

    const best = scores.reduce((best, round) => {
        return round.totalScore < best ? round.totalScore : best;
    }, scores[0].totalScore);

    return best;
};

const favoriteCourse = () => {
    if (scores.length === 0) {
        return 0;
    }

    const courseIds = scores.map(round => round.courseId);
    const favoriteCourseId = courseIds.sort((a, b) =>
        courseIds.filter(id => id === a).length - courseIds.filter(id => id === b).length
    ).pop();
    const favoriteCourse = courses.find(course => course.id === favoriteCourseId);
    console.log(favoriteCourse)

    return favoriteCourse.name;

};

    searchCourses();
});

