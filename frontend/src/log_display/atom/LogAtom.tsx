import {atom} from "recoil";
import {LogMessage} from "../LogMessage";

export const LogAtom = atom<LogMessage[][]>({
    key: "log",
    default: []
});