// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getDatabase, onValue, ref, set, child, update, remove } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAm85Ogy5zIBDLassR7eTizMlKa_-onatY",
  authDomain: "ev-aas.firebaseapp.com",
  projectId: "ev-aas",
  storageBucket: "ev-aas.appspot.com",
  messagingSenderId: "950451986928",
  appId: "1:950451986928:web:af034b2f6dcd19a34f3d35"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();

let prevBtn = document.querySelector("#prevBtn")
let nextBtn = document.querySelector("#nextBtn")

var currentTab = 0; // Current tab is set to be the first tab (0)
var valid_uid = false;
var uid_list = []
showTab(currentTab); // Display the current tab

prevBtn.addEventListener("click", function () {
  // This function will figure out which tab to display
  var x = document.getElementsByClassName("tab");
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab - 1;
  // Display the previous tab:
  showTab(currentTab)
})

nextBtn.addEventListener("click", function () {
  // This function will figure out which tab to display
  var x = document.getElementsByClassName("tab");
  // Exit the function if any field in the current tab is invalid:
  if (!validateForm()) return false;
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + 1;
  // if you have reached the end of the form...
  if (currentTab == x.length) {
    // ... the form gets submitted:
    var div = document.querySelectorAll("#inForm")
    for (var i = 0; i<div.length; i++) {
        div[i].style.display = "none";
    }

    registerToFirebase()
   
    var tick = document.querySelector(".wrapper")
    tick.style.display = "block"

  } else {
  // Otherwise, display the correct tab:
    showTab(currentTab)
  }
})

function showTab(n) {
  // This function will display the specified tab of the form...
  var x = document.getElementsByClassName("tab");
  x[n].style.display = "block";
  //... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    document.getElementById("nextBtn").innerText = "Submit";
  } else {
    document.getElementById("nextBtn").innerText = "Next";
  }
  //... and run a function that will display the correct step indicator:
  fixStepIndicator(n)
}

function validateForm() {
  // This function deals with validation of the form fields
  if (!valid_uid){
    var new_uid = document.querySelector("#uid").value
    
    onValue(ref(db, '/'), (snapshot)=>{
      snapshot.forEach((childSnapshot)=>{
        uid_list.push(childSnapshot.key)
      });
    });

    if (uid_list.includes(new_uid)) {
      alert("UID already registered. Enter valid UID.");
      return false
    } else {
      if(currentTab>0){
        valid_uid = true
      }
    }
  }
  var x, y, i, valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByTagName("input");
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].value == "") {
      // add an "invalid" class to the field:
      y[i].className += " invalid";
      // and set the current valid status to false
      valid = false;
    }
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class on the current step:
  x[n].className += " active";
}

function registerToFirebase() {
    let uid = document.querySelector("#uid").value
    let fname = document.querySelector("#fname").value
    let mnumber = document.querySelector("#mnumber").value
    let address = document.querySelector("#address").value
    let acnumber = document.querySelector("#acnumber").value
    let enumber = document.querySelector("#enumber").value
    let model = document.querySelector("#model").value
    let vnumber = document.querySelector("#vnumber").value
    let rcnumber = document.querySelector("#rcnumber").value
    let colour = document.querySelector("#colour").value

    console.log(uid)
    update(ref(db, uid + "/Customer_Details"),{
      Name: fname,
      Mobile_No: mnumber,
      Address: address,
      Aadhar_Card_No: acnumber
    });

    update(ref(db, uid + "/Vehicle_Details"),{
      Colour: colour,
      Model: model,
      Vehicle_No: vnumber,
      RC_No: rcnumber
    });

    update(ref(db, uid + "/GPS_Location"),{
      Latitude: "0",
      Longitude: "0"
    });

    update(ref(db, uid),{
      Emergency_No: enumber,
      WithinRangeFlag: 0,
      SOS_Flag: "0",
      Last_Poll: "nil",
      Is_Active: 0
    });
}

function waitTime(ms){
  return new Promise(function(resolve, reject) {
      setTimeout(function() {
          resolve(ms);
      }, ms);
  });
}
