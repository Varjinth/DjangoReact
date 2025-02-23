import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
} from "mdb-react-ui-kit";

const AllTrips = () => {
  const [trips, setTrips] = useState([]);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get("/check-auth/", { withCredentials: true });
      if (response.data.authenticated && response.data.role === "admin") {
        setRole("admin");
        fetchTrips();
      } else {
        setRole("user"); 
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
      setRole(null); 
    }
    setLoading(false);
  };

  const fetchTrips = async () => {
    try {
      const response = await axios.get("/trips/", { withCredentials: true });
      setTrips(response.data);
    } catch (error) {
      console.error("Error fetching trip data:", error);
    }
  };

  const approveTrips = async (id) => {
    try {
      await axios.post(`/trips/${id}/approve/`, { approved: true }, { withCredentials: true });
      fetchTrips();
    } catch (error) {
      console.error("Error approving trip:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/logout/", {}, { withCredentials: true });
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (role !== "admin") {
    return <p className="text-center mt-5 text-danger">Not Authorized to View This Page</p>;
  }

  return (
    <MDBContainer className="mt-4">
      <MDBCard>
        <MDBCardBody>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="mb-0">All Trips</h3>
            <div>

              <MDBBtn color="danger" onClick={handleLogout}>
                Logout
              </MDBBtn>
            </div>

          </div>

          <MDBTable bordered hover responsive>
            <MDBTableHead dark>
              <tr>
                <th>#</th>
                <th>Project Name</th>
                <th>Purpose</th>
                <th>Travel Mode</th>
                <th>Start Date</th>
                <th>Start Location</th>
                <th>End Location</th>
                <th>Approved</th>
                <th>Actions</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {trips.length > 0 ? (
                trips.map((trip, index) => (
                  <tr key={trip.id}>
                    <td>{index + 1}</td>
                    <td>{trip.project_name}</td>
                    <td>{trip.purpose_of_travel}</td>
                    <td>{trip.travel_mode}</td>
                    <td>{trip.travel_start_date}</td>
                    <td>{trip.travel_start_location}</td>
                    <td>{trip.travel_end_location}</td>
                    <td>{trip.approved ? "Approved" : "Pending"} </td>
                    <td>
                      {trip.approved ?
                        null :
                        <MDBBtn
                          size="sm"
                          color="primary"
                          onClick={() => approveTrips(trip.id)}
                        >
                          Approve
                      </MDBBtn>}
                    </td>
                  </tr>
                ))
              ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No trips found.
                  </td>
                  </tr>
                )}
            </MDBTableBody>
          </MDBTable>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default AllTrips;
