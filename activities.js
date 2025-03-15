// Today's date
const today = new Date();
const currentDay = today.getDay(); // Get the current day (0-6)

// Schedule for classes, tutorials, practicals, tests, and quizzes
const schedule = {
    classes: [
        { name: "Advanced Classical Mechanics", day: 1, start: "08:30", end: "09:20" },
        { name: "Final Year Project", day: 1, start: "11:30", end: "12:20" },
        { name: "Numerical Methods", day: 2, start: "07:30", end: "08:20" },
        { name: "Distributed Systems", day: 2, start: "08:30", end: "09:20" },
        { name: "Advanced Classical Mechanics", day: 3, start: "07:30", end: "08:20" },
        { name: "Numerical Methods", day: 3, start: "11:30", end: "14:20" },
        { name: "Final Year Project", day: 3, start: "14:30", end: "17:20" },
        { name: "Distributed Systems", day: 4, start: "07:30", end: "08:20" },
        { name: "Advanced Classical Mechanics", day: 4, start: "11:30", end: "14:20" },
        { name: "Numerical Methods", day: 5, start: "08:20", end: "09:20" },
        { name: "Distributed Systems", day: 5, start: "09:30", end: "10:20" },
        { name: "Final Year Project", day: 5, start: "11:30", end: "12:20" }
    ],
    practicals: [
        { name: "Advanced Classical Mechanics Practical", day: 3, start: "14:30", end: "17:20" }
    ]
};

// University and Course events data
const universityEvents = [
    { name: "Science Expo", date: "2024-11-28", time: "10:00 AM", venue: "King Bhekuzulu hall" },
    { name: "Annual Sports Day", date: "2024-11-20", time: "8:00 AM", venue: "Ellis Park" },
    { name: "SRC elections", date: "2024-11-25", time: "11:00 AM", venue: "Writing center" }
];

const courseEvents = [
    { name: "Postgraduate NRF Funding Opportunity", date: "2024-11-02", time: "2:00 PM", venue: "Multimedia Lab" },
    { name: "Computer Science Workshop", date: "2024-11-05", time: "1:00 PM", venue: "HP Lab1" },
    { name: "Final Year Research Symposium", date: "2024-11-08", time: "10:00 AM", venue: "B Lab1" }
];

// Function to display today's activities and send notifications
function displayTodayActivities(sectionId, data) {
    const list = document.getElementById(sectionId);
    list.innerHTML = '';  // Clear previous content

    data.forEach(item => {
        if (item.day === currentDay) {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.name} from ${item.start} to ${item.end}`;
            list.appendChild(listItem);
            notifyUser(item);
        }
    });
}

// Function to notify user 30 minutes before class
function notifyUser(item) {
    const startTime = new Date();
    const [hour, minute] = item.start.split(':');
    startTime.setHours(hour, minute - 30); // Set to 30 mins before class

    const currentTime = new Date();
    if (currentTime.getHours() === startTime.getHours() && currentTime.getMinutes() === startTime.getMinutes()) {
        alert(`Reminder: Your class "${item.name}" starts in 30 minutes at ${item.start}.`);
    }
}

// Function to display university events
function displayEvents(sectionId, events) {
    const list = document.getElementById(sectionId);
    list.innerHTML = '';  // Clear previous content

    events.forEach(event => {
        const listItem = document.createElement('li');
        listItem.textContent = `${event.name} on ${event.date} at ${event.time}, Venue: ${event.venue}`;
        list.appendChild(listItem);
    });
}

// Initial call to display today's activities, university events, and course events
displayTodayActivities('class-list', schedule.classes); // Show today's classes
displayEvents('university-events-list', universityEvents); // Show university events
displayEvents('course-events-list', courseEvents); // Show course events

// Function to download the timetable as a PDF
function downloadTimetablePDF() {
    const { jsPDF } = window.jspdf;

    // Create a new PDF document
    const pdf = new jsPDF();
    
    // Add a title
    pdf.setFontSize(16);
    pdf.text("Timetable", 20, 20);
    
    // Set column headers
    pdf.setFontSize(12);
    pdf.text("Day", 20, 30);
    pdf.text("Module", 60, 30);
    pdf.text("Start Time", 120, 30);
    pdf.text("End Time", 160, 30);
    
    let currentY = 40;

    // Group modules by day
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const groupedClasses = {};

    // Organize classes by day
    schedule.classes.forEach(item => {
        if (!groupedClasses[item.day]) {
            groupedClasses[item.day] = [];
        }
        groupedClasses[item.day].push(item);
    });

    // Populate the PDF with the timetable data
    for (let i = 1; i <= 5; i++) { // Days of the week to display (1 to 5)
        if (groupedClasses[i]) {
            pdf.text(days[i], 20, currentY);
            currentY += 10; // Move down for the next row

            groupedClasses[i].forEach(event => {
                pdf.text(event.name, 60, currentY);
                pdf.text(event.start, 120, currentY);
                pdf.text(event.end, 160, currentY);
                currentY += 10; // Move down for the next row
            });

            currentY += 10; // Additional space between days
        }
    }

    // Add Practical/Tutorials to the PDF
    pdf.text("Practical/Tutorials", 20, currentY);
    currentY += 10;
    schedule.practicals.forEach(practical => {
        pdf.text(`${practical.name} on ${days[practical.day]} from ${practical.start} to ${practical.end}`, 20, currentY);
        currentY += 10;
    });

    // Save the PDF
    pdf.save('timetable.pdf');
}
