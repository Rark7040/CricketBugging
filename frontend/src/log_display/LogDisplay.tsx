import {Header} from "./Header";
import {Body} from "./Body";
import "./css/LogDisplay.css";
import {Debug} from "./Debug";

export function LogDisplay() {
    return (
        <div id="LogDisplay">
            <Header/>
            <Body/>
            <Debug/>
        </div>
    );
}