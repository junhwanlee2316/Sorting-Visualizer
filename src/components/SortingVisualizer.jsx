import React from "react";
import { useState, useEffect } from "react";
import {
  getMergeSortAnimations,
  getBubbleSortAnimations,
  getInsertionSortAnimations,
} from "../algorithms/SortingAlgorithms";
import "./SortingVisualizer.css";

const NUM_ARRAY_BARS = 100;
const ANIMATION_SPEED_MS = 5;
const ANIMATION_SPEED_BS = 1.5; // Adjust the animation speed as needed
const ANIMATION_SPEED_IS = 4.5;
// This is the main color of the array bars.
const PRIMARY_COLOR = "#8dc6ff";

// This is the color of array bars that are being compared throughout the animations.
const SECONDARY_COLOR = "#f70776";

const MAIN_COLOR = "#347474";

function SortingVisualizer() {
  const [array, setArray] = useState([]);
  const [sortingInProgress, setSortingInProgress] = useState(false);
  const [isSorted, setIsSorted] = useState(false);

  useEffect(() => {
    // Generate the initial array when the component mounts
    const randomArray = [];
    for (let i = 0; i < NUM_ARRAY_BARS; i++) {
      randomArray.push(randomIntFromInterval(10, 700));
    }
    setArray(randomArray);
  }, []); // Empty dependency array to ensure this effect runs only once

  function resetArray() {
    const randomArray = [];
    for (let i = 0; i < NUM_ARRAY_BARS; i++) {
      randomArray.push(randomIntFromInterval(10, 700));
    }
    setArray(randomArray);
    setIsSorted(false);
  }

  function mergeSortAnimation() {
    setSortingInProgress(true); // Set sorting in progress
    const arrayCopy = array.slice(); // Create a copy of the current state array
    const animations = getMergeSortAnimations(arrayCopy);
    const arrayBars = document.getElementsByClassName("array-bar");

    for (let i = 0; i < animations.length; i++) {
      const [barOneIdx, barTwoIdx] = animations[i];

      if (i % 3 !== 2) {
        // Change color animation
        const color = i % 3 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
        setTimeout(() => {
          if (arrayBars[barOneIdx] && arrayBars[barTwoIdx]) {
            const barOneStyle = arrayBars[barOneIdx].style;
            const barTwoStyle = arrayBars[barTwoIdx].style;
            barOneStyle.backgroundColor = color;
            barTwoStyle.backgroundColor = color;
          }
        }, i * ANIMATION_SPEED_MS);
      } else {
        // Height change animation
        setTimeout(() => {
          if (arrayBars[barOneIdx]) {
            const barStyle = arrayBars[barOneIdx].style;
            const [barIdx, newHeight] = animations[i];
            barStyle.height = `${newHeight}px`;
            if (i === animations.length - 1) {
              setArray(arrayCopy);
              setSortingInProgress(false); // Set sorting as completed
              for (let j = 0; j < arrayBars.length; j++) {
                const barStyle = arrayBars[j].style;
                barStyle.backgroundColor = MAIN_COLOR;
              }

              setIsSorted(true); // Set isSorted to true
            }
          }
          // Set the background color of all array bars to black
        }, i * ANIMATION_SPEED_MS);
      }
    }
  }

  function bubbleSortAnimation() {
    setSortingInProgress(true); // Set sorting in progress
    const arrayCopy = array.slice(); // Create a copy of the current state array
    const animations = getBubbleSortAnimations(arrayCopy); // Use the copy for animation

    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName("array-bar");
      const [barOneIdx, barTwoIdx, animationType] = animations[i];

      const barOneStyle = arrayBars[barOneIdx].style;
      const barTwoStyle = arrayBars[barTwoIdx].style;

      if (animationType === "compare") {
        // Change color of bars being compared.
        setTimeout(() => {
          barOneStyle.backgroundColor = SECONDARY_COLOR;
          barTwoStyle.backgroundColor = SECONDARY_COLOR;
        }, i * ANIMATION_SPEED_BS);
      } else if (animationType === "swap") {
        // Swap the heights of bars.
        setTimeout(() => {
          const tempHeight = barOneStyle.height;
          barOneStyle.height = barTwoStyle.height;
          barTwoStyle.height = tempHeight;
        }, i * ANIMATION_SPEED_BS);
      }

      // Revert color to default after comparison and/or swap.
      setTimeout(() => {
        barOneStyle.backgroundColor = PRIMARY_COLOR;
        barTwoStyle.backgroundColor = PRIMARY_COLOR;
        if (i === animations.length - 1) {
          // Animation is complete, set the final sorted array state
          setArray(arrayCopy);
          setSortingInProgress(false); // Set sorting as completed
          for (let j = 0; j < arrayBars.length; j++) {
            const barStyle = arrayBars[j].style;
            barStyle.backgroundColor = MAIN_COLOR;
          }

          setIsSorted(true); // Set isSorted to true
        }
      }, (i + 1) * ANIMATION_SPEED_BS);
    }
  }

  function insertionSortAnimation() {
    setSortingInProgress(true); // Set sorting in progress
    const arrayCopy = array.slice(); // Create a copy of the current state array
    const animations = getInsertionSortAnimations(arrayCopy); // Use the copy for animation
    const arrayBars = document.getElementsByClassName("array-bar");
    const totalAnimations = animations.length;

    for (let i = 0; i < totalAnimations; i++) {
      const [barOneIdx, barTwoIdx, isComparison] = animations[i];
      const barOneStyle = arrayBars[barOneIdx].style;
      const barTwoStyle = arrayBars[barTwoIdx].style;

      setTimeout(() => {
        if (isComparison) {
          // Change color of bars being compared.
          barOneStyle.backgroundColor = SECONDARY_COLOR;
          barTwoStyle.backgroundColor = SECONDARY_COLOR;
        } else {
          // Swap the heights of bars.
          const tempHeight = barOneStyle.height;
          barOneStyle.height = barTwoStyle.height;
          barTwoStyle.height = tempHeight;

          // Revert color to default after comparison and/or swap.
          barOneStyle.backgroundColor = PRIMARY_COLOR;
          barTwoStyle.backgroundColor = PRIMARY_COLOR;

          if (i === totalAnimations - 1) {
            // Animation is complete, set the final sorted array state
            setArray(arrayCopy);
            setSortingInProgress(false); // Set sorting as completed

            // Set the background color of all bars to SECONDARY_COLOR
            for (let j = 0; j < arrayBars.length; j++) {
              const barStyle = arrayBars[j].style;
              barStyle.backgroundColor = MAIN_COLOR;
            }

            setIsSorted(true); // Set isSorted to true
          }
        }
      }, i * ANIMATION_SPEED_IS);
    }
  }

  return (
    <div className="container">
      <div className="main-content">
        <div className="menu-container">
          <button onClick={resetArray} disabled={sortingInProgress}>
            Generate New Array
          </button>
          <button
            onClick={mergeSortAnimation}
            disabled={sortingInProgress || isSorted}
          >
            Merge Sort
          </button>
          <button
            onClick={bubbleSortAnimation}
            disabled={sortingInProgress || isSorted}
          >
            Bubble Sort
          </button>
          <button
            onClick={insertionSortAnimation}
            disabled={sortingInProgress || isSorted}
          >
            Insertion Sort
          </button>
        </div>
        <div className="array-container">
          {array.map((value, idx) => (
            <div
              className="array-bar"
              key={idx}
              style={{
                backgroundColor: MAIN_COLOR,
                height: `${value}px`,
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// From https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default SortingVisualizer;
