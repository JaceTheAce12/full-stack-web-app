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
        displayRounds();
    };
      
    const fetchData = async () => {
      await Promise.all([getScores(), getCourses()]);
      renderCourses();
      displayRounds();
      displayHandicap();
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
    
        courseTitle.textContent = courseData.name;
        courseLocation.textContent = courseData.location;
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
                </div>
                <div class='w-full'>
                    <label class='block text-lg font-medium text-gray-700 mb-2' for='current-date'>Date</label>
                    <input type='date' id='current-date' class='current-date w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500'>
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
            <div class='flex flex-col items-center w-full'>
                <div class='flex flex-col items-center mb-4'>
                    <h1 class='text-3xl font-bold mb-2'>Hole ${hole.number}</h1>
                    <p class='text-lg'>Par ${hole.par}</p>
                    <p class='text-lg'>Distance ${hole.length} yards</p>
                </div>
                <img src='${hole.image}' alt='${courseData.name}' class='w-full h-48 object-cover rounded-lg mb-4'>
                <div class='flex flex-row mt-3'>
                    ${renderPars(holeIndex)}
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

      const renderPars = (holeIndex) => {
        let html = ''
        for (let i = 1; i <= 8; i++) {
           html += `
              <input 
                class='btn mx-1 border border-black rounded-md py-2 px-3 hover:bg-gray-200 cursor-pointer' 
                value=${i} 
                type='button' 
                data-hole-index='${holeIndex}' 
                data-score='${i}'
                />`
        }
        return html;
      }

      const attachScoreEventListeners = () => {
        const scoreButtons = document.querySelectorAll('.btn');
        scoreButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const holeIndex = event.target.getAttribute('data-hole-index');
                const score = event.target.getAttribute('data-score');
                selectScore(holeIndex, score, event.target);
            });
        });
    
        document.addEventListener('keydown', (event) => {
            const key = event.key;
            if (key >= '1' && key <= '8') {
                const score = key;
                const activeButton = document.querySelector('.btn[data-score="' + score + '"]');
                if (activeButton) {
                    const holeIndex = activeButton.getAttribute('data-hole-index');
                    selectScore(holeIndex, score, activeButton);
                }
            }
        });
    };
    
    const selectScore = (holeIndex, score, element) => {
        selectedScores[holeIndex] = score;
        document.querySelectorAll('.btn').forEach(btn => {
            btn.classList.remove('bg-blue-200');
        });
        element.classList.add('bg-blue-200');
    };

      const getTotalScore = () => {
        let total = 0;
        for (let key in selectedScores) {
          total += parseInt(selectedScores[key]);
        }
        return total;
      }

      const finishRound = (courseData) => {
        const playerName = courseData.playerName;
        const currentDate = courseData.currentDate;
        const roundScores = { ...selectedScores };
        const totalScore = getTotalScore();
    
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
                <button class='bg-green-700 border-none px-4 py-2 rounded-md text-white font-bold w-48 text-center hover:bg-green-600 mt-4' onclick='closeModal()'>Close</button>
            </div>
        `;
    };

    const totalScoreEmoji = (totalScore) => {
      if (totalScore < 72) {
        return '🔥';
      } else if (totalScore === 72) {
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
        roundsContainer.innerHTML = scores.map((round, index) => `
            <div class='flex flex-col items-center p-6 bg-white rounded-lg shadow-md mb-4 w-full max-w-3xl m-auto'>
                <div class='flex justify-between w-full'>
                    <h1 class='text-3xl font-bold mb-4'>Round ${index + 1}</h1>
                    <span class='text-red-500 text-xl cursor-pointer hover:text-red-700 delete-round' data-index='${index}'>
                        <i class="fa fa-trash"></i>
                    </span>
                </div>
                <div class='w-full'>
                    <p class='text-xl mb-2'>Player: <span class='font-bold'>${round.playerName}</span></p>
                    <p class='text-xl mb-2'>Date: <span class='font-bold'>${round.date}</span></p>
                    <p class='text-xl mb-2'>Total Score: <span class='font-bold'>${round.totalScore}</span></p>
                </div>
                <div class='w-full mb-4'>
                    <div>
                        <button class='bg-green-700 border-none px-4 py-2 rounded-md text-white font-bold w-48 text-center hover:bg-green-600 mt-4 view-scores-btn' data-index='${index}'>View Scores</button>
                    </div>
                    <div id='round-details-${index}' class='round-details hidden mt-4'>
                        <h2 class='text-2xl font-semibold mb-2'>Hole Scores</h2>
                        <div class='grid grid-cols-2 gap-4'>
                            ${Object.entries(round.roundScores).map(([holeIndex, score]) => `
                                <div class='score-div flex justify-between items-center p-2 bg-gray-100 rounded-md cursor-pointer'>
                                    <span class='text-lg font-semibold'>Hole ${parseInt(holeIndex) + 1}</span>
                                    <span class='score text-lg' data-round-index='${index}' data-hole-index='${holeIndex}'>${score}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    
        addEventListenersToViewScoresButtons();
        addEventListenersToScoreSpans();
        deleteRoundEventListener();
    };
    
    const deleteRound = (index) => {
        scores.splice(index, 1);
        displayRounds();
        displayHandicap();
    };
    
    const deleteRoundEventListener = () => {
        document.querySelectorAll('.delete-round').forEach(button => {
            button.addEventListener('click', ({ target }) => {
                const index = parseInt(target.getAttribute('data-index'), 10); 
                deleteModalConfirmation(index); 
            });
        });
    };

    const toggleRounds = (index) => {
      const roundDetails = document.querySelector(`#round-details-${index}`);
      if (roundDetails) {
          roundDetails.classList.toggle('hidden');
      }
      console.log('clicked')
    };

    const addEventListenersToViewScoresButtons = () => {
      document.querySelectorAll('.view-scores-btn').forEach(button => {
          button.addEventListener('click', ({ target }) => {
              const index = target.getAttribute('data-index');
              toggleRounds(index);
          });
      });
  };
  
  const addEventListenersToScoreSpans = () => {
    document.querySelectorAll('.score-div span.score').forEach(span => {
        span.addEventListener('click', ({ target }) => {
            const scoreSpan = target;
            const score = scoreSpan.textContent;
            const roundIndex = scoreSpan.dataset.roundIndex;
            const holeIndex = scoreSpan.dataset.holeIndex;

            const input = document.createElement('input');
            input.type = 'text';
            input.value = score;
            input.classList.add('score-input');
            input.dataset.roundIndex = roundIndex;
            input.dataset.holeIndex = holeIndex;
            scoreSpan.replaceWith(input);

            let save = false;

            const saveScore = () => {
                if (save) return;
                save = true;

                const newScore = input.value;
                const newScoreSpan = document.createElement('span');
                newScoreSpan.textContent = newScore;
                newScoreSpan.classList.add('score', 'text-lg');
                newScoreSpan.dataset.roundIndex = roundIndex;
                newScoreSpan.dataset.holeIndex = holeIndex;

                if (scores[roundIndex] && scores[roundIndex].roundScores) {
                    scores[roundIndex].roundScores[holeIndex] = newScore;
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

const displayNewRound = () => {
  const roundsContainer = document.querySelector('.rounds');
  const round = scores[scores.length - 1];
  const index = scores.length - 1;

  if (!round.roundScores) {
      round.roundScores = {};
  }

  roundsContainer.innerHTML += `
      <div class='flex flex-col items-center p-6 bg-white rounded-lg shadow-md mb-4 w-full max-w-3xl m-auto'>
            <div class='flex justify-between w-full'>
                <h1 class='text-3xl font-bold mb-4'>Round ${index + 1}</h1>
                <span class='text-red-500 text-xl cursor-pointer hover:text-red-700 delete-round' data-index='${index}'>
                    <i class="fa fa-trash"></i>
                </span>
            </div>
            <div class='w-full'>
                <p class='text-xl mb-2'>Player: <span class='font-bold'>${round.playerName}</span></p>
                <p class='text-xl mb-2'>Date: <span class='font-bold'>${round.date}</span></p>
                <p class='text-xl mb-2'>Total Score: <span class='font-bold'>${round.totalScore}</span></p>
            </div>
            <div class='w-full mb-4'>
                <div>
                    <button class='bg-green-700 border-none px-4 py-2 rounded-md text-white font-bold w-48 text-center hover:bg-green-600 mt-4 view-scores-btn' data-index='${index}'>View Scores</button>
                </div>
                <div id='round-details-${index}' class='round-details hidden mt-4'>
                    <h2 class='text-2xl font-semibold mb-2'>Hole Scores</h2>
                    <div class='grid grid-cols-2 gap-4'>
                        ${Object.entries(round.roundScores).map(([holeIndex, score]) => `
                            <div class='score-div flex justify-between items-center p-2 bg-gray-100 rounded-md cursor-pointer'>
                                <span class='text-lg font-semibold'>Hole ${parseInt(holeIndex) + 1}</span>
                                <span class='score text-lg' data-round-index='${index}' data-hole-index='${holeIndex}'>${score}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
  `;

  addEventListenersToViewScoresButtons();
  addEventListenersToScoreSpans();
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
            <p class='text-xl mb-4'>Are you sure you want to delete this round?</p>
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
    searchCourses();
});

