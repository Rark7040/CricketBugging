package log

type Logger struct {
	update   bool
	ids      int
	messages map[int]Message
}

func NewLogger() Logger {
	return Logger{
		update:   false,
		ids:      0,
		messages: map[int]Message{},
	}
}
