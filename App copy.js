// Execute script once the DOM is fully constructed.
window.onload = function() {
    // Reference DOM elements required for the application.
    var studentForm = document.getElementById('studentForm');
    var studentsList = document.getElementById('studentsList');
    var studentsContainer = document.getElementById('studentsContainer');
    
    var studentNameInput = document.getElementById('studentName');
    var studentIdInput = document.getElementById('studentId');
    var emailInput = document.getElementById('email');
    var contactInput = document.getElementById('contact');
    
    var nameError = document.getElementById('nameError');
    var idError = document.getElementById('idError');
    var emailError = document.getElementById('emailError');
    var contactError = document.getElementById('contactError');
    
    // State flags for managing the edit operation.
    var isEditing = false;
    var editId = null;
    
    // Initial population of the student list on page load.
    loadStudents();
    updateScrollbar();
    
    // Set up the event listener for form submission.
    studentForm.onsubmit = function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            var student = {
                name: studentNameInput.value.trim(),
                id: studentIdInput.value.trim(),
                email: emailInput.value.trim(),
                contact: contactInput.value.trim()
            };
            
            if (isEditing) {
                updateStudent(editId, student);
            } else {
                addStudent(student);
            }
            
            resetForm();
        }
    };
    
    // Checks the validity of user-provided form data.
    function validateForm() {
        var isValid = true;
        
        // Ensure the name contains only alphabetic characters and spaces.
        var name = studentNameInput.value.trim();
        if (name === "" || !/^[A-Za-z\s]+$/.test(name)) {
            nameError.style.display = "block";
            isValid = false;
        } else {
            nameError.style.display = "none";
        }
        
        // Confirm the ID consists solely of numerical digits.
        var id = studentIdInput.value.trim();
        if (id === "" || !/^\d+$/.test(id)) {
            idError.style.display = "block";
            isValid = false;
        } else {
            idError.style.display = "none";
        }
        
        // Verify the email address follows a standard format.
        var email = emailInput.value.trim();
        if (email === "" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            emailError.style.display = "block";
            isValid = false;
        } else {
            emailError.style.display = "none";
        }
        
        // Check if the contact number is precisely 10 digits long.
        var contact = contactInput.value.trim();
        if (contact === "" || !/^\d{10}$/.test(contact)) {
            contactError.style.display = "block";
            isValid = false;
        } else {
            contactError.style.display = "none";
        }
        
        return isValid;
    }
    
    // Function to append a new student record.
    function addStudent(student) {
        var students = getStudentsFromStorage();
        
        // Prevent duplicate student IDs.
        for (var i = 0; i < students.length; i++) {
            if (students[i].id === student.id) {
                alert("Student ID already exists!");
                return;
            }
        }
        
        students.push(student);
        saveStudentsToStorage(students);
        renderStudents();
        updateScrollbar();
    }
    
    // Modifies the details of a pre-existing student.
    function updateStudent(oldId, updatedStudent) {
        var students = getStudentsFromStorage();
        
        // Locate the student record using their unique ID.
        for (var i = 0; i < students.length; i++) {
            if (students[i].id === oldId) {
                // If the ID is being changed, verify the new ID is unique.
                if (oldId !== updatedStudent.id) {
                    for (var j = 0; j < students.length; j++) {
                        if (students[j].id === updatedStudent.id) {
                            alert("Student ID already exists!");
                            return;
                        }
                    }
                }
                
                // Overwrite the old student data with the new information.
                students[i] = updatedStudent;
                saveStudentsToStorage(students);
                renderStudents();
                updateScrollbar();
                break;
            }
        }
        
        isEditing = false;
        editId = null;
    }
    
    // Removes a student's record from the list.
    function deleteStudent(id) {
        if (confirm("Are you sure you want to delete this student?")) {
            var students = getStudentsFromStorage();
            var newStudents = [];
            
            for (var i = 0; i < students.length; i++) {
                if (students[i].id !== id) {
                    newStudents.push(students[i]);
                }
            }
            
            saveStudentsToStorage(newStudents);
            renderStudents();
            updateScrollbar();
        }
    }
    
    // Populates the form with a student's data for editing.
    function editStudent(id) {
        var students = getStudentsFromStorage();
        
        for (var i = 0; i < students.length; i++) {
            if (students[i].id === id) {
                studentNameInput.value = students[i].name;
                studentIdInput.value = students[i].id;
                emailInput.value = students[i].email;
                contactInput.value = students[i].contact;
                
                isEditing = true;
                editId = id;
                
                document.querySelector(".btn-primary").textContent = "Update Student";
                break;
            }
        }
    }
    
    // Dynamically generates and displays the student table.
    function renderStudents() {
        var students = getStudentsFromStorage();
        
        if (students.length === 0) {
            studentsList.innerHTML = "<tr><td colspan='5' class='no-data'>No students registered yet</td></tr>";
            return;
        }
        
        var html = "";
        for (var i = 0; i < students.length; i++) {
            html += "<tr>";
            html += "<td>" + students[i].name + "</td>";
            html += "<td>" + students[i].id + "</td>";
            html += "<td>" + students[i].email + "</td>";
            html += "<td>" + students[i].contact + "</td>";
            html += "<td>";
            html += "<div class='action-buttons'>";
            html += "<button class='btn-edit' onclick=\"editStudent('" + students[i].id + "')\">Edit</button>";
            html += "<button class='btn-delete' onclick=\"deleteStudent('" + students[i].id + "')\">Delete</button>";
            html += "</div>";
            html += "</td>";
            html += "</tr>";
        }
        
        studentsList.innerHTML = html;
    }
    
    // Initial function call to display stored students.
    function loadStudents() {
        renderStudents();
    }
    
    // Retrieves student data from the browser's local storage.
    function getStudentsFromStorage() {
        var data = localStorage.getItem('students');
        if (data) {
            return JSON.parse(data);
        } else {
            return [];
        }
    }
    
    // Persists the current list of students to local storage.
    function saveStudentsToStorage(students) {
        localStorage.setItem('students', JSON.stringify(students));
    }
    
    // Clears the form fields and resets its state.
    function resetForm() {
        studentForm.reset();
        isEditing = false;
        editId = null;
        document.querySelector(".btn-primary").textContent = "Register Student";
        
        nameError.style.display = "none";
        idError.style.display = "none";
        emailError.style.display = "none";
        contactError.style.display = "none";
    }
    
    // Toggles the visibility of the scrollbar based on content height.
    function updateScrollbar() {
        var students = getStudentsFromStorage();
        if (students.length > 5) {
            studentsContainer.style.overflowY = "auto";
        } else {
            studentsContainer.style.overflowY = "hidden";
        }
    }
    
    // Make functions accessible from inline HTML event handlers.
    window.editStudent = editStudent;
    window.deleteStudent = deleteStudent;
};