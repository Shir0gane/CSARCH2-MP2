import Form from "./form";
import Table from "./table";
import spinner from "./spinner";
import { saveAs } from "file-saver";

// inputs
let divisionForm = new Form(document.getElementById("division-form"));
let dividendInput = document.getElementById("dividend");
let divisorInput = document.getElementById("divisor");

// For diplaying results
let solutionTable = new Table(document.getElementById("steps-table"));
let quotient = document.getElementById("quotient");
let remainder = document.getElementById("remainder");
let initRegisterA = document.getElementById("init-register-A");
let initRegisterQ = document.getElementById("init-register-Q");
let initRegisterM = document.getElementById("init-register-M");
let finalResultSection = document.getElementById("final-result-section");

// Card containing the result
let resultCard = document.getElementById("result-card");
let resultSection = document.getElementById("result-section");

let alerts = document.getElementById("alert-div"); // The section containing all alerts

// Next-step button
let nextStepButton = document.getElementById("next-step-btn");

// Dropdown for mode 
let modeSelect = document.getElementById("mode-selector");

let downloadButton = document.getElementById("download-btn");

let latestResult; // The latest result of the division operation

const ALL_MODE = 0;
const STEP_BY_STEP_MODE = 1;

solutionTable.showTableMessage("-");
addCardMessage("Please enter valid binary operands", resultCard);

/**
 * Shows an alert in the page
 * @param {string} alertContext - The Bootstrap class for the alert context
 * @param {string} message - The message to show
 * @return {Element} The alert element
 */
function addAlert(alertContext, message){
    let alert = document.createElement("div");
    alert.classList.add("alert", alertContext, "text-center");
    alert.setAttribute("role", "alert");
    alert.textContent = message;
    alerts.append(alert);
    return alert;
}

/**
 * Removes all alerts in the page
 */
function clearAlerts(){
    alerts.innerHTML = "";
}

/**
 * Makes a GET request for the result of the division operation based on the current input
 * in the division-form. If sucessful, calls the successCallback function; otherwise, 
 * calls the errorCallback function. The context of the callback functions would be the XMLHttpRequest object
 * used to make the request.
 */
function getResult(successCallback, errorCallback, dividend, divisor){
    dividend = dividend.trim();
    divisor = divisor.trim();
    let xml = new XMLHttpRequest();
    xml.addEventListener("load", successCallback);
    xml.addEventListener("error", errorCallback)
    xml.open("GET", `divide?dividend=${dividend}&divisor=${divisor}`);
    xml.send();
}

/**
 * Adds a new row in the solution table
 * @param {number} passNumber - The current iteration in the non-restoring algorithm
 * @param {{A: string, Q: string, operation: string}} solution - The values of the register after
 * the iteration and a string describing the operation done in the iteration
 */
function addRow(passNumber, solution){
    solutionTable.insertRow([String(passNumber), solution.A, solution.Q, solution.operation]);
}

/**
 * Updates the page based on the result of the division operation. Sets the latestResult
 * variable to the result, where all integer arrays are converted to string.
 * @param {Object} result - The result obtained from GET /divide/:dividend/:divisor
 */
function updateResults(result){
    let mode = Number(modeSelect.value);
    removeCardMessages();
    nextStepButton.style.display = (mode === ALL_MODE) ? "none": "block";
    result.quotient = result.quotient.join("");
    result.remainder = result.remainder.join("");
    result.init.A = result.init.A.join("");
    result.init.Q = result.init.Q.join("");
    result.init.M = result.init.M.join("");
    let solution = result.solution;

    quotient.value = result.quotient;
    remainder.value = result.remainder;

    initRegisterA.textContent = result.init.A;
    initRegisterQ.textContent = result.init.Q;
    initRegisterM.textContent = result.init.M;

    solutionTable.clearContents();

    for(let i=0; i<solution.length; ++i){
        solution[i].Q = solution[i].Q.join("");
        solution[i].A = solution[i].A.join("");
    }

    if(mode === ALL_MODE){
        for(let i=0; i<solution.length; ++i){
            addRow(i+1, solution[i]);
        }
        finalResultSection.style.display = "block";
    }else{
        addRow(1, solution[0]);
        finalResultSection.style.display = "none";
    }
    
    resultSection.style.display = "block";
    latestResult = result;
}

