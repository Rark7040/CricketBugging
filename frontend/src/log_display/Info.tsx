import {useEffect, useState} from "react";
import {RunningAtom} from "./recoil/atom/RunnigAtom";
import {useRecoilState} from "recoil";
import "./css/Info.css";
import {AutoScrollAtom} from "./recoil/atom/AutoScrollAtom";
import {LocalAddressAtom} from "./recoil/atom/LocalAddressAtom";
import {RemoteAddressAtom} from "./recoil/atom/RemoteAddressAtom";

export function Info(){
    const [is_running] = useRecoilState(RunningAtom);
    const [auto_scroll_info, setAutoScrollInfo] = useState("auto scroll: 有効");
    const [is_enabled_scroll] = useRecoilState(AutoScrollAtom);
    const [local_addr_info, setLocalAddrInfo] = useState("local address: ---");
    const [local_addr] = useRecoilState(LocalAddressAtom);
    const [remote_addr_info, setRemoteAddrInfo] = useState("remote address: ---");
    const [remote_addr] = useRecoilState(RemoteAddressAtom);

    function toggleAutoScrollInfo(isEnable: boolean) {
        if(isEnable){
            setAutoScrollInfo("auto scroll: 有効");
        }else{
            setAutoScrollInfo("auto scroll: 無効");
        }
    }

    function updateLocalAddrInfo(isEnable: boolean){
        if(isEnable){
            setLocalAddrInfo("local address: " + local_addr);

        }else{
            setLocalAddrInfo("local address: ---");
        }
    }

    function updateRemoteAddrInfo(isEnable: boolean){
        if(isEnable){
            setRemoteAddrInfo("remote address: " + remote_addr);

        }else{
            setRemoteAddrInfo("remote address: ---");
        }
    }

    useEffect(() => {
        updateLocalAddrInfo(is_running);
        updateRemoteAddrInfo(is_running);
    }, [is_running]);

    useEffect(() => {
        toggleAutoScrollInfo(is_enabled_scroll);
    }, [is_enabled_scroll]);

    return (
      <div className="Info">
          <div className="info-board">
              <ul>
                  <li>{auto_scroll_info}</li>
                  <li>{local_addr_info}</li>
                  <li>{remote_addr_info}</li>
              </ul>
          </div>
      </div>
    );
}