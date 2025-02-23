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

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await axios.get("/trips/", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      setTrips(response.data);
    } catch (error) {
      console.error("Error fetching trip data:", error);
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






  return (
    <MDBContainer className="mt-4">
      <MDBCard>
        <MDBCardBody>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="mb-0">Trip List</h3>



            <div>
              <MDBBtn color="primary" className="me-2" onClick={() => navigate("/addtrip")}>
                Apply for a New Trip
              </MDBBtn>
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
                <th>Admin Approval</th>

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
                    {trip.approved ? <td>Approved</td> : <td>Pending</td>}
                    {trip.approved ? null : <td>
                      <MDBBtn
                        size="sm"
                        color="danger"
                        onClick={() => alert(`Deleting trip ID: ${trip.id}`)}
                      >
                        Delete
                      </MDBBtn>
                    </td>}
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

export default TripList;
