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


// -----------------------------
// BARCODE SCANNER
// -----------------------------

let html5QrCode = null;
let scannerRunning = false;

// The camera can see barcodes continuously,
// but a barcode is only accepted after
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

    statusDisplay.textContent = "Opening Camera...";
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

        statusDisplay.textContent = "Ready to Scan";

    } catch (error) {

        console.log(error);

        statusDisplay.textContent =
            "Unable to open camera";

        scannerRunning = false;
    }

}


// -----------------------------
// SCAN BUTTON
// -----------------------------

scanButton.addEventListener("click", function () {

    if (!scannerRunning) {

        statusDisplay.textContent =
            "Camera is not ready";

        return;
    }

    geidDisplay.textContent = "--";

    statusDisplay.textContent =
        "Scanning...";

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

        statusDisplay.textContent =
            "Already Scanned";

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


    statusDisplay.textContent =
        "Attendance Recorded";

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