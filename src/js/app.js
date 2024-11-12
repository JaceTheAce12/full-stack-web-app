let courses = [];
let scores = [];
let holeIndex = 0;
let totalScore = 0;
let selectedScores = {};
const startRoundBtn = document.querySelector('.start-round');
const modal = document.querySelector('.modal');
const originalModalContent = modal.innerHTML;

document.addEventListener('DOMContentLoaded', () => {
    const getScores = async () => {
        const response = await fetch('http://localhost:4000/scores');
        const data = await response.json();
        scores = data;
        console.log('Scores', scores);
      }
      
      getScores();
      
    const getCourses = async () => {
        const response = await fetch('http://localhost:4000/courses');
        const data = await response.json();
        courses = data;
        console.log('Courses', courses);
        renderCourses();
        displayRounds();
    };
      
    getCourses();

    const renderCourses = () => {
        const courseList = document.querySelector('.course-container');
        courseList.innerHTML = '';
        courses.forEach((course, index) => {
            courseList.innerHTML += `
            <div class='course-card shadow-md rounded-lg max-w-2xl py-6 px-10 cursor-pointer hover:shadow-lg' data-index='${index}'>
                <img src='/assets/golfCourse.jpg' alt='${course.name}' class='w-full h-48 object-cover rounded-lg'>
                <h1 class='text-2xl w-96 font-bold'>${course.name}</h1>
                <p>${course.location}</p>
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
            <div class='course-card shadow-md rounded-lg max-w-2xl py-6 px-10 cursor-pointer hover:shadow-lg' data-index='${index}'>
              <img src='/assets/golfCourse.jpg' alt='${course.name}' class='w-full h-48 object-cover rounded-lg'>
              <h1 class='text-2xl w-96 font-bold'>${course.name}</h1>
              <p>${course.location}</p>
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
        courseImage.src = '../assets/golfCourse.jpg'; 
    
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
          <div class='flex flex-col items-center p-6 bg-white rounded-lg shadow-md'>
            <h1 class='text-3xl font-bold mb-6'>Enter Your Scores</h1>
            <div class='w-full max-w-md'>
              <label class='block text-lg font-medium text-gray-700 mb-2' for='player-name'>Name</label>
              <input type='text' id='player-name' placeholder='Name' class='player-name w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500'>
            </div>
            <div class='w-full max-w-md'>
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
          <div class='flex items-center justify-between w-full p-4'>
            <button class='${holeIndex === 0 ? 'hidden' : ''} prev-hole bg-gray-300 p-2 rounded-full hover:bg-gray-400'>&larr;</button>
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
            <button class='${holeIndex === 17 ? 'hidden' : ''} next-hole bg-gray-300 p-2 rounded-full hover:bg-gray-400'>&rarr;</button>
          </div>
        `;
        attachNavigationEventListeners(courseData); 
        attachScoreEventListeners();
        getTotalScore();
        finishRoundEventListener(courseData);
      
        console.log(selectedScores);
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
      };

      const selectScore = (holeIndex, score, element) => {
        selectedScores[holeIndex] = score;
        document.querySelectorAll('.btn').forEach(btn => {
          btn.classList.remove('bg-blue-200');
        });
        element.classList.add('bg-blue-200');
      }

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
        const roundScores = {
          round: scores.length + 1,
          playerName,
          date: currentDate,
          scores: { ...selectedScores },
          totalScore: getTotalScore()
        };
        scores.push(roundScores);
    
        const innerContent = document.querySelector('.inner');
        innerContent.innerHTML = ''; 
        innerContent.innerHTML = `
          <div class='flex flex-col items-center p-6 bg-white rounded-lg shadow-md'>
            <h1 class='text-3xl font-bold mb-4'>Round Summary</h1>
            <p class='text-xl mb-2'>Your total score is <span class='font-bold'>${getTotalScore()}</span></p>
            <div class='w-full mb-4'>
              <h2 class='text-2xl font-semibold mb-2'>Hole Scores</h2>
              <ul class='list-disc list-inside'>
                ${Object.keys(selectedScores).map(holeIndex => `
                  <li class='text-lg'>Hole ${parseInt(holeIndex) + 1}: ${selectedScores[holeIndex]}</li>
                `).join('')}
              </ul>
            </div>
            <button class='bg-green-700 border-none px-4 py-2 rounded-md text-white font-bold w-48 text-center hover:bg-green-600 mt-4' onclick='${closeModal}'>Close</button>
          </div>
        `;
      };

      const finishRoundEventListener = (courseData) => {
        const finishRoundBtn = document.querySelector('.finish-round');
        finishRoundBtn.addEventListener('click', () => finishRound(courseData));
      }

      const displayRounds = () => {
        const roundsContainer = document.querySelector('.rounds');
        roundsContainer.innerHTML = ''; 
      
        scores.forEach((round, index) => {
          roundsContainer.innerHTML += `
            <div class='flex flex-col items-center p-6 bg-white rounded-lg shadow-md mb-4 w-full'>
              <h1 class='text-3xl font-bold mb-4'>Round ${index + 1}</h1>
              <div class='w-full'>
                <p class='text-xl mb-2'>Player: <span class='font-bold'>${round.playerName}</span></p>
                <p class='text-xl mb-2'>Date: <span class='font-bold'>${round.date}</span></p>
                <p class='text-xl mb-2'>Total Score: <span class='font-bold'>${round.totalScore}</span></p>
              </div>
              <div class='w-full mb-4'>
                <h2 class='text-2xl font-semibold mb-2'>Hole Scores</h2>
                <div class='grid grid-cols-2 gap-4'>
                  ${Object.entries(round.scores).map(([holeIndex, score]) => `
                    <div class='flex justify-between items-center p-2 bg-gray-100 rounded-md cursor-pointer'>
                      <span class='text-lg font-semibold'>Hole ${parseInt(holeIndex) + 1}</span>
                      <span class='text-lg'>${score}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          `;
        });
      };

    searchCourses();
});

