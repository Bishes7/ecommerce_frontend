import React from "react";
import {
  useDeleteMessageMutation,
  useGetMessageQuery,
} from "../../slices/messageApiSlice";
import { Loader } from "../../components/ui/Loader";
import { Message } from "../../components/ui/Message";
import { Card, Table, Badge, Button } from "react-bootstrap";
import { format } from "date-fns";
import { toast } from "react-toastify";

const AdminMessagePage = () => {
  const { data: messages, isLoading, error, refetch } = useGetMessageQuery();
  const [deleteMessage] = useDeleteMessageMutation();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure")) {
      await deleteMessage(id);
      toast.success("Message deleted successfully");
      refetch();
    }
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Message variant="danger">
        {error?.data?.message || "Failed to load messages"}
      </Message>
    );

  return (
    <div className="container mt-4">
      <Card className="shadow-lg border-0 rounded-3">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">📨 Customer Messages</h4>
          <Badge bg="light" text="dark">
            Total: {messages?.length || 0}
          </Badge>
        </Card.Header>
        <Card.Body className="p-3">
          {messages && messages.length > 0 ? (
            <Table responsive hover className="align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg, index) => (
                  <tr key={msg._id}>
                    <td>
                      <Badge bg="secondary">{index + 1}</Badge>
                    </td>
                    <td className="fw-semibold">{msg.name}</td>
                    <td style={{ maxWidth: "400px", wordWrap: "break-word" }}>
                      {msg.message}
                    </td>
                    <td>
                      {format(new Date(msg.createdAt), "dd MMM yyyy, hh:mm a")}
                    </td>
                    <td>
                      <Button
                        className="btn-sm"
                        variant="danger"
                        onClick={() => handleDelete(msg._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-3">
              <p className="text-muted fs-5 mb-0">No messages found</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminMessagePage;
