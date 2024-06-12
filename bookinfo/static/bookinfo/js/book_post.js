// code for the multilevel form

const form = document.getElementById("multi-step-form");
const progressBar = document.getElementById("progress-bar");
const steps = [...document.querySelectorAll(".step")];
const nextButtons = [...document.querySelectorAll(".next-button")];
const prevButtons = [...document.querySelectorAll(".prev-button")];

const lastStepIndex = steps.length - 1;
let currentStep = 0;

function updateProgressBar() {
  const percent = (currentStep / lastStepIndex) * 100;
  progressBar.style.width = percent + "%";
}

function showStep(step) {
  steps.forEach((step, index) => {
    step.style.display = index === currentStep ? "block" : "none";
  });
  updateProgressBar();
}

function updateNextButtonAvailability() {
  if (currentStep === 0) {
    const title = document.getElementById("id_title");
    const description = document.getElementById("id_description");
    const category = document.getElementById("id_category");

    if (
      title.value.trim() !== "" &&
      description.value.trim() !== "" &&
      category.value !== ""
    ) {
      nextButtons[0].removeAttribute("disabled");
    } else {
      nextButtons[0].setAttribute("disabled", "disabled");
    }
  } else if (currentStep === 1) {
    const originalPrice = document.getElementById("id_original_price");
    const sellingPrice = document.getElementById("id_selling_price");
    const image = document.getElementById("id_image");

    if (
      originalPrice.value.trim() !== "" &&
      sellingPrice.value.trim() !== "" &&
      image.value !== ""
    ) {
      nextButtons[1].removeAttribute("disabled");
    } else {
      nextButtons[1].setAttribute("disabled", "disabled");
    }
  }
}

nextButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    if (currentStep < lastStepIndex) {
      currentStep++;
      showStep(currentStep);
    }
  });
});

prevButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
    }
  });
});

form.addEventListener("change", updateNextButtonAvailability);
updateNextButtonAvailability();
showStep(currentStep);



document.addEventListener("DOMContentLoaded", function () {
    var imageInput = document.getElementById("id_image"); // Replace with your image field ID
    var imagePreview = document.getElementById("image-preview");
  
    imageInput.addEventListener("change", function () {
      var file = imageInput.files[0];
      if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
          imagePreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  });
  