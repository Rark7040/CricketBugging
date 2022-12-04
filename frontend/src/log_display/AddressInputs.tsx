import {SyntheticEvent, useEffect} from "react";
import {useRecoilState} from "recoil";
import {LocalAddressAtom} from "./recoil/atom/LocalAddressAtom";
import {RemoteAddressAtom} from "./recoil/atom/RemoteAddressAtom";
import "./css/AddressInputs.css";
import {RunningAtom} from "./recoil/atom/RunnigAtom";

export function AddressesInputs() {
    const [local, setLocal] = useRecoilState(LocalAddressAtom);
    const [remote, setRemote] = useRecoilState(RemoteAddressAtom);
    const [is_running] = useRecoilState(RunningAtom);
    // @ts-ignore
    const updateLocal = (event: SyntheticEvent) => setLocal(event.target.value);
    // @ts-ignore
    const updateRemote = (event: SyntheticEvent) => setRemote(event.target.value);

    useEffect(() => {
        const running_status = document.getElementById("running-status");
        if(running_status === null) return;
        if(is_running){
            running_status.style.backgroundColor = "#6cff56";

        }else{
            running_status.style.backgroundColor = "#ff3c3c";
        }
    }, [is_running]);

    return (
        <div id="AddressesInputs">
            <div id="input" className="address-inputs-box">
                <div id="running-status-container" className="running-status-container">
                   <div id="running-status" className="running-status"/>
                </div>
                <div className="address-label">LocalAddress</div>
                <input id="local" className="input" onChange={updateLocal} autoComplete="off" name="input" value={local} type="text"/>
                <div className="address-label">RemoteAddress</div>
                <input id="remote" className="input" onChange={updateRemote} autoComplete="off" name="input" value={remote} type="text"/>
            </div>
        </div>
    );
}
