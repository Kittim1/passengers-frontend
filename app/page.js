'use client';
import { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Table, Row, Col } from 'react-bootstrap';
import { toast } from 'sonner';

export default function Dashboard() {
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [destination, setDestination] = useState('');
    const [price, setPrice] = useState('');
    const [entries, setEntries] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [genders, setGenders] = useState([]);

    useEffect(() => {
        // Fetch destinations and genders when component mounts
        fetchData('getDestinations', setDestinations);
        fetchData('getGenders', setGenders);
    }, []);

    const fetchData = async (operation, setter) => {
        try {
            const response = await fetch('http://localhost/api/quiz1/passengers.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ operation }),
            });
            const data = await response.json();
            console.log(`${operation} Data:`, data); // Log fetched data
            setter(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getPassengers = async () => {
        const response = await fetch('http://localhost/api/quiz1/passengers.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ operation: 'getRecord' }),
        });
        const data = await response.json();
        console.log('GetPassengers:', data); // Log passengers data
        setEntries(data);
    }

    useEffect(() => {
        getPassengers();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newEntry = { pas_name: name, pas_genderId: gender, pas_destinationId: destination, pas_price: price };
        console.log('New Entry:', newEntry); // Log the new entry

        try {
            const response = await fetch('http://localhost/api/quiz1/passengers.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ operation: 'addRecord', ...newEntry }),
            });
            const result = await response.json();
            console.log('Submit Result:', result); // Log result of submission
            if (result.status === 1) {
                getPassengers();
                setName('');
                setGender('');
                setDestination('');
                setPrice('');
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Error submitting data.');
            console.error('Error:', error);
        }
    };

    // Helper functions to find names by ID
    const getGenderNameById = (id) => {
        if (!genders.length) return 'Unknown';
        const genderObj = genders.find(g => g.gender_id === id);
        console.log('Gender lookup:', id, genderObj); // Log gender lookup
        return genderObj ? genderObj.gender_name : 'Unknown';
    };

    const getDestinationNameById = (id) => {
        if (!destinations.length) return 'Unknown';
        const destObj = destinations.find(d => d.dest_id === id);
        console.log('Destination lookup:', id, destObj); // Log destination lookup
        return destObj ? destObj.dest_name : 'Unknown';
    };

    return (
        <Container>
            <Card className="my-4 bg-primary text-white">
                <Card.Body>
                    <h1 className="mb-4">QUIZZZZZ</h1>
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group controlId="formName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your name"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formGender">
                                    <Form.Label>Gender</Form.Label>
                                    <Form.Select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                    >
                                        <option value="">Select a gender</option>
                                        {genders.map((gen) => (
                                            <option key={gen.gender_id} value={gen.gender_id}>
                                                {gen.gender_name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group controlId="formDestination">
                                    <Form.Label>Destination</Form.Label>
                                    <Form.Select
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                    >
                                        <option value="">Select a destination</option>
                                        {destinations.map((dest) => (
                                            <option key={dest.dest_id} value={dest.dest_id}>
                                                {dest.dest_name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formPrice">
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="Enter the price"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant="secondary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Card.Body>
            </Card>

            <Card className="my-4 bg-light">
                <Card.Body>
                    <h2>ALRIGHT</h2>
                    <Table striped bordered hover className="bg-white">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Gender</th>
                                <th>Destination</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map((entry, index) => (
                                <tr key={index}>
                                    <td>{entry.pas_name}</td>
                                    <td>{entry.gender_name}</td>
                                    <td>{entry.dest_name}</td>
                                    <td>₱{entry.pas_price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
}