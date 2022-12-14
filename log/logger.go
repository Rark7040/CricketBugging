package log

import (
	"fmt"
	"strconv"
)

type Logger struct {
	ids      int
	messages map[int]Message
}

func NewLogger() *Logger {
	return &Logger{
		ids:      0,
		messages: map[int]Message{},
	}
}

func (l Logger) NeedsUpdate(p int) bool {
	return p < l.ids
}

func (l Logger) Ids() int {
	return l.ids
}

func (l *Logger) Logging(m Message) {
	l.messages[l.ids] = m
	l.ids += 1
}

func (l Logger) Title(id int) string {
	if m, ok := l.messages[id]; ok {
		return m.title
	}
	return "null"
}

func (l Logger) Content(id int) string {
	if m, ok := l.messages[id]; ok {
		return m.content
	}
	return "null"
}

func (l *Logger) Clear() {
	l.ids = 0
	l.messages = map[int]Message{}
}

func (l *Logger) GetAll() *map[int]Message {
	return &l.messages
}

func (l Logger) Debug() {
	fmt.Println(strconv.Itoa(len(l.messages)) + "件のgo側在庫")
	fmt.Println(strconv.Itoa(l.Ids()) + "ids")
}
