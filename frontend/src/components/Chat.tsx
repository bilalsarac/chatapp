import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import { Form, Button, ListGroup, Container, Row, Col } from 'react-bootstrap';

interface ChatMessage {
  sender: string;
  content: string;
  type: 'CHAT' | 'JOIN' | 'LEAVE';
}

interface ChatProps {
  username: string;
}

const Chat: React.FC<ChatProps> = ({ username }) => {
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageContent, setMessageContent] = useState<string>('');
  const stompClient = useRef<Client | null>(null);
  const messageAreaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!username) {
      navigate('/');
      return;
    }


    const socket = new SockJS('http://ip_address_and_port:8080/ws');
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      onConnect: onConnected,
      onStompError: (frame) => {
        console.error('STOMP Error:', frame);
      },
      debug: (msg) => console.log(msg),
    });

    stompClient.current.activate();

    return () => {
      stompClient.current?.deactivate();
    };
  }, [username, navigate]);

  const onConnected = () => {
    if (stompClient.current) {
      stompClient.current.subscribe('/topic/public', onMessageReceived);

      //publish (notify)
      stompClient.current.publish({
        destination: '/app/chat.addUser',
        body: JSON.stringify({ sender: username, type: 'JOIN' }),
      });
    }
  };

  const sendMessage = () => {
    if (messageContent.trim() && stompClient.current) {
      const chatMessage: ChatMessage = {
        sender: username,
        content: messageContent,
        type: 'CHAT',
      };
      stompClient.current.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(chatMessage),
      });
      setMessageContent('');
    }
  };

  const onMessageReceived = (message: IMessage) => {
    const receivedMessage: ChatMessage = JSON.parse(message.body);

    if (receivedMessage.type === 'JOIN') {
      receivedMessage.content = `${receivedMessage.sender} joined!`;
    } else if (receivedMessage.type === 'LEAVE') {
      receivedMessage.content = `${receivedMessage.sender} left!`;
    }

    setMessages((prevMessages) => [...prevMessages, receivedMessage]);

    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  };

  const getAvatarColor = (messageSender: string): string => {
    const colors = ['#2196F3', '#32c787', '#00BCD4', '#ff5652', '#ffc107', '#ff85af', '#FF9800', '#39bbb0'];
    let hash = 0;
    for (let i = 0; i < messageSender.length; i++) {
      hash = 31 * hash + messageSender.charCodeAt(i);
    }
    return colors[Math.abs(hash % colors.length)];
  };

  return (
    <Container fluid className="d-flex flex-column h-100">
      <Row className="flex-grow-1">
        <Col className="d-flex flex-column">
          <div ref={messageAreaRef} className="bg-light p-3 overflow-auto flex-grow-1">
            <ListGroup>
              {messages.map((message, index) => (
                <ListGroup.Item key={index} className={message.type === 'CHAT' ? 'd-flex align-items-start' : ''}>
                  {message.type === 'CHAT' && (
                    <div className="d-flex align-items-center">
                      <div
                        className="rounded-circle me-2"
                        style={{
                          backgroundColor: getAvatarColor(message.sender),
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      >
                        {message.sender[0]}
                      </div>
                      <div>
                        <div className="fw-bold">{message.sender}</div>
                        <div>{message.content}</div>
                      </div>
                    </div>
                  )}
                  {message.type !== 'CHAT' && (
                    <div className="text-center">{message.content}</div>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
          <Form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="mt-2">
            <div className="d-flex">
              <Form.Control
                type="text"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Type a message"
                className="me-2"
              />
              <Button type="submit" variant="dark" className="align-self-center">Send</Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;
