import React from "react";
import {
  useDeleteUserMutation,
  useGetusersQuery,
} from "../../slices/usersApiSlice";
import { Loader } from "../../components/ui/Loader";
import { Message } from "../../components/ui/Message";
import {
  Button,
  Nav,
  Table,
  Card,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { FaCheck, FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const UserListPage = () => {
  const { data: users, isloading, error, refetch } = useGetusersQuery();
  const [deleteUser, { isloading: loadingDelete }] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        toast.success("User deleted successfully");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Card className="p-4 shadow-sm border-0">
        <h2 className="text-center mb-4 text-primary fw-bold">Users List</h2>
        {loadingDelete && <Loader />}
        {isloading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Table
            striped
            hover
            responsive
            className="table-sm align-middle shadow-sm"
          >
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ADMIN</th>
                <th className="text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user._id}>
                  <td className="small">{user._id}</td>
                  <td>{user.name}</td>
                  <td>
                    <a
                      href={`mailto:${user.email}`}
                      className="text-decoration-none"
                    >
                      {user.email}
                    </a>
                  </td>
                  <td className="text-center">
                    {user.isAdmin ? (
                      <FaCheck style={{ color: "green" }} />
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td className="text-center">
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Edit User</Tooltip>}
                    >
                      <Nav.Link
                        as={Link}
                        to={`/admin/user/${user._id}/edit`}
                        className="d-inline p-0"
                      >
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2 rounded-circle"
                        >
                          <FaEdit />
                        </Button>
                      </Nav.Link>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Delete User</Tooltip>}
                    >
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="rounded-circle"
                        onClick={() => deleteHandler(user._id)}
                      >
                        <FaTrash />
                      </Button>
                    </OverlayTrigger>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
};

export default UserListPage;
