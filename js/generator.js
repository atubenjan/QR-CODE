const generatorDiv = document.querySelector(".generator");
const generateBtn = generatorDiv.querySelector(".generator-form button");
const qrInput = generatorDiv.querySelector(".generator-form input");
const qrImg = generatorDiv.querySelector(".generator-img img");
const downloadBtn = generatorDiv.querySelector(".generator-btn .download-btn");
const printBtn = generatorDiv.querySelector(".generator-btn .print-btn");

let imgURL = '';
let imgName = ''; // To store the generated name

generateBtn.addEventListener("click", () => {
    let qrValue = qrInput.value;
    if (!qrValue.trim()) return;

    generateBtn.innerText = "Generating QR Code..."; 

    imgName = generateRandomName(); // Generate a random name starting with "BA"
    imgURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrValue)}`;
    qrImg.src = imgURL;

    qrImg.addEventListener("load", () => {
        generatorDiv.classList.add("active");
        generateBtn.innerText = "Generate QR Code"; 
    });
});

downloadBtn.addEventListener("click", () => {
    if (!imgURL) return;
    fetchImage(imgURL);
});

printBtn.addEventListener("click", () => {
    if (!imgURL) return;
    printImage();
});

function fetchImage(url) {
    fetch(url).then(res => res.blob()).then(file => {
        let tempFile = URL.createObjectURL(file);
        let extension = file.type.split("/")[1];
        download(tempFile, imgName, extension); // Use generated name with "BA" prefix
    }).catch(() => {
        console.error("Failed to fetch image.");
        imgURL = '';
    });
}

function download(tempFile, fileName, extension) {
    let a = document.createElement('a');
    a.href = tempFile;
    a.download = `${fileName}.${extension}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
}

function printImage() {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Print QR Code</title>
            </head>
            <body>
                <img src="${imgURL}" alt="QR Code" onload="window.print(); window.close();">
            </body>
        </html>
    `);
    printWindow.document.close();
}

function generateRandomName() {
    const prefix = "BA"; // Prefix to start the name
    const timestamp = Date.now().toString(); // Current timestamp
    const randomChars = Math.random().toString(36).substring(2, 8); // Random string
    return `${prefix}_${timestamp}_${randomChars}`; // Example output: BA_1618327203132_k3j7l9
}
