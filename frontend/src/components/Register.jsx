import React, { useState } from 'react';
import { MDBContainer, MDBCol, MDBRow, } from 'mdb-react-ui-kit';
import '../App.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { MDBBtn, MDBInput } from 'mdb-react-ui-kit';
import ErrorPage from '../components/ErrorPage';
import { useNavigate } from 'react-router-dom';
import axios from "axios"

function Register() {
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password1: '',
    role: "User"
  });
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      const response = await axios.post("/register/", formData);
      setMessage(response.data.message);
      navigate('/');
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setIsError(true);
        setMessage("An unexpected error occurred.");
      }
    }

  }


  return (
    <div className="container-wrapper">
      <MDBContainer fluid className="p-3 my-5 h-custom">
        <MDBRow >
          <MDBCol col='10' md='6' >
            <img src="trip.jpg" className="img-fluid" alt="Sampleimage" />
          </MDBCol>
          <MDBCol col='4' md='4' style={{ margin: "auto" }} >
            <div> {isError && <ErrorPage message={message} />}</div>
            <form onSubmit={submitHandler} >
              <div className="d-flex flex-row align-items-center justify-content-center">
                <p className="lead fw-normal mb-0 me-3">Register here</p>



              </div>

              <div className="divider d-flex align-items-center my-4">

              </div>

              <MDBInput wrapperClass='mb-4' label='Email Id' id='formControlLg' type='text' size="lg" name='email' onChange={handleInputChange} />
              {errors.email && <p style={{ color: "red" }}>{errors.email[0]}</p>}
              <MDBInput wrapperClass='mb-4' label='Password' id='formControlLg' type='password' size="lg" name='password' onChange={handleInputChange} />
              {errors.password && <p style={{ color: "red" }}>{errors.password[0]}</p>}

              <MDBInput wrapperClass='mb-4' label='Confirm Password' id='formControlLg' type='password' size="lg" name='password2' onChange={handleInputChange} />
              {errors.password2 && <p style={{ color: "red" }}>{errors.password2[0]}</p>}

              <div className="mb-4">
                <label className="form-label" style={{ fontSize: "16px", color: "#757575" }}>
                  Role
  </label>
                <select
                  className="form-control"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  style={{
                    height: "45px",
                    borderRadius: "5px",
                    border: "1px solid #ced4da",
                    padding: "10px",
                    fontSize: "16px",
                    color: "#495057",
                  }}
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>



              <div className='text-center text-md-start mt-4 pt-2'>
                <MDBBtn className="mb-0 px-5" size='lg'>Signup</MDBBtn>
              </div>


            </form>

          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}
export default Register;