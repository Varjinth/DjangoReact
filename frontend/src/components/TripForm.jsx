import React, { useState } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBRadio,
  MDBBtn,
  MDBCard,
  MDBCardBody
} from "mdb-react-ui-kit";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const TripForm = () => {
  const navigate = useNavigate();
  const [tripData, setTripData] = useState({
    project_name: "",
    purpose_of_travel: "",
    travel_start_date: "",
    travel_mode: "",
    ticket_booking_mode: "Self",
    travel_start_location: "",
    travel_end_location: "",
  });

  const handleChange = (e) => {
    setTripData({ ...tripData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/trips/", tripData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      alert("Trip details submitted successfully!");
      setTripData({
        project_name: "",
        purpose_of_travel: "",
        travel_start_date: "",
        travel_mode: "",
        ticket_booking_mode: "Self",
        travel_start_location: "",
        travel_end_location: "",
      });
    } catch (error) {
      console.log(error)
    }

  }


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
            <h3 className="mb-0">Apply for a New Trip</h3>
            <div>
              <MDBBtn color="primary" className="me-2" onClick={() => navigate("/mytrips")}>
                View Previous Trips
              </MDBBtn>
              <MDBBtn color="danger" onClick={handleLogout}>
                Logout
              </MDBBtn>
            </div>
          </div>

          <MDBRow className="justify-content-center">
            <MDBCol md="6">
              <MDBCard>
                <MDBCardBody>
                  <h3 className="text-center mb-4">Trip Details</h3>
                  <form onSubmit={handleSubmit}>
                    <MDBInput
                      label="Project Name"
                      type="text"
                      name="project_name"
                      value={tripData.project_name}
                      onChange={handleChange}
                      required
                      className="mb-3"
                    />
                    <MDBInput
                      label="Purpose of Travel"
                      type="text"
                      name="purpose_of_travel"
                      value={tripData.purpose_of_travel}
                      onChange={handleChange}
                      required
                      className="mb-3"
                    />
                    <MDBInput
                      label="Travel Start Date"
                      type="date"
                      name="travel_start_date"
                      value={tripData.travel_start_date}
                      onChange={handleChange}
                      required
                      className="mb-3"
                    />

                    <label className="mb-2">Travel Mode</label>
                    <select
                      className="form-control mb-3"
                      name="travel_mode"
                      value={tripData.travel_mode}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Travel Mode</option>
                      <option value="Flight">Flight</option>
                      <option value="Train">Train</option>
                      <option value="Bus">Bus</option>
                    </select>

                    <label className="mb-2">Ticket Booking Mode</label>
                    <MDBRadio
                      name="ticket_booking_mode"
                      label="Self"
                      value="Self"
                      checked={tripData.ticket_booking_mode === "Self"}
                      onChange={handleChange}
                      inline
                    />
                    <MDBRadio
                      name="ticket_booking_mode"
                      label="Travel Desk"
                      value="Travel Desk"
                      checked={tripData.ticket_booking_mode === "Travel Desk"}
                      onChange={handleChange}
                      inline
                    />

                    <MDBInput
                      label="Travel Start Location"
                      type="text"
                      name="travel_start_location"
                      value={tripData.travel_start_location}
                      onChange={handleChange}
                      required
                      className="mt-3 mb-3"
                    />
                    <MDBInput
                      label="Travel End Location"
                      type="text"
                      name="travel_end_location"
                      value={tripData.travel_end_location}
                      onChange={handleChange}
                      required
                      className="mb-3"
                    />
                    <MDBBtn type="submit" color="primary" block>
                      Submit
                </MDBBtn>
                  </form>                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default TripForm;
