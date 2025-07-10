const rowContainer = document.getElementById("rowContainer");
const registerBtn = document.getElementById("registerBtn");
const deleteBtn = document.getElementById("deleteBtn");
const mainCheckBox = document.getElementById("mainCheckBox");
const selectedIds = new Set();

// Event: Register new student
registerBtn.addEventListener("click",() => {
    window.location.href = "../form/form.html";
});

// Event: Bulk delete
deleteBtn.addEventListener("click", () => handleDelete(null));

// Event: Toggle select all checkboxes
mainCheckBox.addEventListener("change", check_uncheck_all);

// Event: Toggle individual checkbox
rowContainer.addEventListener("change", (event) => {
    if (event.target && event.target.classList.contains("check")) {
        const checkbox = event.target;
        const studentId = Number(checkbox.closest("tr").dataset.id);
        checkbox.checked ? selectedIds.add(studentId) : selectedIds.delete(studentId);
        updateMainCheckbox_State();
    }
});

// Fetch and display student data
async function getStudentData() {
    try {
        const url = BASE_URL + routes.getStudentData;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const data = await response.json();
        renderStudentRows(data);
    } catch (error) {
        console.log("Error: ", error);
    }
}

function renderStudentRows(data) {
    const { countries, states, cities, studentData } = data;
    console.log("studentData:", studentData);
    rowContainer.innerHTML = "";
    selectedIds.clear();  // Reset selection
    mainCheckBox.checked = false;

    studentData.map((obj, index) => {
        const newRow = document.createElement("tr");
        newRow.dataset.id = obj.id; // Add data attribute for easy access
        const fileUrl = obj.profilePath ? `http://localhost:5000/${obj.profilePath}` : '/assets/images/defaultImage.webp' // Use default image if not available

        // Extract names of country,state and city
        const countryName = countries.find((c) => c.id == obj.country)?.name || "-";
        const stateName = states.find((s) => s.id == obj.state)?.name || "-";
        const cityName = cities.find((c) => c.id == obj.city)?.name || "-";

        //Without += overwriting the newRow's inner content after appending the checkbox
        newRow.innerHTML += `
            <td><input type="checkbox" name="select" class="check" /></td>
            <td>${index + 1}</td>
            <td><img src=${fileUrl} class="userImg" alt="user-image" /></td>
            <td>${obj.firstName || "-"}</td>
            <td>${obj.lastName || "-"}</td>
            <td>${obj.email || "-"}</td>
            <td>${obj.contactNo || "-"}</td>
            <td>${obj.dateOfBirth || "-"}</td>
            <td>${obj.studentId || "-"}</td>
            <td>${obj.gender || "-"}</td>
            <td>${obj.address || "-"}</td>
            <td>${obj.country ? countryName : "-"}</td>
            <td>${obj.state ? stateName : "-"}</td>
            <td>${obj.city ? cityName : "-"}</td>
            <td><img src='/assets/icons/edit.svg' class="editIcon" alt="edit-icon" onclick="editStudentData(${obj.id})" /><img src='/assets/icons/delete.svg' class="deleteIcon" alt="delete-icon" onclick="handleDelete(${obj.id})" /></td>
        `;

        // Add row to DOM
        rowContainer.appendChild(newRow);
    });
}

function updateMainCheckbox_State() {
    const checkBoxes = document.getElementsByClassName("check");
    mainCheckBox.checked = checkBoxes.length > 0 && selectedIds.size === checkBoxes.length;
}

//Handle main checkBox toggle
function check_uncheck_all() {
    const checkBoxes = document.querySelectorAll(".check");
    const checkAll = mainCheckBox.checked;
    checkBoxes.forEach((checkbox) => {
        checkbox.checked = checkAll;
        const studentId = Number(checkbox.closest("tr").dataset.id);
        checkAll ? selectedIds.add(studentId) : selectedIds.delete(studentId);
    });
}

function handleDelete(studentId = null) {
    const popup = document.getElementById("confirmPopup");
    popup.style.display = "flex";

    document.getElementById("confirmDelete").onclick = function () {
        deleteStudent(studentId);
        popup.style.display = "none"; // Close popup after confirming
    };

    document.getElementById("cancelDelete").onclick = function () {
        popup.style.display = "none"; // Close popup without deleting
    };
}

async function deleteStudent(studentId) {
    try {
        let idsToDelete = studentId ? [studentId] : Array.from(selectedIds);

        const url = BASE_URL + routes.deleteRecord;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ studentIds : idsToDelete }),
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
            getStudentData();
            if (!studentId) selectedIds.clear();
        }
        // data.success && (getStudentData())
    } catch (error) {
        console.error("Error: ", error);
    }
}

// Navigate to edit form
function editStudentData(id) {
    window.location.href = `../form/form.html?id=${id}`;
}

// Initial load
getStudentData();