const generatorDiv = document.querySelector(".generator");
const generateBtn = generatorDiv.querySelector(".generator-form button");
const qrInput = generatorDiv.querySelector(".generator-form input");
const qrImg = generatorDiv.querySelector(".generator-img img");
const downloadBtn = generatorDiv.querySelector(".generator-btn .download-btn"); // Updated selector for Download button
const printBtn = generatorDiv.querySelector(".generator-btn .print-btn"); // Selector for Print button

let imgURL = '';

generateBtn.addEventListener("click", () => {
    let qrValue = qrInput.value;
    if (!qrValue.trim()) return;

    generateBtn.innerText = "Generating QR Code..."; 

    imgURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrValue}`;
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
    
});

function fetchImage(url) {
    fetch(url).then(res => res.blob()).then(file => {
        console.log(file);
        let tempFile = URL.createObjectURL(file);
        let fileName = url.split("/").pop().split(".")[0];
        let extension = file.type.split("/")[1];
        download(tempFile, fileName, extension);
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


qrInput.addEventListener("input",()=>{
    if(!qrInput.value.trim())
    return generatorDiv.classlist.remove("active");
})