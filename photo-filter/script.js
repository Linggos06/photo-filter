const filters = document.querySelector(".filters");
const image = document.querySelector("img");
const resetBtn = document.querySelector(".btn-reset");
const nextBtn = document.querySelector(".btn-next");
const inputBtn = document.querySelector(".btn-load--input");
const saveBtn = document.querySelector(".btn-save");
const fullScreen = document.querySelector(".fullscreen");
const link = "https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/";
const images = ["01.jpg", "02.jpg", "03.jpg", "05.jpg", "06.jpg", "07.jpg", "08.jpg", "09.jpg", "10.jpg", "11.jpg", "12.jpg", "13.jpg", "14.jpg", "15.jpg", "16.jpg", "17.jpg", "18.jpg", "19.jpg", "20.jpg"];
let i = 0;

filters.addEventListener("input", handleInput);
resetBtn.addEventListener("click", handleReset);
nextBtn.addEventListener("click", getNextImage);
inputBtn.addEventListener("change", uploadImage);
saveBtn.addEventListener("click", handleSave);
fullScreen.addEventListener('click', handleFullScreen);


function handleInput(event) {
  if (event.target.matches("input[type='range']")) {
    const suffix = event.target.dataset.sizing;
    const output = event.target.nextElementSibling;
    image.style.setProperty(`--${event.target.name}`, event.target.value + suffix);
    output.textContent = event.target.value;
  };
}

function handleReset() {
  const inputs = filters.querySelectorAll("input");
  inputs.forEach(input => {
    if (input.name === "saturate") {
      input.value = input.defaultValue;
      input.nextElementSibling.textContent = 100;

    } else {
      input.value = input.defaultValue;
      input.nextElementSibling.textContent = 0;
    };

  });
  image.removeAttribute("style");
}


function handleSave() {
  const canvas = document.createElement("canvas");
  const dpi = window.devicePixelRatio;
  const img = new Image();
  img.setAttribute('crossOrigin', 'anonymous');
  img.src = image.src;

  img.onload = function () {

    canvas.setAttribute("height", img.height);
    canvas.setAttribute("width", img.width);
    const height = +getComputedStyle(image).getPropertyValue("height").slice(0, -2) * dpi;


    const imgContext = canvas.getContext("2d");
    const blur = (+getComputedStyle(image).getPropertyValue("--blur").slice(0, -2)) * (img.height / height);
    const invert = (+getComputedStyle(image).getPropertyValue("--invert").slice(0, -1));
    const sepia = (+getComputedStyle(image).getPropertyValue("--sepia").slice(0, -1));
    const saturate = (+getComputedStyle(image).getPropertyValue("--saturate").slice(0, -1));
    const hue = (+getComputedStyle(image).getPropertyValue("--hue").slice(0, -3));

    imgContext.filter = `blur(${blur}px) invert(${invert}%) sepia(${sepia}%) saturate(${saturate}%) hue-rotate(${hue}deg)`;

    imgContext.drawImage(img, 0, 0, canvas.width, canvas.height);
    const link = document.createElement('a');
    link.download = 'download.png';
    link.href = canvas.toDataURL();
    link.click();
    link.delete;
  };
}

function uploadImage(event) {

  const file = event.target.files[0];
  const reader = new FileReader();
  reader.addEventListener("load", function () {
    image.src = reader.result;
  }, false);
  if (file) {
    reader.readAsDataURL(file);
  }
  event.target.value = null;
}


function getNextImage() {
  const time = getDate();
  const index = i % images.length;
  const src = link + time + "/" + images[index];
  const img = new Image();
  img.src = src;
  img.onload = () => {
    image.src = src;
  };
  i++;
}


function getDate() {
  const date = new Date();
  const hour = date.getHours();
  let currentTime = '';

  if (hour >= 6 && hour < 12) {
    currentTime = "morning";
  } else if (hour >= 12 && hour < 18) {
    currentTime = "day";
  } else if (hour >= 18 && hour < 24) {
    currentTime = "evening";
  } else if (hour >= 0 && hour < 6) {
    currentTime = "night";
  }

  return currentTime;
}


function handleFullScreen(event) {

  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();

    }
  }
}
