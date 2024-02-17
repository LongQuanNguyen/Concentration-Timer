/**
 * This script sets up a timer that goes off after a certain number of minutes specified by the user.
 * The remaining time is updated every second and stored in local storage.
 * When the timer goes off, a notification is displayed and the remaining time is reset.
 */

// Define the name of the alarm and an interval ID
let alarmName = 'timer';
let intervalId;

/**
 * Listens for messages from the popup script.
 * If the message contains a "minutes" property, it clears any existing alarm with the same name,
 * creates a new alarm that will go off after the specified number of minutes,
 * and starts a new interval that updates the remaining time every second.
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.minutes) {
        chrome.alarms.clear(alarmName, function() {
            chrome.alarms.create(alarmName, {delayInMinutes: request.minutes});
            chrome.storage.local.set({timeRemaining: request.minutes});
            if (intervalId) {
                clearInterval(intervalId);
            }
            intervalId = setInterval(function() {
                chrome.storage.local.get(['timeRemaining'], function(result) {
                    if (result.timeRemaining) {
                        let timeRemaining = result.timeRemaining - 1/60;
                        chrome.storage.local.set({timeRemaining: timeRemaining});
                    }
                });
            }, 1000);
        });
    }
});

/**
 * Listens for alarms.
 * If the alarm that went off has the same name as our alarm,
 * it creates a notification, clears the interval, and resets the remaining time in local storage.
 */
chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === alarmName) {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: './timer.png',
            title: 'Timer',
            message: 'Time is up!'
        });
        clearInterval(intervalId);
        chrome.storage.local.set({timeRemaining: 0});
    }
});