import {createRoot} from "react-dom/client";
import App from "./App";
import {TogglePageProps} from "./Props";
import {toggle_page_button_style, toggle_page_button_theme} from "./css/vanilla/TogglePageButton.css";

export function TogglePageButton(props: TogglePageProps) {
    function togglePage(page: string){
        const container = document.getElementById('App');

        if(container === null) return;
        createRoot(container).render(<App page={page}/>);
    }

    return (
        <div id="TogglePageButton" className={toggle_page_button_theme}>
            <button className={toggle_page_button_style} onClick={() => togglePage(props.page)}>{props.btn_txt}</button>
        </div>
    );
}