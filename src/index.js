import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  //   getDocs,
  onSnapshot, // updates browser with db in real time
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCNX0V8GifLrjMD-inyEdsCYu__g9iWSoA",
  authDomain: "fir-9-tutorial-2110f.firebaseapp.com",
  projectId: "fir-9-tutorial-2110f",
  storageBucket: "fir-9-tutorial-2110f.appspot.com",
  messagingSenderId: "659423734683",
  appId: "1:659423734683:web:002c674872077dd1288f3e",
};

// init firebase app
initializeApp(firebaseConfig);

// init services and authentication
const db = getFirestore();
const auth = getAuth();

// collection ref
const colRef = collection(db, "books");

// queries
const q = query(colRef, orderBy("createdAt"));
// const q = query(colRef, where("author", "==", "J.R.R. Tolkien"),orderBy("title", "desc"));

// use the queries var in place of the colRef in the onSnapshot function to retrieve the docs specified in the where method.

// get collection data
// getDocs(colRef)
//   .then((snapshot) => {
//     let books = [];
//     snapshot.docs.forEach((doc) => {
//       books.push({ ...doc.data(), id: doc.id });
//     });
//     console.log(books);c
//   })
//   .catch((error) => {
//     console.log(error.message);
//   });

//   real time collection data
const unsubCol = onSnapshot(q, (snapshot) => {
  // or use colRef as first arg
  let books = [];
  snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id });
  });
  console.log(books);
});

//   adding documents
const addBookForm = document.querySelector(".add");
addBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp(),
  }).then(() => addBookForm.reset());
});

// deleting documents
const deleteBookForm = document.querySelector(".delete");
deleteBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "books", deleteBookForm.id.value);

  deleteDoc(docRef).then(() => {
    deleteBookForm.reset();
  });
});

// get a single document

const docRef = doc(db, "books", "bU121RFNl2H8hqjARkAa");

// getDoc(docRef).then((doc) => console.log(doc.data(), doc.id));

// real time doc data and unsub from doc variable example
const unsubDoc = onSnapshot(docRef, (doc) => console.log(doc.data(), doc.id));

const updateForm = document.querySelector(".update");
updateForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "books", updateForm.id.value);

  updateDoc(docRef, {
    title: "updated title",
  }).then(() => updateForm.reset());
});

// signing users up

const signupForm = document.querySelector(".signup");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = signupForm.email.value;
  const password = signupForm.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      //   console.log("user created: ", cred.user);
      signupForm.reset();
    })
    .catch((error) => console.log(error.message));
});

// logging in and out
const logoutButton = document.querySelector(".logout");
logoutButton.addEventListener("click", (e) => {
  e.preventDefault();
  signOut(auth)
    // .then(() => console.log("the user signed out"))
    .catch((error) => console.log(error.message));
});

const loginForm = document.querySelector(".login");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
    // .then((cred) => console.log("Logged in user: ", cred.user))
    .catch((error) => console.log(error.message));
});

// subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) =>
  console.log("The user status changed to: ", user)
);

// unsubscribing from changes (auth & db)
const unsubButton = document.querySelector(".unsub");
unsubButton.addEventListener("click", () => {
  // wouldn't work without having unsubAuth
  console.log("unsubscribing from doc");
  unsubCol();
  unsubDoc();
  unsubAuth();
});
