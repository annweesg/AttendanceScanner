// -----------------------------
// PAGE ELEMENTS
// -----------------------------

const counterNameInput =
    document.getElementById("counterName");

const totalAttendance =
    document.getElementById("totalAttendance");

const adminAttendanceRecords =
    document.getElementById("adminAttendanceRecords");

const exportButton =
    document.getElementById("exportButton");

const clearButton =
    document.getElementById("clearButton");


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
            "Staff: " +
            record.counter +
            "<br><br>";

        adminAttendanceRecords.appendChild(recordBox);

    });

}


displayAttendanceRecords();


// -----------------------------
// EXPORT ATTENDANCE
// -----------------------------

exportButton.addEventListener("click", function () {

    // Temporary test message
   


    if (attendanceList.length === 0) {

        alert("There are no attendance records to export.");

        return;
    }


    let csvContent =
        "GEID,Check-in Date,Check-in Time,Staff\n";


    attendanceList.forEach(function (record) {

        const checkInDate =
            new Date(record.checkInTime);


        const date =
            String(checkInDate.getDate()).padStart(2, "0") + "/" +
            String(checkInDate.getMonth() + 1).padStart(2, "0") + "/" +
            checkInDate.getFullYear();


        const time =
            String(checkInDate.getHours()).padStart(2, "0") + ":" +
            String(checkInDate.getMinutes()).padStart(2, "0") + ":" +
            String(checkInDate.getSeconds()).padStart(2, "0");


        csvContent +=
            '"' + record.geid + '",' +
            '"' + date + '",' +
            '"' + time + '",' +
            '"' + record.counter + '"' +
            "\n";

    });


    const blob = new Blob(
        [csvContent],
        { type: "text/csv;charset=utf-8;" }
    );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;


    const now = new Date();

    const fileDate =
        now.getFullYear() + "-" +
        String(now.getMonth() + 1).padStart(2, "0") + "-" +
        String(now.getDate()).padStart(2, "0");


    link.download =
        "Attendance_" +
        counterNameInput.value.trim().replace(/\s+/g, "_") +
        "_" +
        fileDate +
        ".csv";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

});