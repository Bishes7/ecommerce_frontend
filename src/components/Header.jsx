import { Navbar, Nav, Container, Badge, NavDropdown } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import SearchBox from "./SearchBox";

const Header = () => {
  // use selector
  const { cartItems } = useSelector((state) => state.cartInfo);
  const { userInfo } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [logOutApi] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logOutApi().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
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
        <Container className="fw-bold  ">
          <Navbar.Brand as={Link} to="/">
            <img src={logo} alt="logo" className="navbar-logo" />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <SearchBox />
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <NavDropdown.Item as={Link} to="profile">
                    Profile
                  </NavDropdown.Item>

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

              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="adminmenu">
                  <NavDropdown.Item as={Link} to="/admin/dashboard">
                    Dashboard
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/productlist">
                    Products
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/userlist">
                    Users
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/orderlist">
                    Orders
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
