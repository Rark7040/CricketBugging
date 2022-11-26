export function ScrollLog() {
    const log_container = document.getElementById("log-container");

    if(log_container !== null){
        log_container.scrollTop = log_container.scrollHeight;
    }
}