package gophertunnel

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
)

type AddressInfo struct {
	LocalAddress  string
	RemoteAddress string
}

func NewAddr(local string, remote string) AddressInfo {
	addr := AddressInfo{}
	addr.LocalAddress = local
	addr.RemoteAddress = remote
	return addr
}

func (addr AddressInfo) Save() error {
	jsonData, err := json.Marshal(addr)

	if err != nil {
		return err
	}
	err = ioutil.WriteFile("addr.json", jsonData, 0644)

	if err != nil {
		return err
	}
	return nil
}

func (addr AddressInfo) Load() (string, error) {
	jsonData, err := ioutil.ReadFile("addr.json")

	if err != nil {
		return "", err
	}
	var loadAddr AddressInfo
	err = json.Unmarshal(jsonData, &loadAddr)

	if err != nil {
		return "", err
	}
	return fmt.Sprintf("{%q: %q, %q: %q}", "LocalAddress", loadAddr.LocalAddress, "RemoteAddress", loadAddr.RemoteAddress), nil
}
