// This makes sure our script runs after the whole page is loaded
window.onload = function () {
  console.log("App started!");

  // --- SELECT THE HTML ELEMENTS ---
  // The form itself
  const studentForm = document.getElementById("studentForm");
  // The table body where we will show students
  const studentsList = document.getElementById("studentsList");

  // All the input boxes
  const studentNameInput = document.getElementById("studentName");
  const studentIdInput = document.getElementById("studentId");
  const emailInput = document.getElementById("email");
  const contactInput = document.getElementById("contact");

  // error elements

  const studentNameInputError = document.getElementById("nameError");
  const studentIdInputError = document.getElementById("idError");
  const emailInputError = document.getElementById("emailError");
  const contactInputError = document.getElementById("contactError");

  // to change it between add or edit
  const submitButton = document.querySelector(".btn-primary");

  // student array to store array of student object
  let students = [];
  students = getStudentsFromStorage();

  displayStudents(); // this will load any previous students we saved in local memory

  // --- State variables to manage editing ---
  let isEditing = false;
  let studentIdToEdit = null;

  // below are 2 helper functions to just save the objects in browser local storage

  function saveStudentsToStorage(studentsToSave) {
    // localStorage can only store strings.
    // JSON.stringify() converts our array of objects into a string.
    localStorage.setItem("students", JSON.stringify(studentsToSave));
  }

  function getStudentsFromStorage() {
    const storedStudents = localStorage.getItem("students");
    // If we found something in storage, JSON.parse() converts it back
    // from a string into a real array. Otherwise, we start with an empty array.
    if (storedStudents) {
      return JSON.parse(storedStudents);
    } else {
      return [];
    }
  }

  function displayStudents() {
    // First, clear the table so we don't get duplicates
    studentsList.innerHTML = "";

    // Now, loop through each student in our 'students' array
    students.forEach(function (student) {
      // For each student, create a new table row element
      const row = document.createElement("tr");

      // Set the HTML inside that new row.
      // Using backticks (`) makes it easy to insert variables like ${student.name}
      row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.id}</td>
                <td>${student.email}</td>
                <td>${student.contact}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" data-id="${student.id}">Edit</button>
                        <button class="btn-delete" data-id="${student.id}">Delete</button>
                    </div>
                </td>
            `;

      // Finally, add this new row to the table body in the HTML
      studentsList.appendChild(row);
    });
  }

  // --- 2. LISTEN FOR FORM SUBMISSION ---
  studentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const isFormValid = checkIfNotEmpty();
    if (!isFormValid) {
      // If the form is not valid, stop the function right here.
      return;
    }

    const idValue = studentIdInput.value;
    if (isIdDuplicate(idValue)) {
      alert("Error: A student with this ID already exists!");
      return; // Stop the function
    }

    if (isEditing) {
      // --- LOGIC FOR UPDATING A STUDENT ---
      // Find the student in the array and update their details

      students = students.map(function (student) {
        if (student.id === studentIdToEdit) {
          // This is the student we want to update. Return a new object with the new values.
          return {
            name: studentNameInput.value,
            id: studentIdInput.value,
            email: emailInput.value,
            contact: contactInput.value,
          };
        }
        // Otherwise, return the student unchanged
        return student;
      });

      // Reset the state back to "add mode"
      isEditing = false;
      studentIdToEdit = null;
      submitButton.textContent = "Register Student";
    } else {
      // --- LOGIC FOR ADDING A NEW STUDENT (old code) ---
      const newStudent = {
        name: studentNameInput.value,
        id: studentIdInput.value,
        email: emailInput.value,
        contact: contactInput.value,
      };
      students.push(newStudent);
    }

    saveStudentsToStorage(students);
    displayStudents();
    studentForm.reset();
  });

  //  Add listener for delete or edit clicks on the table ---
  studentsList.addEventListener("click", function (event) {
    // Handle DELETE clicks
    if (event.target.classList.contains("btn-delete")) {
      if (confirm("Are you sure you want to delete this student?")) {
        const studentIdToDelete = event.target.getAttribute("data-id");
        students = students.filter(function (student) {
          return student.id !== studentIdToDelete;
        });
        saveStudentsToStorage(students);
        displayStudents();
      }
    }

    // Handle EDIT clicks
    if (event.target.classList.contains("btn-edit")) {
      const studentId = event.target.getAttribute("data-id"); // here we get the id to edit

      // Find the student object in our array
      const studentToEdit = students.find(function (student) {
        // using that id, we stored whole object in a variable here
        return student.id === studentId;
      });

      // Populate the form fields with the student's data
      studentNameInput.value = studentToEdit.name;
      studentIdInput.value = studentToEdit.id;
      emailInput.value = studentToEdit.email;
      contactInput.value = studentToEdit.contact;

      // Switch to "edit mode"
      isEditing = true;
      studentIdToEdit = studentId; // here we updated the id to a variable we will use above
      submitButton.textContent = "Update Student";
    }
  });

  function checkIfNotEmpty() {
    let flag = true;

    if (studentNameInput.value === "") {
      studentNameInputError.style.display = "block";
      flag = false;
    } else {
      studentNameInputError.style.display = "none";
    }

    if (studentIdInput.value === "") {
      studentIdInputError.style.display = "block";
      flag = false;
    } else {
      studentIdInputError.style.display = "none";
    }

    if (emailInput.value === "") {
      emailInputError.style.display = "block";
      flag = false;
    } else {
      emailInputError.style.display = "none";
    }

    if (contactInput.value === "") {
      contactInputError.style.display = "block";
      flag = false;
    } else {
      contactInputError.style.display = "none";
    }

    return flag;
  }

  function isIdDuplicate(id) {
    for (let obj of students) {
      if (obj.id === id) return true;
    }
    return false;
  }
};
