import './css/App.css';
import {LogDisplay} from "./log_display/LogDisplay";
import {MutableSnapshot, RecoilRoot} from "recoil";
import {LocalAddressAtom} from "./log_display/recoil/atom/LocalAddressAtom";
import {RemoteAddressAtom} from "./log_display/recoil/atom/RemoteAddressAtom";
import {LoadAddress} from "../wailsjs/go/main/WailsBinds";
import React, {useState} from "react";
import {PageProps} from "./Props";
import {PagesEnum} from "./PagesEnum";
import {UndefinedPageError} from "./UndefinedPageError";
import {Setting} from "./setting/Setting";

export default function App(props: PageProps) {
    const [updateKey, setUpdateKey] = useState(0);

    function initState({set}: MutableSnapshot) {
        LoadAddress().then((addr_json) => {
            const addr = JSON.parse(addr_json);

            set(LocalAddressAtom, addr.LocalAddress);
            set(RemoteAddressAtom, addr.RemoteAddress);
            setUpdateKey(updateKey + 1);
        });
    }

    function getPage(page: string): JSX.Element {
        switch (page) {
            case PagesEnum.LOG_DISPLAY:
                return <LogDisplay />;

            case PagesEnum.SETTING:
                return <Setting />;

            default:
                throw new UndefinedPageError(page);
        }
    }

    return (
        <RecoilRoot initializeState={initState}>
            <div id="App">
                {getPage(props.page)}
            </div>
        </RecoilRoot>
    );
}