import "./EmployeeCreate.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function ViewEmployee() {


const navigate = useNavigate();

const {id} = useParams();

const [employee,setEmployee] = useState({});



const getEmployee = async()=>{

try{

const response = await fetch(
`http://localhost:8000/api/employees/${id}`
);


const data = await response.json();


setEmployee(data.employee || {});


}
catch(error){

console.log(error);

}

}




useEffect(()=>{

getEmployee();

},[]);





return(

<div className="view-page">



  <div className="view-header">

    <div>

      <h2>View Employee</h2>

      <p>Employee complete profile information</p>

    </div>


    <button
      className="edit-btn"
      onClick={() => navigate(`/Employees/Edit/${id}`)}
    >
      Edit Employee
    </button>


  </div>





  <div className="profile-card">


    <div className="profile-image">

      <img
        src="https://via.placeholder.com/120"
        alt="Employee"
      />

    </div>



    <div className="profile-details">


      <h3>
        {employee.first_name} {employee.last_name}
      </h3>


      <p>
        {employee.designation}
      </p>


      <span>
        Employee ID : {employee.employee_id}
      </span>


    </div>


  </div>






  <div className="details-card">





    <div className="details-row">


      <div className="details-box">

        <label>First Name</label>

        <p>{employee.first_name}</p>

      </div>




      <div className="details-box">

        <label>Last Name</label>

        <p>{employee.last_name}</p>

      </div>


    </div>







    <div className="details-row">


      <div className="details-box">

        <label>Email</label>

        <p>{employee.email}</p>

      </div>




      <div className="details-box">

        <label>Phone</label>

        <p>{employee.phone}</p>

      </div>


    </div>







    <div className="details-row">


      <div className="details-box">

        <label>Department</label>

        <p>{employee.department}</p>

      </div>




      <div className="details-box">

        <label>Designation</label>

        <p>{employee.designation}</p>

      </div>


    </div>







    <div className="details-row">


      <div className="details-box">

        <label>Joining Date</label>

        <p>{employee.joining_date}</p>

      </div>




      <div className="details-box">

        <label>Salary</label>

        <p>₹{employee.salary}</p>

      </div>


    </div>








    <div className="details-row">


      <div className="details-box">

        <label>Gender</label>

        <p>{employee.gender}</p>

      </div>




      <div className="details-box">

        <label>Status</label>

        <span className="status active">
          {employee.status || "Active"}
        </span>

      </div>


    </div>







    <div className="details-box full-width">


      <label>Address</label>


      <p>
        {employee.address}
      </p>


    </div>







    <div className="button-group">


      <button
        className="back-btn"
        onClick={()=>navigate("/Employee")}
      >
        Back
      </button>


    </div>




  </div>



</div>

);

}


export default ViewEmployee;