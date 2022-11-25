package gophertunnel

import (
	"cricket-bugging/utils/log"
	"github.com/davecgh/go-spew/spew"
	"github.com/pkg/errors"
	"github.com/sandertv/gophertunnel/minecraft"
	"github.com/sandertv/gophertunnel/minecraft/protocol/packet"
	"golang.org/x/oauth2"
	"sync"
)

type GopherTunnel struct {
	running bool
	logger  log.Logger
}

func NewTunnel() *GopherTunnel {
	return &GopherTunnel{
		running: false,
		logger:  log.NewLogger(),
	}
}

func (t GopherTunnel) IsRunning() bool {
	return t.running
}

func (t *GopherTunnel) Kill() {
	t.running = false
}

func (t *GopherTunnel) GetLogger() *log.Logger {
	return &t.logger
}

func (t *GopherTunnel) Listen(pk packet.Packet) {
	switch p := pk.(type) {
	case *packet.AddItemActor:
		t.GetLogger().Logging(
			log.NewMsg(
				"AddItemActor",
				spew.Sdump(p),
			),
		)
	}
}

func (t *GopherTunnel) RunGopherTunnel(local string, remote string) {
	t.running = true
	addr := NewAddr(local, remote)
	tkn := genToken(t.GetLogger())

	p, err := minecraft.NewForeignStatusProvider(addr.GetRemoteIp())
	if err != nil {
		panic(err)
	}
	listener, err := minecraft.ListenConfig{
		StatusProvider: p,
	}.Listen("raknet", addr.GetLocalIp())

	if err != nil {
		panic(err)
	}
	t.logger.Logging(log.NewMsgNoContent("done!"))

	go func() {
		defer listener.Close()
		defer t.logger.Logging(log.NewMsgNoContent("gophertunnel stopped"))
		for {
			if !t.IsRunning() {
				return
			}
		}
	}()
	for { // on login
		c, err := listener.Accept()
		if !t.IsRunning() {
			return
		}
		if err != nil {
			panic(err)
		}
		go t.handleConn(c.(*minecraft.Conn), listener, addr, tkn)
	}
}

func (t *GopherTunnel) handleConn(conn *minecraft.Conn, listener *minecraft.Listener, addr AddressInfo, tkn oauth2.TokenSource) {
	serverConn, err := minecraft.Dialer{
		TokenSource: tkn,
		ClientData:  conn.ClientData(),
	}.Dial("raknet", addr.GetRemoteIp())

	if err != nil {
		panic(err)
	}
	var g sync.WaitGroup
	g.Add(2)
	go func() {
		if err := conn.StartGame(serverConn.GameData()); err != nil {
			if !t.IsRunning() {
				return
			}
			//on stop join progress
			t.logger.Logging(log.NewMsgNoContent("login cancelled"))
		}
		g.Done()
	}()
	go func() {
		if err := serverConn.DoSpawn(); err != nil {
			if !t.IsRunning() {
				return
			}
			panic(err)
		}
		g.Done()
	}()
	g.Wait()
	if !t.IsRunning() {
		return
	}

	go func() {
		defer listener.Disconnect(conn, "connection lost")
		defer serverConn.Close()
		for {
			if !t.IsRunning() {
				return
			}
			pk, err := conn.ReadPacket()
			t.Listen(pk)

			if err != nil {
				return
			}
			if err := serverConn.WritePacket(pk); err != nil {
				if disconnect, ok := errors.Unwrap(err).(minecraft.DisconnectError); ok {
					_ = listener.Disconnect(conn, disconnect.Error())
				}
				return
			}
		}
	}()

	go func() {
		defer serverConn.Close()
		defer listener.Disconnect(conn, "connection lost")
		defer t.logger.Logging(log.NewMsgNoContent("disconnected"))
		for {
			if !t.IsRunning() {
				return
			}
			pk, err := serverConn.ReadPacket()
			t.Listen(pk)

			if err != nil {
				if disconnect, ok := errors.Unwrap(err).(minecraft.DisconnectError); ok {
					_ = listener.Disconnect(conn, disconnect.Error())
				}
				return
			}
			if err := conn.WritePacket(pk); err != nil {
				return
			}
		}
	}()
}