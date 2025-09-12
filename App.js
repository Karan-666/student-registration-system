// wait until the page is fully loaded before running the code
window.onload = function() {
    // get all necessary elements from the HTML
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
    
    // variables to track editing state
    var isEditing = false;
    var editId = null;
    
    // load students and display them when page starts
    loadStudents();
    updateScrollbar();
    
    // handle form submit
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
    
    // validate the form inputs
    function validateForm() {
        var isValid = true;
        
        // validate name (only letters and spaces)
        var name = studentNameInput.value.trim();
        if (name === "" || !/^[A-Za-z\s]+$/.test(name)) {
            nameError.style.display = "block";
            isValid = false;
        } else {
            nameError.style.display = "none";
        }
        
        // validate ID (only numbers)
        var id = studentIdInput.value.trim();
        if (id === "" || !/^\d+$/.test(id)) {
            idError.style.display = "block";
            isValid = false;
        } else {
            idError.style.display = "none";
        }
        
        // validate email format
        var email = emailInput.value.trim();
        if (email === "" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            emailError.style.display = "block";
            isValid = false;
        } else {
            emailError.style.display = "none";
        }
        
        // validate contact number (exactly 10 digits)
        var contact = contactInput.value.trim();
        if (contact === "" || !/^\d{10}$/.test(contact)) {
            contactError.style.display = "block";
            isValid = false;
        } else {
            contactError.style.display = "none";
        }
        
        return isValid;
    }
    
    // add a new student
    function addStudent(student) {
        var students = getStudentsFromStorage();
        
        // check if ID already exists
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
    
    // update an existing student
    function updateStudent(oldId, updatedStudent) {
        var students = getStudentsFromStorage();
        
        // find student by ID
        for (var i = 0; i < students.length; i++) {
            if (students[i].id === oldId) {
                // if ID changed, check if new ID already exists
                if (oldId !== updatedStudent.id) {
                    for (var j = 0; j < students.length; j++) {
                        if (students[j].id === updatedStudent.id) {
                            alert("Student ID already exists!");
                            return;
                        }
                    }
                }
                
                // update student details
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
    
    // delete a student
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
    
    // edit a student
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
    
    // render students in the table
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
    
    // load students on page start
    function loadStudents() {
        renderStudents();
    }
    
    // get students from localStorage
    function getStudentsFromStorage() {
        var data = localStorage.getItem('students');
        if (data) {
            return JSON.parse(data);
        } else {
            return [];
        }
    }
    
    // save students to localStorage
    function saveStudentsToStorage(students) {
        localStorage.setItem('students', JSON.stringify(students));
    }
    
    // reset the form
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
    
    // check if scrollbar is needed
    function updateScrollbar() {
        var students = getStudentsFromStorage();
        if (students.length > 5) {
            studentsContainer.style.overflowY = "auto";
        } else {
            studentsContainer.style.overflowY = "hidden";
        }
    }
    
    // expose edit and delete functions to global scope
    window.editStudent = editStudent;
    window.deleteStudent = deleteStudent;
};
