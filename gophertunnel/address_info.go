package gophertunnel

type AddressInfo struct {
	Connection struct {
		LocalAddress  string
		RemoteAddress string
	}
}

func NewAddr(local string, remote string) AddressInfo {
	addr := AddressInfo{}
	addr.Connection.LocalAddress = local
	addr.Connection.RemoteAddress = remote
	return addr
}
