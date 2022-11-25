package gophertunnel

type GopherTunnel struct {
	running bool
}

func NewGopherTunnel() *GopherTunnel {
	return &GopherTunnel{
		running: false,
	}
}

func (tunnel *GopherTunnel) isRunning() bool {
	return tunnel.running
}
