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
// ENTER SCANNER PAGE
// -----------------------------

enterButton.addEventListener("click", function () {

    mainPage.style.display = "none";
    scannerPage.style.display = "block";

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

                geidDisplay.textContent = decodedText;
                statusDisplay.textContent = "Barcode Captured";

                if (scannerRunning) {

                    try {
                        await html5QrCode.stop();
                    } catch (error) {
                        console.log(error);
                    }

                    scannerRunning = false;
                }
            },

            // Ignore unsuccessful frames
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