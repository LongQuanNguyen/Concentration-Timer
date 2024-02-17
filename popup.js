/**
 * This script sets up the user interface for a timer extension.
 * It allows the user to start a timer with a specified number of minutes,
 * displays the remaining time, and sends a message to the background script to start the timer.
 */

document.addEventListener('DOMContentLoaded', function () {
    // Get references to the start button, the minutes input, and the time remaining div
    let startButton = document.getElementById('start');
    let minutesInput = document.getElementById('minutes');
    let timeRemainingDiv = document.getElementById('timeRemaining');
    let intervalId;

    /**
     * When the start button is clicked, it checks if the user input is a non-negative number.
     * If it is, it sends a message to the background script to start a timer with the specified number of minutes.
     */
    startButton.onclick = function() {
        let minutes = parseFloat(minutesInput.value);
        if (isNaN(minutes) || minutes < 0) {
            return; 
        } else {
            chrome.runtime.sendMessage({minutes: minutes});
        }
    };

    /**
     * This function updates the remaining time displayed in the time remaining div.
     * It gets the remaining time from local storage, calculates the number of minutes and seconds,
     * and updates the inner HTML of the time remaining div.
     */
    function updateRemainingTime() {
        chrome.storage.local.get(['timeRemaining'], function(result) {
            if (result.timeRemaining) {
                let minutes = Math.floor(result.timeRemaining);
                let seconds = Math.floor((result.timeRemaining - minutes) * 60);
                timeRemainingDiv.innerHTML = 'Time remaining: <br>' + minutes + 'm ' + seconds + 's';
            }
        });
    }

    // Start an interval that updates the remaining time every second
    intervalId = setInterval(updateRemainingTime, 1000);
    updateRemainingTime();

    // Clears the interval (stops updating the remaining time) when the popup window is closed
    window.onunload = function() {
        if (intervalId) {
            clearInterval(intervalId);
        }
    };
});