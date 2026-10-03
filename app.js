// -----------------------------
// PAGE ELEMENTS
// -----------------------------

const mainPage = document.getElementById("mainPage");
const scannerPage = document.getElementById("scannerPage");

const enterButton = document.getElementById("enterButton");
const backButton = document.getElementById("backButton");
const scanButton = document.getElementById("scanButton");

const statusDisplay = document.getElementById("statusDisplay");
const geidDisplay = document.getElementById("geidDisplay");

const statusBox = statusDisplay.closest(".displayBox");


// -----------------------------
// STATUS DISPLAY
// -----------------------------

function setStatus(message, statusClass) {

    statusDisplay.textContent = message;

    statusBox.classList.remove(
        "status-ready",
        "status-scanning",
        "status-recorded",
        "status-duplicate",
        "status-error"
    );

    statusBox.classList.add(statusClass);
}


// -----------------------------
// BARCODE SCANNER
// -----------------------------

let html5QrCode = null;
let scannerRunning = false;

// Camera stays open continuously.
// Barcode is only accepted after
// SCAN BARCODE is pressed.
let waitingForBarcode = false;


// -----------------------------
// ATTENDANCE STORAGE
// -----------------------------

let attendanceList =
    JSON.parse(localStorage.getItem("attendanceList")) || [];


// -----------------------------
// STAFF NAME
// Temporary value for testing.
// -----------------------------

const counterName = "Staff A";


// -----------------------------
// ENTER SCANNER PAGE
// -----------------------------

enterButton.addEventListener("click", async function () {

    mainPage.style.display = "none";
    scannerPage.style.display = "block";

    setStatus("Opening Camera...", "status-scanning");

    geidDisplay.textContent = "--";

    await startCamera();

});


// -----------------------------
// START CAMERA
// -----------------------------

async function startCamera() {

    if (scannerRunning) {
        return;
    }

    try {

        if (!html5QrCode) {
            html5QrCode = new Html5Qrcode("reader");
        }

        await html5QrCode.start(
            { facingMode: "environment" },
            {
                fps: 10,

                qrbox: {
                    width: 320,
                    height: 180
                }
            },

            // Barcode detected by camera
            function (decodedText) {

                // Ignore barcode until operator
                // presses SCAN BARCODE.
                if (!waitingForBarcode) {
                    return;
                }

                waitingForBarcode = false;

                processBarcode(decodedText);
            },

            // Ignore unsuccessful camera frames
            function () {
                // Keep camera running
            }
        );

        scannerRunning = true;

        setStatus(
            "Ready to Scan",
            "status-ready"
        );

    } catch (error) {

        console.log(error);

        setStatus(
            "Unable to open camera",
            "status-error"
        );

        scannerRunning = false;
    }

}


// -----------------------------
// SCAN BUTTON
// -----------------------------

scanButton.addEventListener("click", function () {

    if (!scannerRunning) {

        setStatus(
            "Camera is not ready",
            "status-error"
        );

        return;
    }

    geidDisplay.textContent = "--";

    setStatus(
        "Scanning...",
        "status-scanning"
    );

    waitingForBarcode = true;

});


// -----------------------------
// PROCESS BARCODE
// -----------------------------

function processBarcode(decodedText) {

    const scannedGEID = decodedText.trim();

    geidDisplay.textContent = scannedGEID;


    // -----------------------------
    // CHECK FOR DUPLICATE
    // -----------------------------

    const alreadyScanned =
        attendanceList.some(function (record) {
            return record.geid === scannedGEID;
        });


    if (alreadyScanned) {

        setStatus(
            "Already Scanned",
            "status-duplicate"
        );

        return;
    }


    // -----------------------------
    // SAVE ATTENDANCE
    // -----------------------------

    const now = new Date();

    const attendanceRecord = {
        geid: scannedGEID,
        checkInTime: now.toISOString(),
        counter: counterName
    };


    attendanceList.push(attendanceRecord);


    localStorage.setItem(
        "attendanceList",
        JSON.stringify(attendanceList)
    );


    setStatus(
        "Attendance Recorded",
        "status-recorded"
    );

}


// -----------------------------
// BACK TO MAIN PAGE
// -----------------------------

backButton.addEventListener("click", async function () {

    waitingForBarcode = false;

    if (scannerRunning && html5QrCode) {

        try {
            await html5QrCode.stop();
        } catch (error) {
            console.log(error);
        }

        scannerRunning = false;
    }

    scannerPage.style.display = "none";
    mainPage.style.display = "flex";

});