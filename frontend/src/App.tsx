import './css/App.css';
import {LogDisplay} from "./log_display/LogDisplay";
import {RecoilRoot} from "recoil";

function App() {
    return (
        <RecoilRoot>
            <div id="App">
                <LogDisplay/>
            </div>
        </RecoilRoot>
    );
}

export default App
