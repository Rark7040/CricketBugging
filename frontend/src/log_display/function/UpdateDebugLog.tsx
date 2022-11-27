import {useRecoilState} from "recoil";
import {DebugAtom} from "../atom/DebugAtom";

export function UpdateDebugLog(new_log: string) {
    const [debug_log, setDebugLog] = useRecoilState(DebugAtom);
    setDebugLog(debug_log + "\n" + new_log);
}