const scannerDiv = document.querySelector(".scanner");
const camera = scannerDiv.querySelector("h1 .fa-camera");
const stopCam = scannerDiv.querySelector("h1 .fa-circle-stop");
const form = scannerDiv.querySelector(".scanner-form");
const fileInput = form.querySelector("input");
const p = form.querySelector("p");
const img = form.querySelector("img");
const video = form.querySelector("video");
const content = form.querySelector(".content");
const textarea = scannerDiv.querySelector(".scanner-details textarea");
const copyBtn = scannerDiv.querySelector(".scanner-details .copy");
const closeBtn = document.querySelector(".scanner-details .close");


form.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", e => {
    let file = e.target.files[0];
    if (!file) return;
    fetchRequest(file);
});

function fetchRequest(file) {
    let formData = new FormData();
    formData.append("file", file);
    if (p) p.innerText = "Scanning QR Code...";

    fetch('http://api.qrserver.com/v1/read-qr-code/', {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(result => {
        // Check if result is valid and has expected structure
        if (result && result[0] && result[0].symbol && result[0].symbol[0] && result[0].symbol[0].data) {
            let text = result[0].symbol[0].data;
            if (!text) {
                if (p) p.innerText = "Couldn't Scan QR Code";
                return;
            }

            scannerDiv.classList.add("active");
            form.classList.add("active-img");

            if (img) img.src = URL.createObjectURL(file);
            if (textarea) textarea.innerText = text;
        } else {
            if (p) p.innerText = "Unexpected response format";
        }
    })
    .catch(error => {
        console.error("Error scanning QR code:", error);
        if (p) p.innerText = "Error occurred while scanning QR Code";
    });
} 

let scanner;

camera.addEventListener("click",()=>{
    
    camera.style.diaplay = "none";
    form.classList.add("")
    p.innerText = "Scanning QR Code...";
    
    scanner = new Instascan.Scanner({video: video});
    Instascan.Camera.getCamera()
    .then(cameras => {
        if(cameras.length > 0){
            scanner.start(camera[0]).them(() =>{
                form.classList.add("active-video");
                stopCam.style.display = "inline-block";
            })
        }else{
            console.log("No Cameras Found");
        }
    })
    .catch(err => console.error(err))
    
    scanner.addListener("scan", c =>{
      scannerDiv.classList.add("active");
        textarea.innertext = c;
    })
})

// Copy scanned text to clipboard
copyBtn.addEventListener("click", () => {
    let text = textarea ? textarea.textContent : "";
    navigator.clipboard.writeText(text);
});

// Close the scanner and reset UI
closeBtn.addEventListener("click", () => stopScan());

stopCam.addEventListener("click",() => stopScan())

function stopScan(){
    p.innerText = "Upload QR Code to Scan";
    camera.style.diaplay = "inline-block";
    stopCam.style.display = "none";
    
    form.classList.remove("active-video","active-img" ,"pointerEvents");
    scannerDiv.classList.remove("active");
    
    if(scanner)scanner.stop();
}
