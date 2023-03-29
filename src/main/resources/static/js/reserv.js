let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

function buildCalendar() {
  let firstDay = new Date(currentYear, currentMonth, 1);
  let lastDay = new Date(currentYear, currentMonth + 1, 0);
  let calendarTitle = document.getElementById("calendarTitle");
  let calendarBody = document.getElementById("calendarBody");
  let twoWeeksFromToday = new Date();
  twoWeeksFromToday.setDate(twoWeeksFromToday.getDate() + 14);

  calendarTitle.innerHTML = currentYear + "년 " + (currentMonth + 1) + "월";

  while (calendarBody.firstChild) {
    calendarBody.removeChild(calendarBody.firstChild);
  }

  let date = 1;
  for (let i = 0; i < 6; i++) {
    let row = document.createElement("tr");
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay.getDay()) {
        let cell = document.createElement("td");
        let cellText = document.createTextNode("");
        cell.appendChild(cellText);
        row.appendChild(cell);
      } else if (date > lastDay.getDate()) {
        break;
      } else {
        let cell = document.createElement("td");
        let cellText = document.createTextNode(date);
        if (
          date === today.getDate() &&
          currentMonth === today.getMonth() &&
          currentYear === today.getFullYear()
        ) {
          cell.classList.add("current-day");
        }
        if (
          date > today.getDate() &&
          date <= twoWeeksFromToday &&
          currentMonth === today.getMonth() &&
          currentYear === today.getFullYear()
        ) {
          cell.classList.add("two-weeks");
        }
        cell.addEventListener("click", showTimetable); // 클릭 이벤트 추가
        cell.appendChild(cellText);
        row.appendChild(cell);
        date++;
      }
    }
    calendarBody.appendChild(row);
  }
}

function prevCalendar() {
  currentYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  buildCalendar();
}

function nextCalendar() {
  currentYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  currentMonth = (currentMonth + 1) % 12;
  let twoWeeksFromToday = new Date();
  twoWeeksFromToday.setDate(twoWeeksFromToday.getDate() + 14);
  buildCalendar();
}
let selectedYear, selectedMonth;

function showTimetable(event) {
  let selectedDate = event.target.textContent;
  let selectedYear = currentYear;
  let selectedMonth = currentMonth + 1;
  console.log(
    `Selected Date: ${selectedYear}-${selectedMonth}-${selectedDate}`
  );
  let yearDiv = document.createElement("div");
  let monthDiv = document.createElement("div");
  yearDiv.innerHTML =
    "Selected date: " + selectedYear + "-" + selectedMonth + "-" + selectedDate;
  document.querySelector(".timetable").appendChild(yearDiv);
  document.querySelector(".timetable").style.display = "block";
}

buildCalendar();

let calendarBody = document.getElementById("calendarBody");
let timetable = document.querySelector(".timetable");

calendarBody.addEventListener("click", function (event) {
  if (event.target.tagName === "TD") {
    timetable.style.display = "block";
  }
});
