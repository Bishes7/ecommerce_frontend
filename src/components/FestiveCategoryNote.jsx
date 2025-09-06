// components/FestiveCategoryNote.jsx
import { Alert } from "react-bootstrap";

export default function FestiveCategoryNote({ type }) {
  const map = {
    phones: "Buy a Phone → Free Earbuds",
    tv: "Buy a TV (43”+) → Free Smartwatch",
    fridges: "Buy a Fridge → Free Smartwatch",
  };
  if (!map[type]) return null;
  return (
    <Alert variant="light" className="shadow-sm border">
      🎉 {map[type]} • Dashain–Tihar • Adamghat, Dhading
    </Alert>
  );
}
