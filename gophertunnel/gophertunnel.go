package gophertunnel

import (
	"cricketbugging/log"
	"fmt"
	"github.com/davecgh/go-spew/spew"
	"github.com/pkg/errors"
	"github.com/sandertv/gophertunnel/minecraft"
	"github.com/sandertv/gophertunnel/minecraft/protocol/packet"
	"golang.org/x/oauth2"
	"reflect"
	"sync"
)

type GopherTunnel struct {
	running bool
	logger  *log.Logger
	addr    AddressInfo
}

func NewTunnel() *GopherTunnel {
	return &GopherTunnel{
		running: false,
		logger:  log.NewLogger(),
		addr:    NewAddr("0.0.0.0:19132", "0.0.0.0:19132"),
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

func (t GopherTunnel) Address() AddressInfo {
	return t.addr
}

func (t *GopherTunnel) Listen(pk packet.Packet) {
	lg := func(p packet.Packet) {
		t.Logger().Logging(
			log.NewMsg(
				t.structName(p),
				spew.Sdump(p),
			),
		)
	}

	switch p := pk.(type) {
	case *packet.Text:
		lg(p)
	}
}

func (t *GopherTunnel) structName(stct interface{}) string {
	if ref := reflect.TypeOf(stct); ref.Kind() == reflect.Ptr {
		return ref.Elem().Name()

	} else {
		return ref.Name()
	}
}

func (t *GopherTunnel) Run(addr AddressInfo) {
	t.addr = addr
	if t.running {
		t.logger.Logging(log.NewMsgNoContent("gophertunnel is already running"))
		return
	}
	p, err := minecraft.NewForeignStatusProvider(t.addr.RemoteAddress)

	if err != nil {
		t.logger.Logging(log.NewMsgNoContent(fmt.Sprintf("lookup %s no such host", addr.RemoteAddress)))
		t.logger.Logging(log.NewMsgNoContent("stopping gophertunnel..."))
		return
	}
	tsrc := genToken(t.Logger())
	listener, err := minecraft.ListenConfig{
		StatusProvider: p,
	}.Listen("raknet", t.addr.LocalAddress)

	if err != nil {
		panic(err)
	}
	t.running = true
	t.logger.Logging(log.NewMsgNoContent("done!"))
	_ = t.addr.Save()

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
		go t.handleConn(c.(*minecraft.Conn), listener, tsrc)
	}
}

func (t *GopherTunnel) handleConn(conn *minecraft.Conn, listener *minecraft.Listener, tsrc oauth2.TokenSource) {
	serverConn, err := minecraft.Dialer{
		TokenSource: tsrc,
		ClientData:  conn.ClientData(),
	}.Dial("raknet", t.addr.RemoteAddress)

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
