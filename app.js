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


// -----------------------------
// ATTENDANCE STORAGE
// -----------------------------

let attendanceList =
    JSON.parse(localStorage.getItem("attendanceList")) || [];


// -----------------------------
// COUNTER NAME
// Temporary value for testing.
// We will make this configurable later.
// -----------------------------

const counterName = "Staff A";


// -----------------------------
// ENTER SCANNER PAGE
// -----------------------------

enterButton.addEventListener("click", function () {

    mainPage.style.display = "none";
    scannerPage.style.display = "block";

    statusDisplay.textContent = "Ready to Scan";
    geidDisplay.textContent = "--";

});


// -----------------------------
// BACK TO MAIN PAGE
// -----------------------------

backButton.addEventListener("click", async function () {

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


// -----------------------------
// START BARCODE SCANNER
// -----------------------------

scanButton.addEventListener("click", async function () {

    statusDisplay.textContent = "Opening Camera...";
    geidDisplay.textContent = "--";

    try {

        if (!html5QrCode) {
            html5QrCode = new Html5Qrcode("reader");
        }

        await html5QrCode.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: {
                    width: 280,
                    height: 120
                }
            },

            // Successful barcode scan
            async function (decodedText) {

                const scannedGEID = decodedText.trim();

                geidDisplay.textContent = scannedGEID;


                // -----------------------------
                // STOP CAMERA
                // -----------------------------

                if (scannerRunning) {

                    try {
                        await html5QrCode.stop();
                    } catch (error) {
                        console.log(error);
                    }

                    scannerRunning = false;
                }


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
            },

            // Ignore unsuccessful camera frames
            function () {
                // Keep scanning
            }
        );


        scannerRunning = true;

        statusDisplay.textContent = "Scanning...";


    } catch (error) {

        console.log(error);

        statusDisplay.textContent =
            "Unable to open camera";

        scannerRunning = false;
    }

});