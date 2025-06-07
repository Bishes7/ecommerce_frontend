import React from "react";
import { Alert } from "react-bootstrap";

export const Message = ({ variant, children }) => {
  return (
    <div>
      <Alert variant={variant}>{children}</Alert>
    </div>
  );
};

Message.defaultProps = {
  variant: "info",
};
