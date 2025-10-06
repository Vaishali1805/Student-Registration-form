// Get form input elements from the DOM
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const nameError_msg = document.getElementById("nameError");
const lastNameError_msg = document.getElementById("lastNameError");

// Profile picture upload elements
const inputProfile = document.getElementById("inputProfile");
const inputProfileBtn = document.getElementById("inputProfileBtn");
const preview = document.getElementById("preview");
const profileError_msg = document.getElementById("profileError");

// Other form fields and their error messages
const email = document.getElementById("inputEmail");
const emailError_msg = document.getElementById("emailError");
const contactNo = document.getElementById("contactNo");
const contactNoError_msg = document.getElementById("contactNoError");
const dateOfBirth = document.getElementById("dateOfBirth");
const dobError_msg = document.getElementById("dobError");
const studentId = document.getElementById("studentId");
const studentIdError_msg = document.getElementById("studentId_error");
const radios = document.querySelectorAll('input[name="gender"]');
const genderError_msg = document.getElementById("genderError");
const address = document.getElementById("address");
const addressError_msg = document.getElementById("addressError");
const countryError_msg = document.getElementById("countryError");

// Country, state, and city selection elements
const selectCountry = document.getElementById("inputCountry");
const selectState = document.getElementById("inputState");
const selectCity = document.getElementById("inputCity");
const api_key = "TUNvRDM2cXJkWkZ1cURYODlqWWJQc2lXb0YzNDZPUWtpY2JsOERieg==";

