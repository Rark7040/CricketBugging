import './css/App.css';
import {LogDisplay} from "./log_display/LogDisplay";
import {MutableSnapshot, RecoilRoot} from "recoil";
import {LocalAddressAtom} from "./log_display/recoil/atom/LocalAddressAtom";
import {RemoteAddressAtom} from "./log_display/recoil/atom/RemoteAddressAtom";
import {LoadAddress} from "../wailsjs/go/main/WailsBinds";
import React, {useState} from "react";
import {Props} from "./Props";
import {PagesEnum} from "./PagesEnum";
import {UndefinedPageError} from "./UndefinedPageError";

export default function App(props: Props) {
    const [updateKey, setUpdateKey] = useState(0);

    function initState({set}: MutableSnapshot) {
        LoadAddress().then((addr_json) => {
            const addr = JSON.parse(addr_json);

            set(LocalAddressAtom, addr.LocalAddress);
            set(RemoteAddressAtom, addr.RemoteAddress);
            setUpdateKey(updateKey + 1);
        });
    }

    function getPage(props: Props): JSX.Element {
        switch (props.page) {
            case PagesEnum.LOG_DISPLAY:
                return <LogDisplay page={PagesEnum.LOG_DISPLAY}/>;

            case PagesEnum.SETTING:
                return <LogDisplay page={PagesEnum.SETTING}/>;

            default:
                throw new UndefinedPageError(props.page);
        }
    }

    return (
        <RecoilRoot initializeState={initState}>
            <div id="App">
                {getPage(props)}
            </div>
        </RecoilRoot>
    );
}