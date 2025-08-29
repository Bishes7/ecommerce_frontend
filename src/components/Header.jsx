import { Navbar, Nav, Container, Badge, NavDropdown } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { HiOutlineLogout } from "react-icons/hi";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import SearchBox from "./SearchBox";
import { BiSolidDashboard } from "react-icons/bi";
import { HiUsers } from "react-icons/hi";
import { FaSitemap } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";

const Header = () => {
  const { cartItems } = useSelector((state) => state.cartInfo);
  const { userInfo } = useSelector((state) => state.auth);

  const admin = userInfo?.isAdmin;

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
    <header className="shadow-sm">
      <div className="bg-light py-2 border-bottom">
        <Container className="d-flex justify-content-between align-items-center">
          {/* Logo */}
          <Link to="/" className="d-flex align-items-center">
            <img
              src={logo}
              alt="logo"
              style={{ height: "50px", marginRight: "10px" }}
              className="site-logo"
            />
          </Link>

          {/* Search Bar */}
          <div className=" mx-3">
            <SearchBox />
          </div>

          {/* Icons */}
          <div className="d-flex align-items-center fw-bold">
            {userInfo ? (
              <NavDropdown title={userInfo.name} id="username" align="end">
                <NavDropdown.Item as={Link} to="/profile">
                  <FaUser /> Profile
                </NavDropdown.Item>
                <NavDropdown.Item onClick={logoutHandler}>
                  <HiOutlineLogout /> LogOut
                </NavDropdown.Item>

                {admin && (
                  <>
                    <NavDropdown.Item as={Link} to="/admin/dashboard">
                      <BiSolidDashboard /> Dashboard
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/userlist">
                      <HiUsers /> Userlist
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/orderlist">
                      <FaSitemap /> Orderlist
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/message">
                      <AiFillMessage /> Messages
                    </NavDropdown.Item>
                  </>
                )}
              </NavDropdown>
            ) : (
              <Link to="/login" className="text-decoration-none text-dark me-3">
                <FaUser className="me-1" /> Login
              </Link>
            )}

            <Link
              to="/cart"
              className="text-decoration-none text-dark position-relative"
            >
              <FaShoppingCart size={20} />
              {cartItems.length > 0 && (
                <Badge
                  pill
                  bg="danger"
                  className="position-absolute top-0 start-100 translate-middle"
                >
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </Badge>
              )}
            </Link>
          </div>
        </Container>
      </div>

      {/* Navigation Menu */}
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Nav className="mx-auto shadow-md fw-bold ">
            <Nav.Link as={Link} to="/category/tv-audio">
              TV & Audio
            </Nav.Link>
            <Nav.Link as={Link} to="/category/home-appliances">
              Home Appliances
            </Nav.Link>
            <Nav.Link as={Link} to="/category/mobile">
              Mobile & Accessories
            </Nav.Link>
            <Nav.Link as={Link} to="/category/smart-home">
              Smart Home
            </Nav.Link>
            <Nav.Link as={Link} to="/category/purification">
              Purification & Hygiene
            </Nav.Link>
            <Nav.Link as={Link} to="/category/vehicle">
              Vehicle
            </Nav.Link>
            <Nav.Link as={Link} to="/category/brands">
              Brands
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
