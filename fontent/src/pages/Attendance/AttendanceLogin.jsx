import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AttendanceMark.css";


export default function AttendanceLogin() {


  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();



  const handleLogin = async (e) => {

    e.preventDefault();


    try {


      const response = await axios.post(

        "http://127.0.0.1:8000/api/attendance/login",

        {
          employee_id: employeeId,
          email: email
        }

      );



      console.log(response.data);



      localStorage.setItem(

        "employee",

        JSON.stringify(response.data.employee)

      );



      alert("Login Successful");



      navigate("/attendance-dashboard");



    } catch(error) {


      console.log(error.response?.data);


      alert("Invalid Employee ID or Email");


    }

  };




  return (

    <div className="login-container">


      <form
        className="login-card"
        onSubmit={handleLogin}
      >


        <h2>
          Employee Login
        </h2>




        <input

          type="text"

          placeholder="Employee ID"

          value={employeeId}

          onChange={(e)=>
            setEmployeeId(e.target.value)
          }

          required

        />




        <input

          type="email"

          placeholder="Email"

          value={email}

          onChange={(e)=>
            setEmail(e.target.value)
          }

          required

        />




        <button type="submit">

          Login

        </button>



      </form>


    </div>

  );

}