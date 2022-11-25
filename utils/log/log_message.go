package log

type Message struct {
	title   string
	content string
}

func NewMsg(title string, content string) *Message {
	return &Message{
		title:   title,
		content: content,
	}
}

func (m *Message) GetTitle() string {
	return m.title
}

func (m *Message) GetContent() string {
	return m.title
}
