//import "core-js/stable";
//import "regenerator-runtime/runtime";
import "./styles/index.css";
import stepsSrc from "./images/steps.png";

const numbers = [2, 3, 5];
const doubledNumbers = numbers.map((number) => number * 2);

console.log("Doubled Numbers:", doubledNumbers);

document.addEventListener("DOMContentLoaded", () => {
  const stepsImage = document.getElementById("image-steps");
  if (stepsImage) {
    stepsImage.src = stepsSrc;
  }
});
