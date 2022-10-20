import { data } from "./data.js";
import { UI } from "./UI.js";
import { App } from "./app.js";


// Store Class: Handles Storage
export class Store {

   static getCards() {
      let cards;
      if (localStorage.getItem('cards') === null) {
         cards = data.slice();
      } else {
         cards = JSON.parse(localStorage.getItem('cards'));
      }

      return cards;
   }

   /**
    * Save cards in the local storage
    */
   static saveCards(cards) {
      localStorage.setItem('cards', JSON.stringify(cards));
   }

   static addBook(book) {
      const books = Store.getBooks();
      books.push(book);
      localStorage.setItem('books', JSON.stringify(books));
   }

   static removeBook(verso) {
      const books = Store.getBooks();

      books.forEach((book, index) => {

         if (book.verso === verso) {
            books.splice(index, 1);
         }
      });

      localStorage.setItem('books', JSON.stringify(books));
   }
}