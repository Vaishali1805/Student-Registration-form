function setLocalStorageData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getLocalStorageData(key) {
    const data = JSON.parse(localStorage.getItem(key));
    return data;
}

function redirectToPath(path) {
    window.location.href = path;
}

function runAfterDelay(callback, delay) {
    setTimeout(callback, delay);
}

function getParamsData(key) {
    const urlParams = new URLSearchParams(window.location.search);
    const data = urlParams.get(key);
    return data;
}

function showPopup(message, onConfirm, onCancel) {
    const popup = document.getElementById("confirmPopup");
    const popupMessage = document.getElementById("popupMessage");
    const confirmBtn = document.getElementById("confirmAction");
    const cancelBtn = document.getElementById("cancelAction");

    popupMessage.textContent = message;
    popup.style.display = "flex";

    confirmBtn.onclick = function () {
        onConfirm();
        popup.style.display = "none";
    };

    cancelBtn.onclick = function () {
        if (onCancel) onCancel();
        popup.style.display = "none";
    };
}

document.querySelectorAll('.form-outline .form-control').forEach((input) => {
    // Run on load
    if (input.value) {
        input.classList.add('active');
    }

    // Run on input change
    input.addEventListener('input', () => {
        if (input.value) {
            input.classList.add('active');
        } else {
            input.classList.remove('active');
        }
    });
});

function createToast(message, className1, color) {
    document.querySelector('.myToast').innerHTML =
        `<div class="toastDiv" style="--barColor: ${color}">
            <i class="fa-solid ${className1}" style="--iconColor: ${color}"></i>
            <span>${message}</span>
        </div>
        <i class="fa-solid fa-xmark" id="crossIcon"></i>`

    document.getElementById('crossIcon').addEventListener('click', () => {
        removeToast();
    })
}

function removeToast() {
    const toast = document.querySelector('.myToast');
    toast.classList.add('hide');
    toast.addEventListener('animationend', () => {
        toast.classList.remove('hide');
        toast.innerHTML = '';
    });
}

function showHide_Password(event) {
    const inputId = event.target.dataset.input;
    const input = document.getElementById(inputId);
    const isVisible = input.type === 'text';

    input.type = isVisible ? 'password' : 'text';
    event.target.src = isVisible ? '../assets/icons/eyeHide.svg' : '../assets/icons/eyeShow.svg';
}

async function fetchReq(url, reqMethod, formData = null) {
    try {
        const token = getLocalStorageData('token');
        // const headers = {
        //     'Content-Type': 'application/json'
        // };
        // if (token) {
        //     headers['Authorization'] = `Bearer ${token}`;
        // }
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
        const options = {
            method: reqMethod,
            headers,
            //credentials: 'include', // Ensures cookies are sent/received
        };
        // Only add body if method is not GET
        if (reqMethod.toUpperCase() !== "GET" && formData) {
            options.body = formData;
        }
        const response = await fetch(url, options);
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                redirectToPath('/auth/login.html');
            }
        }
        const data = await response.json();
        console.log("data: ", data);
        return data;
    } catch (error) {
        console.log("Error: ", error);
    }
}

async function checkLoginStatus() {
    const url = BASE_URL + routes.loginStatus;
    const data = await fetchReq(url,"POST");
    return data;
}