async function handlelogin(event) {
    event.preventDefault();
    let loginData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }
    try {
        const url = BASE_URL + routes.login;
        const data = await fetchReq(url,'POST', JSON.stringify(loginData));
        console.log("data login: ",data);
        if(data.success) {
            createToast(data.message,'fa-circle-check','green');
            runAfterDelay(() => {
                removeToast();
                setLocalStorageData("userId",data.id);
                setLocalStorageData("name",data.name);
                setLocalStorageData("token",data.token);
                redirectToPath('../components/welcome/welcome.html');
            }, 1500);
        }
        else{
            createToast(data.message,'fa-circle-xmark','red');
            runAfterDelay(removeToast, 1500);
        }
    } catch (error) {
        console.log("error: ", error)
    }
}