import {Header} from "./Header";
import {Body} from "./Body";
import {PageProps} from "../Props";

export function LogDisplay(props: PageProps) {
    return (
        <div id="LogDisplay">
            <Header/>
            <Body/>
        </div>
    );
}