/**
 * Adds a message in a bootstrap card, immediately right after the head section if it exists; otherwise,
 * prepends the message in the bootstrap card
 * @param {string} message - The message to display
 * @param {Element} card - The card to place the message in
 * @return {Element} - The message element
 */
function addCardMessage(message, card){
    let messageElem = document.createElement("p");
    messageElem.textContent = message;
    messageElem.classList.add("text-center", "mt-3", "card-message");

    let cardHead = card.querySelector(".card-head");
    card.insertBefore(messageElem, cardHead);

    return messageElem;
}

/**
 * Removes all messages in a given card
 * @param {Element} card - The card to remove the messages for
 */
function removeCardMessages(card){
    let messages = document.getElementsByClassName("card-message");
    for(let i=0; i<messages.length; ++i){
        messages[i].remove();
    }
}

/**
 * Show next step of solution. Hides the next step button
 * if no more steps are available
 */
function nextStep(){
    if(!latestResult){
        return;
    }
    let currentStepCount = solutionTable.tableElem.querySelectorAll("tbody>tr").length;
    let solution = latestResult.solution;
    if(currentStepCount < solution.length){
        addRow(currentStepCount + 1, solution[currentStepCount]);
        currentStepCount++;
    }
    if(currentStepCount === solution.length){
        nextStepButton.style.display = "none"
        finalResultSection.style.display = "block";
    }
}

nextStepButton.addEventListener("click", nextStep);

/**
 * Removes the existing results in the page and sets the latestResult variable to null.
 */
function clearResults(){
    quotient.value = "";
    remainder.value = "";
    solutionTable.clearContents();
    latestResult = null;
    initRegisterA.textContent = "";
    initRegisterQ.textContent = "";
    initRegisterM.textContent = "";
    nextStepButton.style.display = "none";
    finalResultSection.style.display = "block";
    resultSection.style.display = "none";
}

// Execute upon submitting the input form for division
divisionForm.formElement.addEventListener("submit", function(event){
    event.preventDefault();
    clearAlerts();
    clearResults();
    removeCardMessages();
    addCardMessage("Computing...", resultCard);
    solutionTable.showTableMessage("-");
    divisionForm.setEnabled(false);
    let loadingAlert = addAlert("alert-secondary", "Computing...");
    let spinnerElem = spinner.createSpinnerBorder();
    spinnerElem.classList.add("spinner-border-sm");
    spinnerElem.style["margin-right"] = "10px";
    loadingAlert.prepend(spinnerElem);
    
    getResult(function(){
        clearAlerts();
        removeCardMessages();
        let result;
        try{
            result = JSON.parse(this.responseText);
        }catch(err){
            result = this.responseText;
        }
        
        if(this.status === 200){
            updateResults(result);
        }else{
            let message = result.message || "Cannot communicate with server rigth now.";
            addCardMessage("Invalid input", resultCard);
            addAlert("alert-danger", message);
        }
        divisionForm.setEnabled(true);
    }, function(){
        clearAlerts();
        addCardMessage("Error.");
        addAlert("alert-danger", "Cannot communicate with server rigth now.");
        divisionForm.setEnabled(true);
    }, dividendInput.value, divisorInput.value);
});

/**
 * Downloads the txt file based on the latest division result
 */
function downloadTxtFile(){
    if(!latestResult){
        return;
    }

    let content = "";

    content += "INITIALIZATION\n";
    content += `Register A: ${latestResult.init.A}\n`;
    content += `Register Q: ${latestResult.init.Q}\n`;
    content += `Register M: ${latestResult.init.M}\n`;

    content += "\n\n"

    content += "STEPS\n";
    for(let i=0; i<latestResult.solution.length; ++i){
        content += `Pass ${i + 1}:\n`;
        content += `\tA:${latestResult.solution[i].A}\n`;
        content += `\tQ:${latestResult.solution[i].Q}\n`;
        content += `\tOperation Performed: ${latestResult.solution[i].operation}\n`
    }

    content += "\n\n";

    content += "FINAL RESULT\n";
    content += `Quotient (Q): ${latestResult.quotient}\n`;
    content += `Remainder (A): ${latestResult.remainder}\n`;

    let blob = new Blob([content], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "non-restoring-division-result.txt");
}

downloadButton.addEventListener("click", function(){
    downloadTxtFile();
});
