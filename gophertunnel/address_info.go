package gophertunnel

type AddressInfo struct {
	localIp  string
	remoteIp string
}

func NewAddr(local string, remote string) *AddressInfo {
	return &AddressInfo{
		localIp:  local,
		remoteIp: remote,
	}
}

func (addr *AddressInfo) GetLocalIp() string {
	return addr.localIp
}

func (addr *AddressInfo) GetRemoteIp() string {
	return addr.remoteIp
}
