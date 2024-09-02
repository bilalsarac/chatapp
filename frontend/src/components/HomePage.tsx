
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

interface HomePageProps {
    setUsername: (username: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setUsername }) => {
    const [name, setName] = useState<string>('');
    const navigate = useNavigate();

    const handleStartChat = () => {
        if (name.trim()) {
            setUsername(name);
            navigate('/chat');
        }
    };

    return (
        <Container fluid className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <Row className="w-100">
                <Col md={6} lg={4} className="mx-auto">
                    <div className="bg-white p-4 rounded shadow-sm">
                        <h1 className="mb-4 text-center">Welcome to Chat</h1>
                        <Form>
                            <Form.Group className="mb-3">

                                <Form.Control
                                    type="text"
                                    placeholder="Enter name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Form.Group>

                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
                                <Button
                                    variant="dark"
                                    size="sm"
                                    style={{ height: '38px' }}
                                    onClick={handleStartChat}
                                >
                                    Start Chat
                                </Button>
                            </div>

                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default HomePage;
