import {Button, Container, Navbar} from 'react-bootstrap'
import {Link} from 'react-router-dom'

function Header() {
    return (
        <header>
            <Navbar className="bg-dark">
                <Container className="text-secondary">
                    <Navbar.Brand className="text-secondary" href="/">Admin UI</Navbar.Brand>
                    {sessionStorage.getItem('email')
                        ?
                        <>
                            <Button className="ms-3 me-auto">Add new</Button>
                            <span className="ms-auto me-3">{sessionStorage.getItem('email')}</span>
                            <Link to="/logout">Logout</Link>
                        </>
                        : null
                    }
                </Container>
            </Navbar>
        </header>
    )
}

export default Header