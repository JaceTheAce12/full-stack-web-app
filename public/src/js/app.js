let courses = [];
let scores = [];

document.addEventListener('DOMContentLoaded', () => {

    const getScores = async () => {
        const response = await fetch('/api/scores');
        const data = await response.json();
        scores = data;
        console.log('Scores', scores);
    }
    getScores();

    const getCourses = async () => {
        const response = await fetch('/api/course');
        const data = await response.json();
        courses = data;
        console.log('Courses', courses);
        renderCourses();
    }
    getCourses();

    const renderCourses = () => {
        const courseList = document.querySelector('.course-container');
        courseList.innerHTML = '';
        courses.forEach((course, index) => {
            courseList.innerHTML += `
            <div class='course-card shadow-md rounded-lg max-w-2xl py-6 px-10 cursor-pointer hover:shadow-lg' data-index='${index}'>
                <img src='${course.image}' alt='${course.name}' class='w-full h-48 object-cover rounded-lg'>
                <h1 class='text-2xl w-96 font-bold'>${course.name}</h1>
                <p>${course.location}</p>
            </div>
            `;
        });
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
              <img src='../assets/golfCourse.jpg' alt='${course.name}' class='w-full h-48 object-cover rounded-lg'>
              <h1 class='text-2xl w-96 font-bold'>${course.name}</h1>
              <p>${course.location}</p>
            </div>
          `;
        });
    }

    searchCourses();
});

