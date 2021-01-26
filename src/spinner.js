/**
 * Creates a spinner element using Bootstrap classes
 * @return {Element} The spinner element
 */
export function createSpinnerBorder(){
    let hiddenSpan = document.createElement("span");
    hiddenSpan.classList.add("visually-hidden");
    hiddenSpan.innerHTML = "Loading...";
    
    let spinner = document.createElement("span");
    spinner.classList.add("spinner-border");
    spinner.setAttribute("role", "status");
    spinner.setAttribute("aria-hidden", "true");
    spinner.appendChild(hiddenSpan)
    return spinner;
}

export default {
    createSpinnerBorder
}