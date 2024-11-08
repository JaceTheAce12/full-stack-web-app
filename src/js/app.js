let courses = [];
let scores = [];
const startRoundBtn = document.querySelector('.start-round');
const modal = document.querySelector('.modal');

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

    searchCourses();
});

