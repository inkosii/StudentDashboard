const majorsCourses = {
    Arts: {
        "English Literature": ["Lit101", "Lit102", "Lit201"],
        "History": ["Hist101", "Hist102"],
    },
    Sciences: {
        "Biology": ["Bio101", "Bio102", "Bio201"],
        "Chemistry": ["Chem101", "Chem102"],
    },
    Commerce: {
        "Accounting": ["Acc101", "Acc102"],
        "Business Management": ["BM101", "BM102"],
    }
};

function updateMajors() {
    const faculty = document.getElementById('faculty').value;
    const majors = Object.keys(majorsCourses[faculty] || {});
    const majorsSelect = document.getElementById('majors');

    majorsSelect.innerHTML = `<option value="" disabled selected>Select a major</option>`;
    majors.forEach(major => {
        majorsSelect.innerHTML += `<option value="${major}">${major}</option>`;
    });
}

function showCourses() {
    const faculty = document.getElementById('faculty').value;
    const major = document.getElementById('majors').value;
    const coursesSelect = document.getElementById('courses');
    
    if (major) {
        const courses = majorsCourses[faculty][major] || [];
        coursesSelect.style.display = "block";
        coursesSelect.innerHTML = `<option value="" disabled selected>Select a course</option>`;
        courses.forEach(course => {
            coursesSelect.innerHTML += `<option value="${course}">${course}</option>`;
        });
        document.getElementById('see-courses').style.display = "block";
    }
}

function generateTimetablePDF() {
    const course = document.getElementById('courses').value;
    if (!course) {
        alert("Please select a course first.");
        return;
    }

    // Create PDF logic here using jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.text(`Timetable for ${course}`, 10, 10);
    // Additional logic to add timetable details...
    
    doc.save('timetable.pdf');
    

}
