import spinner from "./spinner";

class Form{
    /**
     * Creates a Form object
     * @param {Element} formElement 
     */
    constructor(formElement){
        this.formElement = formElement;
        this.submitButton = this.formElement.querySelector(`button[type="submit"]`);
        this.submitButtonOringalText = this.submitButton.innerText;
    }

    /**
     * Enables or disables the form, depending on the value of the argument
     * @param {boolean} isEnabled - Indicates whether the form is enabled or disabled
     */
    setEnabled(isEnabled){
        let inputs = this.formElement.getElementsByTagName("input");
        for(let i=0; i<inputs.length; ++i){
            inputs[i].disabled = !isEnabled
        }
        this.submitButton.disabled = !isEnabled;
    }

    /**
     * Disables the form and adds a spinner to the submit button
     * @param {string} text - The text to show in the submit button
     */
    showLoading(text){
        let spinnerElement = spinner.createSpinnerBorder();
        spinnerElement.classList.add("spinner-border-sm");
        this.submitButton.innerHTML = "";
        this.submitButton.appendChild(spinnerElement);
        this.submitButton.appendChild(document.createTextNode(text));
        this.setEnabled(false);
    }

    /**
     * Enables the form and restores the original text in the submit button
     */
    removeLoading(){
        this.submitButton.innerHTML = "";
        this.submitButton.textContent = this.submitButtonOringalText;
        this.setEnabled(true);
    }
}

export default Form;