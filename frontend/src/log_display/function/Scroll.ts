export function Scroll(element: string) {
    const log_container = document.getElementById(element);

    if(log_container !== null){
        log_container.scrollTop = log_container.scrollHeight;
    }
}