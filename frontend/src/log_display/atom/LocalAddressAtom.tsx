import {atom} from "recoil";

export const LocalAddressAtom = atom({
    key: "local_address",
    default: "0.0.0.0:19132"
});