const submitBtn = document.getElementById("submitBtn");
const terms_Condn_check = document.getElementById("terms_Condn_check");
let countryId;
let selectedGender;
let lastSelectedFile = null;
let studentData = [];
let profileDeleted = false;
const EmailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PhoneRegex = /^(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/;

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

radios.forEach((radio) => {
  radio.addEventListener("change", () => {
    validate_gender();
    radio.checked ? selectedGender = radio.value : "";
  });
});

!terms_Condn_check.checked ? submitBtn.disabled = true : submitBtn.disabled = false;
terms_Condn_check.addEventListener("change", function () {
  submitBtn.disabled = this.checked ? false : true;
});

firstName.addEventListener('blur', validate_FirstName);
lastName.addEventListener('input', validate_LastName);
email.addEventListener('input', validate_Email);
contactNo.addEventListener('input', validate_contactNo);
dateOfBirth.addEventListener('input', validate_dateOfBirth);
studentId.addEventListener('blur', validate_studentId);
selectCountry.addEventListener('blur', validate_country);

// Handle form submission
submitBtn.addEventListener("click", (e) => {
  id ? handleEditForm(e) : handleSubmit(e);
});

//Function to submit the form
async function handleSubmit(event) {
  try {    
    event.preventDefault();
    // Validate form before proceeding
    if (!validate_form()) return;
    const formData = handleProfile();
    // submit the student data
    const url = BASE_URL + routes.submitFormData;
    const result = await fetchReq(url, "POST", formData);
    result && (window.location.href = "../table/table.html");
  } catch (error) {
    console.log("Error: ", error);
  }
}

//Function to edit the form
async function handleEditForm(event) {
  try {
    event.preventDefault();
    // Validate form before proceeding
    if (!validate_form()) return;
    const updatedData = new FormData();
    const currentData = create_FormDataObj();
    const oldData = studentData;
    console.log("🚀 ~ handleEditForm ~ currentData:", currentData)
    console.log("🚀 ~ handleEditForm ~ oldData:", oldData)

    //object.entries convert the obj in array
    Object.entries(currentData).forEach(([key, value]) => {
      if (value !== oldData[key]) updatedData.append(key, value);
    });

    if (lastSelectedFile) {
      const safeName = lastSelectedFile.name.replace(/\s+/g, '_');
      updatedData.append("profile", lastSelectedFile, `${Date.now()}_${safeName}`);
    } else if (profileDeleted) {
      updatedData.append("profile", "null");
    }
    
    // const url = `http://localhost:5000/user/edit/formData?id=${id}`;
    const url = `${BASE_URL}${routes.editFormData}?id=${id}`;
    const result = await fetchReq(url, "POST", updatedData)
    result && (window.location.href = "../table/table.html");
  } catch (error) {
    console.log("Error: ", error);
  }
}

function handleProfile() {
  const formDataObj = create_FormDataObj();

    // Handle Profile Picture
    const formData = new FormData();
    if (lastSelectedFile) {
      const safeName = lastSelectedFile.name.replace(/\s+/g, '_');
      formData.append("profile", lastSelectedFile, `${Date.now()}_${safeName}`);
    }
    formData.append("formData", JSON.stringify(formDataObj));
    return formData;
}

function create_FormDataObj() {
  const formDataObj = {
    firstName: firstName.value || null,
    lastName: lastName.value || null,
    email: email.value || null,
    contactNo: contactNo.value || null,
    dateOfBirth: dateOfBirth.value || null,
    studentId: Number(studentId.value) || null,
    gender: selectedGender || null,
    address: address.value || null,
    country: selectCountry && selectCountry.value ? Number(selectCountry.value) : null,
    state: selectState && selectState.value ? Number(selectState.value) : null,
    city: selectCity && selectCity.value ? Number(selectCity.value) : null,
  };
  return formDataObj;
}

function setError(element, message) {
  element.textContent = message;
}

function validate_FirstName() {
  const name = firstName.value.trim();
  const error = name === "" ? "*First name is required" : (name.length < 2 || name.length > 30) ? "*First name must be between 2 and 30 characters" : "";
  error ? setError(nameError_msg, error) : nameError_msg.textContent = "";
}

function validate_LastName() {
  const name = lastName.value.trim();
  const error = (name && (name.length < 2 || name.length > 30)) ? "*Last name must be between 2 and 30 characters" : "";
  error ? setError(lastNameError_msg,error) : lastNameError_msg.textContent = "";
}

function validate_Email() {
  const Email = email.value.trim(); 
  const error = Email === "" ? "*Email is required" : !EmailRegex.test(Email) ? '*Invalid email address' : "";
  error ? setError(emailError_msg, error) : emailError_msg.textContent = "";
}

function validate_contactNo() {
  const ContactNo = contactNo.value.trim();
  const error = ContactNo === "" ? "*Contact number is required" : !PhoneRegex.test(ContactNo) ? '*Invalid contact number' : "";
  error ? setError(contactNoError_msg, error) : contactNoError_msg.textContent = "";
}

function validate_dateOfBirth() {
  const dobDate = new Date(dateOfBirth.value);
  const today = new Date();
  const dob = dateOfBirth.value;
  const error = !dob || isNaN(Date.parse(dob)) ? "*Invalid date of birth" : (dobDate > today) ? "*Date of birth cannot be in the future" : "";
  error ? setError(dobError_msg,error) : dobError_msg.textContent = "";
}

function validate_studentId() {
  const StudentId = studentId.value.trim();
  StudentId === "" ? setError(studentIdError_msg, "*Student ID is required") : studentIdError_msg.textContent = "";
}

function validate_gender() {
  const selectedRadio = document.querySelector('input[name="gender"]:checked');
  !selectedRadio ? setError(genderError_msg, "*Gender is required") : genderError_msg.textContent = "";
}

function validate_country() {
  !selectCountry.value ? setError(countryError_msg, "*Country is required") : countryError_msg.textContent = "";
}

function validate_form() {
  let flag = true;

  validate_FirstName();
  validate_LastName();
  validate_Email();
  validate_contactNo();
  validate_dateOfBirth();
  validate_studentId();
  validate_gender();
  validate_country();

  const errorFields = [
    nameError_msg,
    lastNameError_msg,
    emailError_msg,
    contactNoError_msg,
    dobError_msg,
    studentIdError_msg,
    genderError_msg,
    countryError_msg
  ];

  errorFields.forEach(error => {
    if (error.textContent !== "") flag = false;
  });

  return flag;
}

// Profile picture upload event
inputProfileBtn.addEventListener("click", (e) => {
  if (inputProfile) {
    inputProfile.click();
  }
  e.preventDefault();
},
  false //prevent navigation to "#"
);

inputProfile.addEventListener("change", handleFileSelection);

function handleFileSelection(event) {
  let file = event.target.files[0];
  if (file) {
    if (validateFile(file)) {
      lastSelectedFile = file;
      const fileUrl = URL.createObjectURL(file);+
      previewImg(fileUrl);
    } else {
      preview.innerHTML = '';
      lastSelectedFile = null;
      inputProfile.value = "";
    }
  }
}

function previewImg(url) {
  preview.innerHTML = `<div class="fileContainer">
    <img src='/assets/icons/cross2.svg' class="crossImg" alt="delete" onclick="deleteImg()"></img>
    <img src=${url} class="setImg" alt="image preview"></img>
  </div>`;
}

function deleteImg() {
  inputProfile.value = "";
  preview.innerHTML = "";
  lastSelectedFile = null;
  profileDeleted = true;
}

function validateFile(file) {
  if (!file) {
    return false;
  }

  const validTypes = ["image/jpeg", "image/png", "image/jpg"];

  const maxSize = 5 * 1024 * 1024; //5MB
  if (!validTypes.includes(file.type)) {
    profileError_msg.textContent =
      "Invalid file type. Please select an image (JPG, JPEG, PNG)";
    return false;
  } else {
    profileError_msg.textContent = "";
  }

  if (file.size > maxSize) {
    profileError_msg.textContent =
      "File size exceeds 5MB. Please select a smaller image";
    return false;
  } else {
    profileError_msg.textContent = "";
  }
  return true;
}

// Fetch and populate country, state, and city dropdowns
document.addEventListener("DOMContentLoaded", () => {
  id ? getData(id) : fetchAndPopulate('countries');

  selectCountry.addEventListener("change", function () {
    countryId = this.value;
    resetDropdown(selectState, 'State');
    resetDropdown(selectCity, 'City');
    fetchAndPopulate('states', { countryId });
  });

  selectState.addEventListener("change", function () {
    const stateId = this.value;
    resetDropdown(selectCity, 'City');
    fetchAndPopulate('cities', { countryId, stateId });
  });
});

// Reset dropdown helper
function resetDropdown(dropdown, label) {
  dropdown.innerHTML = `<option value="">Select ${label}</option>`;
}

async function fetchAndPopulate(type, params = {}) {
  try {
    console.log("am in");
    params.type = type;
    let query = new URLSearchParams(params).toString();
    // const url = `http://localhost:5000/user/get/locationData?${query}`;
    const url = `${BASE_URL}${routes.getLocationData}?${query}`;
    const data = await fetchReq(url, "GET");

    const elementMap = {
      countries: selectCountry,
      states: selectState,
      cities: selectCity,
    };

    if (data && data[type]) {
      await createOptions(data[type], elementMap[type], type);
      return true;
    }
  } catch (error) {
    console.log(`Error loading ${type}:`, error);
  }
}

//Dropdown option creator
async function createOptions(data, element, name) {
  element.innerHTML = !data.length
    ? `<option value="">No ${name} available</option>`
    : `<option value="">Select ${name}</option>`;

  data.map(({ id, name }) => {
    element.innerHTML += `<option value="${id}">${name}</option>`;
  });
}

async function fetchReq(url, reqMethod, formData = null) {
  try {
    const options = {
      method: reqMethod,
    };
    // Only add body if method is not GET
    if (reqMethod.toUpperCase() !== "GET" && formData) {
      options.body = formData;
    }
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const data = await response.json();
    if (data.success) {
      if (reqMethod.toUpperCase() !== "GET")
        return true;
      else
        return data;
    }
  } catch (error) {
    console.log("Error: ", error);
  }
}

function appendData(data) {
  try {
    firstName.value = data?.firstName || "";
    lastName.value = data?.lastName || "";
    email.value = data?.email || "";
    contactNo.value = data?.contactNo || "";
    dateOfBirth.value = data?.dateOfBirth || "";
    studentId.value = data?.studentId || "";
    address.value = data?.address || "";

    radios.forEach((radio) => {
      if (radio.value === data?.gender) {
        selectedGender = radio.value;
        radio.checked = true;
      }
    });

    // Handle Profile Image Preview
    preview.innerHTML = ""; //to remove the old preview
    
    profileDeleted = false;
    const fileUrl = data.profilePath ? `http://localhost:5000/${data?.profilePath}` : '/assets/images/defaultImage.webp'
    previewImg(fileUrl);

    selectOption(selectCountry, data?.country || "");
    selectOption(selectState, data?.state || "");
    selectOption(selectCity, data?.city || "");
  } catch (error) {     
    console.error("Error: ", error);
  }
}

async function selectOption(element, selectedId) {
  const optionArr = Array.from(element.options);
  optionArr.map(option => option.value === String(selectedId) ? option.selected = true : null);   //option.value always be string
}

async function getData(id) {
  try {
    // const url = `http://localhost:5000/user/get/dataById?id=${id}`;
    const url = `${BASE_URL}${routes.getDataById}?id=${id}`;
    const data = await fetchReq(url, "GET");
    if (data.success) {
      // const { studentData } = data;
      studentData = data.studentData;
      console.log("studentData: ", studentData);
      const countryId = studentData.country;
      const stateId = studentData.state;
      Promise.all([fetchAndPopulate('countries'), fetchAndPopulate('states', { countryId }), fetchAndPopulate('cities', { countryId, stateId })])
        .then(() => appendData(studentData))
        .catch((err) => console.log("Error: ", err))
    }
  } catch (error) {
    console.log("Error: ",error);
  }
}