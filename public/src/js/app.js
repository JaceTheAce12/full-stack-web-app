let courses = [];
let scores = [];

const getScores = async () => {
    const response = await fetch('/api/scores');
    const data = await response.json();
    scores = data;
    console.log('Scores', scores);
}

getScores();

document.addEventListener('DOMContentLoaded', () => {
    const getCourses = async () => {
        const response = await fetch('/api/course');
        const data = await response.json();
        courses = data;
        console.log('Courses', courses);
        renderCourses();
    }
    getCourses();
});

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

