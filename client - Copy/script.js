// ------------------ LOGIN FUNCTION ------------------
function loginUser(event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const validUsers = [
    { username: "admin", password: "admin123" },
    { username: "teacher", password: "teach123" }
  ];

  const isValid = validUsers.some(
    user => user.username === username && user.password === password
  );

  if (isValid) {
    alert("Login successful!");
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid username or password.");
  }
}

// ------------------ TIMETABLE VARIABLES ------------------
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = [
  "9:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 1:00 PM",
  "1:00 PM - 2:00 PM",
  "2:00 PM - 3:00 PM",
  "3:00 PM - 4:00 PM",
  "4:00 PM - 5:00 PM"
];

const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "English",
  "Computer Science",
  "Biology",
  "History",
  "Geography",
  "Economics",
  "Free Period"
];

// ------------------ ON PAGE LOAD: BUILD FORM ------------------
window.onload = () => {
  const form = document.getElementById("timetable-form");
  if (!form) return;

  days.forEach(day => {
    const dayBlock = document.createElement("div");
    dayBlock.classList.add("day-form-block");

    const title = document.createElement("h4");
    title.textContent = day;
    dayBlock.appendChild(title);

    timeSlots.forEach((slot, i) => {
      const row = document.createElement("div");
      row.classList.add("form-row");

      const label = document.createElement("label");
      label.textContent = slot;
      label.setAttribute("for", `${day}-${i}`);

      const select = document.createElement("select");
      select.name = `${day}-${i}`;
      select.id = `${day}-${i}`;

      subjects.forEach(subject => {
        const option = document.createElement("option");
        option.value = subject;
        option.textContent = subject;
        select.appendChild(option);
      });

      row.appendChild(label);
      row.appendChild(select);
      dayBlock.appendChild(row);
    });

    form.appendChild(dayBlock);
  });
};

// ------------------ GENERATE TIMETABLE OUTPUT ------------------
function generateUserTimetable() {
  const output = document.getElementById("timetable-output");
  const downloadBtn = document.getElementById("download-pdf-btn");
  if (!output) return;

  output.innerHTML = "<h3>Your Timetable:</h3>";

  const timetableContainer = document.createElement("div");
  timetableContainer.classList.add("timetable-container");

  days.forEach(day => {
    const dayColumn = document.createElement("div");
    dayColumn.classList.add("day-column");

    const dayHeader = document.createElement("h4");
    dayHeader.innerText = day;
    dayColumn.appendChild(dayHeader);

    timeSlots.forEach((slot, i) => {
      const select = document.querySelector(`select[name="${day}-${i}"]`);
      const subject = select ? select.value : "N/A";

      const block = document.createElement("div");
      block.classList.add("time-block");
      block.innerHTML = `
        <div class="time-label">${slot}</div>
        <div class="subject-label">${subject}</div>
      `;
      dayColumn.appendChild(block);
    });

    timetableContainer.appendChild(dayColumn);
  });

  output.appendChild(timetableContainer);

  const actions = document.createElement("div");
  actions.innerHTML = `
    <button onclick="approve()" class="btn">Approve</button>
    <button onclick="suggestAlt()" class="btn">Suggest Rearrangement</button>
  `;
  output.appendChild(actions);

  if (downloadBtn) downloadBtn.style.display = "inline-block";
}

// ------------------ BUTTON ACTIONS ------------------
function approve() {
  alert("✅ Timetable approved!");
}

function suggestAlt() {
  alert("💡 Suggestion: Spread difficult subjects evenly and avoid back-to-back heavy subjects.");
}

// ------------------ DOWNLOAD PDF ------------------
async function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("landscape");
  const timetableElement = document.getElementById("timetable-output");

  const canvas = await html2canvas(timetableElement, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
  pdf.save("timetable.pdf");
}
