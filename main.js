

// Variables
const listDOM = document.querySelector('.list');
const addBook = document.querySelector('.form');
const removeBook = document.querySelector('.remove-book');
const title = document.querySelector('#title');
const author = document.querySelector('#author');
const isbn = document.querySelector('#isbn');
const LOCAL_STORAGE_LIST_KEY = 'BookList.list';

// Books
let list = [];


// Getting Books
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.id = Date.now().toString();
    }
}

// Display Books
class UI {

    validateValues(title, author, isbn) {
        if (title === null || title === '' || title === ' ' ||
            author === null || author === '' || author === ' ' ||
            isbn === null || isbn === '' || isbn === ' ')
            return false;
        return true;
    }

    resetForm() {
        title.value = null;
        author.value = null;
        isbn.value = null;
    }

    handleForm(e) {

        e.preventDefault();

        // Get Values
        let temptitle = title.value;
        let tempAuthor = author.value;
        let tempISBN = isbn.value;

        // Validate Values
        let valid = this.validateValues(temptitle, tempAuthor, tempISBN);

        if (!valid)
            return;

        // Instatiate Book
        let book = new Book(temptitle, tempAuthor, tempISBN);

        // Add Book To Page
        this.addBookToPage(book);

        // Reset Form
        this.resetForm();

        // Add Book To List Array
        list = [...list, book];

        // Save List
        Store.saveList(list);
    }

    setupApp() {
        list = Store.getList();
        addBook.addEventListener('submit', (e) => { this.handleForm(e) });
    }

    addBookToPage(listItem) {
        let result = '';
        result += `
        <tr data-row-id = ${listItem.id}>
            <td>${listItem.title}</td>
            <td>${listItem.author}</td>
            <td>${listItem.isbn}</td>
            <td class="remove-btn"><button class="remove-book" data-button-id = ${listItem.id}>Remove</button></td>
        </tr>
        `;

        listDOM.innerHTML += result;
    }

    displayBooks() {
        list.forEach(listItem => {
            this.addBookToPage(listItem);
        })
    }

    handleClearBookBtn(id) {

        // remove id from list
        list = list.filter(item => item.id !== id);

        // save List
        Store.saveList(list);

    }

    removeItemLogic() {

        listDOM.addEventListener('click', e => {
            if (e.target.classList.contains('remove-book')) {
                let id = e.target.dataset.buttonId;
                let clearBook = e.target;
                this.handleClearBookBtn(id);
                clearBook.parentElement.parentElement.remove();
            }
        })

    }
}

// Save In Local Storage
class Store {

    static getList() {
        return JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
    }

    static saveList(list) {
        window.localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(list));
    }

}


document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();

    // Setup App
    ui.setupApp();

    // Handle Books
    ui.displayBooks(list);
    ui.removeItemLogic();
});