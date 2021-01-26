import Form from "./form";
import Table from "./table";
import spinner from "./spinner";

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

let alerts = document.getElementById("alert-div"); // The section containing all alerts

let latestResult; // The latest result of the division operation

solutionTable.showTableMessage("-");

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
function getResult(successCallback, errorCallback){
    let dividend = dividendInput.value.trim();
    let divisor = divisorInput.value.trim();
    let xml = new XMLHttpRequest();
    xml.addEventListener("load", successCallback);
    xml.addEventListener("error", errorCallback)
    xml.open("GET", `divide/${dividend}/${divisor}`);
    xml.send();
}

/**
 * Updates the page based on the result of the division operation. Sets the latestResult
 * variable to the result, where all integer arrays are converted to string.
 * @param {Object} result - The result obtained from GET /divide/:dividend/:divisor
 */
function updateResults(result){
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
        solutionTable.insertRow([String(i + 1), solution[i].A, solution[i].Q]);
    }

    latestResult = result;
}

/**
 * Removes the existing results in the page and sets the latestResult variable to null
 */
function clearResults(){
    quotient.value = "";
    remainder.value = "";
    solutionTable.clearContents();
    latestResult = null;
    initRegisterA.textContent = "";
    initRegisterQ.textContent = "";
    initRegisterM.textContent = "";
}

// Execute upon submitting the input form for division
divisionForm.formElement.addEventListener("submit", function(event){
    event.preventDefault();
    clearAlerts();
    clearResults();
    solutionTable.showTableMessage("-");
    divisionForm.showLoading("");
    let loadingAlert = addAlert("alert-secondary", "Computing...");
    let spinnerElem = spinner.createSpinnerBorder();
    spinnerElem.classList.add("spinner-border-sm");
    spinnerElem.style["margin-right"] = "10px";
    loadingAlert.prepend(spinnerElem);
    
    getResult(function(){
        clearAlerts();
        let result = JSON.parse(this.responseText);
        if(this.status === 200){
            updateResults(result);
        }else{
            let message = result.message || "Cannot communicate with server rigth now.";
            addAlert("alert-danger", message);
        }
        divisionForm.removeLoading();
    }, function(){
        clearAlerts();
        addAlert("alert-danger", "Cannot communicate with server rigth now.");
        divisionForm.removeLoading();
    });
});

