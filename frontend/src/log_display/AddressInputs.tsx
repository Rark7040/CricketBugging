import {SyntheticEvent, useState} from "react";

export function AddressesInputs() {
    const [local, setLocal] = useState("0.0.0.0:19132");
    const [remote, setRemote] = useState("s.mclife.pro:51091");
    // @ts-ignore
    const updateLocal = (event: SyntheticEvent) => setLocal(event.target.value);
    // @ts-ignore
    const updateRemote = (event: SyntheticEvent) => setRemote(event.target.value);

    return (
        <div id="AddressesInputs">
            <div id="input" className="inputs-box">
                <input id="local" className="input" onChange={updateLocal} autoComplete="off" name="input" value={local} type="text"/>
                <input id="remote" className="input" onChange={updateRemote} autoComplete="off" name="input" value={remote} type="text"/>
            </div>
        </div>
    );
}
