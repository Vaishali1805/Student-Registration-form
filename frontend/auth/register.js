fields.forEach(field => {
    elements[field] = document.getElementById(field);
    elements[`${field}Err_msg`] = document.getElementById(`${field}Err_msg`);
});

function validate_form() {
    const errors = {};
    const nameVal = elements.studentName.value.trim();
    const emailVal = elements.email.value.trim();
    const passwordVal = elements.password.value.trim();
    const confirmPasswordVal = elements.confirmPassword.value.trim();
    const roleSelected = document.querySelector('input[name="role"]:checked');

    errors.studentName = !nameVal ? "*Name is required" : (nameVal.length < 2 || nameVal.length > 30) ? "*Name must be between 2 and 30 characters" : "";
    errors.email = !emailVal ? "*Email is required" : !EmailRegex.test(emailVal) ? '*Invalid email address' : "";
    errors.password = passwordVal.length < 6 ? 'Password must be at least 6 characters'
        : !PasswordRegex.test(passwordVal) ? 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@ . # $ ! % * ? &)' : '';
    errors.confirmPassword = !(confirmPasswordVal === passwordVal) ? "*Confirm password must match the password." : "";
    errors.role = !roleSelected ? '*Role is required' : "";

    return errors;
}

function handleFieldValidation(event) {
    const errors = validate_form();
    // console.log("event.target.id: ", event.target.id);
    display_error(elements[`${event.target.id}Err_msg`], errors[event.target.id]);
}

function display_error(element, error) {
    element.textContent = error;
}

async function handleSubmit(e) {
    e.preventDefault();
    try {
        const errors = validate_form();
        fields.forEach(field => {
            const fakeEvent = { target: { id: field } };
            handleFieldValidation(fakeEvent)
        });
        const isValid = Object.values(errors).every(msg => msg === "");
        if (isValid) {
            let signUpData = {
                name: studentName.value,
                email: (email.value).toLowerCase(),
                password: password.value,
                role: document.querySelector('input[name="role"]:checked').value,
            }
            const url = BASE_URL + routes.register;
            const data = await fetchReq(url, 'POST', JSON.stringify(signUpData));
            if (data.success) {
                createToast(data.message, 'fa-circle-check', 'green');
                runAfterDelay(() => {
                    removeToast();
                    window.location.href = './login.html';
                }, 1500);
            } else {
                createToast(data.message, 'fa-circle-xmark', 'red');
                runAfterDelay(removeToast, 1500);
            }
        } else {
            console.log("Form has errors:", errors);
        }
    } catch (error) {
        console.log("error: ", error)
    }
}