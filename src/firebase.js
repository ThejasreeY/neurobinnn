import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB1PkMsOdRrFkSP8suI5vhDaeGm0c3KKYs",
  authDomain: "neurobin-a9220.firebaseapp.com",
  databaseURL: "https://neurobin-a9220-default-rtdb.firebaseio.com",
  projectId: "neurobin-a9220",
  storageBucket: "neurobin-a9220.appspot.com", // ✅ FIXED
  messagingSenderId: "106261180834",
  appId: "1:106261180834:web:920cfbcc6cb95072cd82fb"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
