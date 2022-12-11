import {useRecoilState} from "recoil";
import {LocalAddressAtom} from "./recoil/atom/LocalAddressAtom";
import {RemoteAddressAtom} from "./recoil/atom/RemoteAddressAtom";
import {RunningAtom} from "./recoil/atom/RunnigAtom";
import React from "react";
import {
    AddressInputsBoxStyle, AddressInputStyle,
    AddressLabelStyle,
    RunningStatusStyle,
    RunningStatusWrapperStyle
} from "./css/macaron/AddressInputsStyle";

export function AddressesInputs() {
    const [local, setLocal] = useRecoilState(LocalAddressAtom);
    const [remote, setRemote] = useRecoilState(RemoteAddressAtom);
    const [is_running] = useRecoilState(RunningAtom);
    const updateLocal = (event: React.ChangeEvent<HTMLInputElement>) => setLocal(event.target.value);
    const updateRemote = (event: React.ChangeEvent<HTMLInputElement>) => setRemote(event.target.value);

    return (
        <div id="AddressesInputs">
            <AddressInputsBoxStyle id="input" className="address-inputs-box">
                <RunningStatusWrapperStyle>
                    <RunningStatusStyle id="running-status" color={is_running? 'running': 'stopped'} />
                </RunningStatusWrapperStyle>

                <AddressLabelStyle className="address-label"> LocalAddress </AddressLabelStyle>
                <AddressInputStyle id="local" onChange={updateLocal} autoComplete="off" name="input" value={local} type="text"/>

                <AddressLabelStyle className="address-label">RemoteAddress</AddressLabelStyle>
                <AddressInputStyle id="remote" onChange={updateRemote} autoComplete="off" name="input" value={remote} type="text"/>
            </AddressInputsBoxStyle>
        </div>
    );
}
