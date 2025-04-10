// navbarHandler.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyChiFCS81APiDS4si0ihl6pmndmaps8n-I",
  authDomain: "website-prediksi-laporan.firebaseapp.com",
  projectId: "website-prediksi-laporan",
  storageBucket: "website-prediksi-laporan.firebasestorage.app",
  messagingSenderId: "239617567465",
  appId: "1:239617567465:web:c6a585260889e7e3411e78",
  measurementId: "G-E1JW1GSGW5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const ADMIN_UID = "quTtVs8tqVZtThpSqxjjCM6Fazh2";

export function handleNavbarState() {
  const loginLink = document.getElementById("loginLink");
  const adminLink = document.getElementById("adminLink");

  onAuthStateChanged(auth, (user) => {
    if (user && user.uid === ADMIN_UID && localStorage.getItem("adminLoggedIn")) {
      loginLink.style.display = "none";
      adminLink.style.display = "inline-block";
    } else {
      loginLink.style.display = "inline-block";
      adminLink.style.display = "none";
      localStorage.removeItem("adminLoggedIn");
    }
  });
}
