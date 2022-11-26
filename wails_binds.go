package main

import (
	"cricketbugging/gophertunnel"
	"cricketbugging/utils/log"
)

// WailsBinds if you'll bind functions to in frontend,
//define functions to in this struct
type WailsBinds struct {
	tunnel *gophertunnel.GopherTunnel
}

func NewBinds() *WailsBinds {
	return &WailsBinds{
		gophertunnel.NewTunnel(),
	}
}

func (b *WailsBinds) RunGopherTunnel(local string, remote string) {
	b.tunnel.Run(gophertunnel.NewAddr(local, remote))
}

func (b *WailsBinds) KillGopherTunnel() {
	b.tunnel.Kill()
}

func (b WailsBinds) IsRunningGopherTunnel() bool {
	return b.tunnel.Running()
}

func (b *WailsBinds) Logging(m string) {
	b.tunnel.Logger().Logging(log.NewMsgNoContent(m))
}

func (b WailsBinds) NeedsUpdate(p int) bool {
	return b.tunnel.Logger().NeedsUpdate(p)
}

func (b WailsBinds) GetTitle(id int) string {
	return b.tunnel.Logger().Title(id)
}

func (b WailsBinds) GetContent(id int) string {
	return b.tunnel.Logger().Content(id)
}
