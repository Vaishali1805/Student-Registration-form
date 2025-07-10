document.addEventListener('DOMContentLoaded',renderName());

async function renderName() {
    const data = await checkLoginStatus();
    if(data.success){
        document.getElementById('name').textContent = `Welcome ${getLocalStorageData('name')}`;
    }
}