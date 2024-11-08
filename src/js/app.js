let courses = [];
let scores = [];
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

      const updateModalContent = (courseData) => {
        console.log('Course Data:', courseData);
      }

    searchCourses();
});

