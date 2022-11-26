import {SyntheticEvent} from "react";
import {useRecoilState} from "recoil";
import {LocalAddressAtom} from "./atom/LocalAddressAtom";
import {RemoteAddressAtom} from "./atom/RemoteAddressAtom";
import "./css/AddressInputs.css";

export function AddressesInputs() {
    const [local, setLocal] = useRecoilState(LocalAddressAtom);
    const [remote, setRemote] = useRecoilState(RemoteAddressAtom);
    // @ts-ignore
    const updateLocal = (event: SyntheticEvent) => setLocal(event.target.value);
    // @ts-ignore
    const updateRemote = (event: SyntheticEvent) => setRemote(event.target.value);

    return (
        <div id="AddressesInputs">
            <div id="input" className="address-inputs-box">
                <input id="local" className="input" onChange={updateLocal} autoComplete="off" name="input" value={local} type="text"/>
                <input id="remote" className="input" onChange={updateRemote} autoComplete="off" name="input" value={remote} type="text"/>
            </div>
        </div>
    );
}
