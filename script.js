const form = document.getElementById("form");
const tableBody = document.querySelector("tbody");
const searchBox = document.getElementById("search");

let currentEditId = null;
let idCounter = 1;
const studentsList = [];

form.addEventListener("submit", function(event) {
	event.preventDefault();

	const name = document.querySelector("#name").value;
	const email = document.getElementById("email").value;
	const age = document.getElementById("age").value;
	const gpa = document.getElementById("gpa").value;
	const degree = document.getElementById("degree").value;

	if (currentEditId) {
		// Update existing student
		const student = studentsList.find(student => student.id === currentEditId);
		if (student) {
			student.name = name;
			student.email = email;
			student.age = age;
			student.gpa = gpa;
			student.degree = degree;
		}

		// Update the table cell values
		const row = document.getElementById(`row-${currentEditId}`);
		const cells = row.getElementsByTagName("td");
		cells[1].textContent = name;
		cells[2].textContent = email;
		cells[3].textContent = age;
		cells[4].textContent = gpa;
		cells[5].textContent = degree;

		// Reset the form and currentEditId
		form.reset();
		currentEditId = null;
		document.getElementById("crudBtn").textContent = "Add Student";
	} else {
		// Add new student to the list
		const newStudent = {
			id: idCounter,
			name: name,
			email: email,
			age: age,
			gpa: gpa,
			degree: degree
		};
		studentsList.push(newStudent);

		// Create a new table row
		const newRow = document.createElement("tr");
		newRow.id = `row-${newStudent.id}`;

		const rowData = [
			newStudent.id,
			newStudent.name,
			newStudent.email,
			newStudent.age,
			newStudent.gpa,
			newStudent.degree
		];

		rowData.forEach(function(value, index) {
			const cell = document.createElement("td");
			cell.textContent = value;
			newRow.appendChild(cell);
		});

		// Add edit and delete icons to the degree cell
		const degreeCell = document.createElement("td");
		const editIcon = document.createElement("i");
		editIcon.className = "fa fa-edit edit-icon";
		editIcon.dataset.id = newStudent.id;
		const deleteIcon = document.createElement("i");
		deleteIcon.className = "fa fa-trash delete-icon";
		deleteIcon.dataset.id = newStudent.id;
		degreeCell.appendChild(editIcon);
		degreeCell.appendChild(deleteIcon);
		newRow.appendChild(degreeCell);

		// Append the new row to the table body
		tableBody.appendChild(newRow);

		// Increment the ID counter
		idCounter++;

		// Reset the form inputs
		form.reset();
	}
});

// Edit and Delete event delegation
tableBody.addEventListener("click", function(event) {
	const target = event.target;

	if (target.classList.contains("edit-icon")) {
		// Get the row ID
		const id = parseInt(target.dataset.id);

		// Find the student in the list
		const student = studentsList.find(student => student.id === id);
		if (student) {
			// Set the form values for editing
			document.querySelector("#name").value = student.name;
			document.getElementById("email").value = student.email;
			document.getElementById("age").value = student.age;
			document.getElementById("gpa").value = student.gpa;
			document.getElementById("degree").value = student.degree;

			// Set the submit button placeholder to Edit Student
			document.getElementById("crudBtn").textContent = "Edit Student";

			// Set the currentEditId
			currentEditId = id;
		}
	} else if (target.classList.contains("delete-icon")) {
		// Get the row ID
		const id = parseInt(target.dataset.id);

		// Remove the student from the list
		const index = studentsList.findIndex(student => student.id === id);
		if (index !== -1) {
			studentsList.splice(index, 1);
		}

		// Remove the row from the table body
		const row = document.getElementById(`row-${id}`);
		row.remove();

		// Reset the IDs of the remaining rows
		const rows = tableBody.getElementsByTagName("tr");
		idCounter = 1;
		Array.from(rows).forEach(function(row) {
			row.id = `row-${idCounter}`;
			row.getElementsByTagName("td")[0].textContent = idCounter;
			row.querySelector(".edit-icon").dataset.id = idCounter;
			row.querySelector(".delete-icon").dataset.id = idCounter;
			idCounter++;
		});
	}
});

// Search functionality
searchBox.addEventListener("input", function() {
	const searchValue = searchBox.value.toLowerCase();
	const rows = tableBody.getElementsByTagName("tr");

	Array.from(rows).forEach(function(row) {
		const cells = row.getElementsByTagName("td");
		let isRowVisible = false;

		Array.from(cells).forEach(function(cell) {
			if (cell.textContent.toLowerCase().includes(searchValue)) {
				isRowVisible = true;
			}
		});

		if (isRowVisible) {
			row.style.display = "";
		} else {
			row.style.display = "none";
		}
	});
});
