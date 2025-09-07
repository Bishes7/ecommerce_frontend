import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const offers = [
  // Freebies (from your brother)
  {
    title: "Buy a Phone → Free Earbuds",
    sub: "Selected models • While stocks last",
    img: "/festive/mx3.jpg",
    to: "/category/mobile",
    label: "FREE",
  },
  {
    title: "Buy a TV → Free Smartwatch",
    sub: "43” & above • Selected brands",
    img: "/festive/tvandwatch.png",
    to: "/category/tv",
    label: "FREE",
  },
  {
    title: "Buy a Fridge → Free Smartwatch",
    sub: "Double-door & premium series",
    img: "/festive/sw.png",
    to: "/category/home-appliances",
    label: "FREE",
  },

  // Extra simple, Nepal-friendly ideas (visual only)
  {
    title: "Free Wall-Mount & Basic Install",
    sub: "For TVs 43”+ • Adamghat, Dhading area",
    img: "/festive/wallmount.png",
    to: "/category/tv",
    label: "BONUS",
  },
  {
    title: "+1 Year Extended Warranty",
    sub: "Select TVs & Fridges • Festival bundle",
    img: "/festive/warranty.png",
    to: "/offers/extended-warranty",
    label: "NEW",
  },
  {
    title: "Accessory Bundle 20% OFF",
    sub: "Case + Tempered Glass with any phone",
    img: "/festive/mx5.jpg",
    to: "/category/mobile",
    label: "-20%",
  },
  {
    title: "Stabilizer 50% OFF with Fridge",
    sub: "Protect from voltage fluctuation",
    img: "/festive/automatic.png",
    to: "/offers/stabilizer-combo",
    label: "-50%",
  },
  {
    title: "Festival Lucky Draw",
    sub: "Every purchase → win mixer/blender",
    img: "/festive/luckydraw.png",
    to: "/category/lucky-draw",
    label: "WIN",
  },
];

export default function DashainOffer() {
  return (
    <Container className="my-4">
      <div className="d-flex align-items-baseline justify-content-between mb-3">
        <h2 className="fw-bold m-0">Dashain • Tihar Offers</h2>
        <span className="text-muted small">Serving Adamghat, Dhading</span>
      </div>

      <Row xs={1} sm={2} md={3} lg={4} className="g-3">
        {offers.map((o, idx) => (
          <Col key={idx}>
            <Card
              as={Link}
              to={o.to}
              className="offer-card h-100 text-decoration-none"
            >
              <div className="offer-img-wrap">
                <img
                  src={o.img}
                  alt={o.title}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
                <span className="offer-badge">{o.label}</span>
              </div>
              <Card.Body>
                <Card.Title className="fs-6 text-dark">{o.title}</Card.Title>
                <Card.Text className="text-muted small">{o.sub}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <p className="text-muted small mt-2">
        * Images are representative. Offers valid during Dashain–Tihar or while
        stocks last. Terms may apply.
      </p>
    </Container>
  );
}
