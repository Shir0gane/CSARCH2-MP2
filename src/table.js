class Table{
    /**
     * Creates a Table object
     * @param {Element} tableElem - The table HTML element
     */
    constructor(tableElem){
        this.tableElem = tableElem;
        this.tbodyElem = this.tableElem.getElementsByTagName("tbody")[0];
    }

    /**
     * Removes all the rows in the table
     */
    clearContents(){
        this.tbodyElem.innerHTML = "";
    }

    /**
     * Shows the given message inside the table
     * @param {string} message - The message to show
     */
    showTableMessage(message){
        let columnCount = this.tableElem.getElementsByTagName("th").length
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.setAttribute("colspan", columnCount);
        td.innerText = message;
        td.classList.add("text-center");
        tr.appendChild(td);
        this.clearContents();
        this.tbodyElem.appendChild(tr);
    }

    /**
     * Inserts a row into the table
     * @param {string[]} values - An array of strings containing the values of each data cell in the row 
     */
    insertRow(values){
        let tr = document.createElement("tr");
        let columnCount = this.tableElem.getElementsByTagName("th").length
        for(let i=0; i<columnCount; ++i){
            let td = document.createElement("td");
            td.innerText = values[i];
            tr.appendChild(td);
        }
        this.tbodyElem.append(tr);
    }
}


export default Table;