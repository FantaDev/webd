const greeting = document.querySelector('.greeting');

window.onload = () => {
    if(!sessionStorage.name){
        location.href = '/login';
    } else{
        greeting.textContent = `Logged in as: ${sessionStorage.name}`;
    }
}

const logOut = document.querySelector('.logout-button');

logOut.onclick = () => {
    sessionStorage.clear();
    location.reload();
}