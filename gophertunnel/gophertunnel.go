package gophertunnel

import (
	"cricketbugging/log"
	"github.com/davecgh/go-spew/spew"
	"github.com/pkg/errors"
	"github.com/sandertv/gophertunnel/minecraft"
	"github.com/sandertv/gophertunnel/minecraft/protocol/packet"
	"golang.org/x/oauth2"
	"sync"
)

type GopherTunnel struct {
	running bool
	logger  *log.Logger
}

func NewTunnel() *GopherTunnel {
	return &GopherTunnel{
		running: false,
		logger:  log.NewLogger(),
	}
}

func (t GopherTunnel) Running() bool {
	return t.running
}

func (t *GopherTunnel) Kill() {
	t.running = false
}

func (t *GopherTunnel) Logger() *log.Logger {
	return t.logger
}

func (t *GopherTunnel) Listen(pk packet.Packet) {
	switch p := pk.(type) {
	case *packet.AddItemActor:
		t.Logger().Logging(
			log.NewMsg(
				"AddItemActor",
				spew.Sdump(p),
			),
		)
	}
}

func (t *GopherTunnel) Run(addr AddressInfo) {
	t.running = true
	tsrc := genToken(t.Logger())
	p, err := minecraft.NewForeignStatusProvider(addr.RemoteIp())

	if err != nil {
		panic(err)
	}
	listener, err := minecraft.ListenConfig{
		StatusProvider: p,
	}.Listen("raknet", addr.LocalIp())

	if err != nil {
		panic(err)
	}
	t.logger.Logging(log.NewMsgNoContent("done!"))

	go func() {
		defer func() {
			if err = listener.Close(); err != nil {
				panic(err)
			}
			t.logger.Logging(log.NewMsgNoContent("gophertunnel stopped"))
		}()
		for {
			if !t.Running() {
				return
			}
		}
	}()
	for { // on login
		c, err := listener.Accept()
		if !t.Running() {
			return
		}
		if err != nil {
			panic(err)
		}
		go t.handleConn(c.(*minecraft.Conn), listener, addr, tsrc)
	}
}

func (t *GopherTunnel) handleConn(conn *minecraft.Conn, listener *minecraft.Listener, addr AddressInfo, tsrc oauth2.TokenSource) {
	serverConn, err := minecraft.Dialer{
		TokenSource: tsrc,
		ClientData:  conn.ClientData(),
	}.Dial("raknet", addr.RemoteIp())

	if err != nil {
		panic(err)
	}
	var g sync.WaitGroup
	g.Add(2)

	go func() {
		if err := conn.StartGame(serverConn.GameData()); err != nil {
			if !t.Running() {
				return
			}
			//on stop join progress
			t.logger.Logging(log.NewMsgNoContent("login cancelled"))
		}
		g.Done()
	}()

	go func() {
		if err := serverConn.DoSpawn(); err != nil {
			if !t.Running() {
				return
			}
			panic(err)
		}
		g.Done()
	}()
	g.Wait()

	if !t.Running() {
		return
	}
	go func() {
		defer func() {
			if err := listener.Disconnect(conn, "connection lost"); err != nil {
				panic(err)
			}
			if err := serverConn.Close(); err != nil {
				panic(err)
			}
		}()
		for {
			if !t.Running() {
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
		defer func() {
			if err := serverConn.Close(); err != nil {
				panic(err)
			}
			if err := listener.Disconnect(conn, "connection lost"); err != nil {
				panic(err)
			}
			t.logger.Logging(log.NewMsgNoContent("disconnected"))
		}()
		for {
			if !t.Running() {
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
