import React, { useState, useEffect, useContext } from 'react';
import { MDBContainer, MDBCol, MDBRow, } from 'mdb-react-ui-kit';
import '../App.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { MDBBtn, MDBInput, MDBCheckbox } from 'mdb-react-ui-kit';
import LoginApi from "../api/LoginApi"
import ErrorPage from '../components/ErrorPage';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from "js-cookie";

function Login() {
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const loginSuccess = await LoginApi(formData, setIsError, setMessage);
      console.log(formData);
      if (loginSuccess) {


        const role = Cookies.get("role");

        if (role === "admin") {
          navigate("/alltrips");
        } else {
          navigate("/addtrip");
        }
      } else {
        setIsError(true);
        setMessage("Some error occured. Please try again after sometimes!!");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setIsError(true);
      setMessage("Invalid credentials. Please try again.");
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
                <p className="lead fw-normal mb-0 me-3">Sign in here</p>
              </div>

              <div className="divider d-flex align-items-center my-4">
              </div>

              <MDBInput wrapperClass='mb-4' label='Email Id' id='formControlLg' type='email' size="lg" name='email' onChange={handleInputChange} />
              <MDBInput wrapperClass='mb-4' label='Password' id='formControlLg' type='password' size="lg" name='password' onChange={handleInputChange} />

              <div className="d-flex justify-content-between mb-4">
                <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
                <Link to="/register"> Don't have account? Register</Link>
              </div>

              <div className='text-center text-md-start mt-4 pt-2'>
                <MDBBtn className="mb-0 px-5" size='lg'>Login</MDBBtn>
              </div>


            </form>

          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}
export default Login;