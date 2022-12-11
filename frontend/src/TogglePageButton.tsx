import {createRoot} from "react-dom/client";
import App from "./App";
import {TogglePageProps} from "./Props";
import {TogglePageButtonStyle} from "./css/macaron/TogglePageButtonStyles";

export function TogglePageButton(props: TogglePageProps) {
    function togglePage(page: string){
        const container = document.getElementById('App');

        if(container === null) return;
        createRoot(container).render(<App page={page}/>);
    }

    return (
        <div id="TogglePageButton">
            <TogglePageButtonStyle onClick={() => togglePage(props.page)}>{props.btn_txt}</TogglePageButtonStyle>
        </div>
    );
}