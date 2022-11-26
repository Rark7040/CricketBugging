package gophertunnel

type AddressInfo struct {
	localIp  string
	remoteIp string
}

func NewAddr(local string, remote string) AddressInfo {
	return AddressInfo{
		localIp:  local,
		remoteIp: remote,
	}
}

func (addr AddressInfo) LocalIp() string {
	return addr.localIp
}

func (addr AddressInfo) RemoteIp() string {
	return addr.remoteIp
}
