// -----------------------------
// PAGE ELEMENTS
// -----------------------------

const counterNameInput =
    document.getElementById("counterName");

const totalAttendance =
    document.getElementById("totalAttendance");

const adminAttendanceRecords =
    document.getElementById("adminAttendanceRecords");


// -----------------------------
// LOAD ATTENDANCE
// -----------------------------

let attendanceList =
    JSON.parse(localStorage.getItem("attendanceList")) || [];


// -----------------------------
// DISPLAY TOTAL ATTENDANCE
// -----------------------------

totalAttendance.textContent = attendanceList.length;


// -----------------------------
// DISPLAY ATTENDANCE RECORDS
// -----------------------------

function displayAttendanceRecords() {

    adminAttendanceRecords.innerHTML = "";

    if (attendanceList.length === 0) {

        adminAttendanceRecords.textContent =
            "No attendance records";

        return;
    }


    attendanceList.forEach(function (record) {

        const recordBox = document.createElement("div");

        const checkInDate =
            new Date(record.checkInTime);

        recordBox.innerHTML =
            "<strong>GEID: " + record.geid + "</strong><br>" +
            "Check-in: " +
            checkInDate.toLocaleString() +
            "<br>" +
            "Counter: " +
            record.counter +
            "<br><br>";

        adminAttendanceRecords.appendChild(recordBox);

    });

}


displayAttendanceRecords();