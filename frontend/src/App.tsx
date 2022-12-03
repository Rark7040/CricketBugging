import './css/App.css';
import {LogDisplay} from "./log_display/LogDisplay";
import {MutableSnapshot, RecoilRoot} from "recoil";
import {LocalAddressAtom} from "./log_display/recoil/atom/LocalAddressAtom";
import {RemoteAddressAtom} from "./log_display/recoil/atom/RemoteAddressAtom";
import {LoadAddress} from "../wailsjs/go/main/WailsBinds";
import React, {useState} from "react";

export default function App() {
    const [updateKey, setUpdateKey] = useState(0);

    function init({set}: MutableSnapshot) {
        LoadAddress().then((addr_json) => {
            const addr = JSON.parse(addr_json);

            set(LocalAddressAtom, addr.LocalAddress);
            set(RemoteAddressAtom, addr.RemoteAddress);
            setUpdateKey(updateKey + 1);
        });
    }

    return (
        <RecoilRoot initializeState={init}>
            <div id="App">
                <LogDisplay/>
            </div>
        </RecoilRoot>
    );
}