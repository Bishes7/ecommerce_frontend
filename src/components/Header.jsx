import { Navbar, Nav, Container, Badge, NavDropdown } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";

const Header = () => {
  // use selectot
  const { cartItems } = useSelector((state) => state.cartInfo);
  const { userInfo } = useSelector((state) => state.auth);

  const logoutHandler = (e) => {
    e.preventDefault();
  };

  return (
    <header>
      <Navbar
        bg="dark"
        variant="dark"
        expand="md"
        collapseOnSelect
        className="nav"
      >
        <Container className="fw-bold ">
          <Navbar.Brand>Ecommerce Shop</Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <Nav.Link as={Link} to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </Nav.Link>

                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={Link} to="/login">
                  Login
                  <FaUser />
                </Nav.Link>
              )}

              <Nav.Link as={Link} to="/cart">
                Cart <FaShoppingCart />
                {cartItems.length > 0 && (
                  <Badge pill bg="warning" className="cart">
                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                  </Badge>
                )}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
