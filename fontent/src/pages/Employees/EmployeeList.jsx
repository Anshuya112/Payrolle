import "./EmployeeCreate.css";
import { Link, useNavigate, } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


function EmployeeList() {

  const [employees, setEmployees] = useState([]);
const navigate = useNavigate();
const { id } = useParams();

const [employee, setEmployee] = useState(null);

useEffect(() => {
    fetchEmployee();
}, []);

const fetchEmployee = async () => {
    try {
        const response = await axios.get(
            `http://localhost:8000/api/employees/${id}`
        );

        setEmployee(response.data.employee);
    } catch (error) {
        console.log(error);
    }
};

const openAttendance = (employee) => {
    navigate(`/attendance/${employee.id}`);
};

  const getEmployees = async () => {

    try {

      const response = await fetch(
        "http://localhost:8000/api/employees"
      );


      const data = await response.json();

      console.log(data);


      // Laravel response check
      if (data.employees) {
        setEmployees(data.employees);
      } 
      else {
        setEmployees(data);
      }


    } 
    catch(error) {

      console.log(error);

    }

  };



  useEffect(() => {

    getEmployees();

  }, []);


  const deleteEmployee = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this employee?");

  if (!confirmDelete) return;

  try {
    const response = await fetch(`http://localhost:8000/api/employees/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    alert(data.message);

    // Table refresh
    getEmployees();

  } catch (error) {
    console.log(error);
    alert("Delete Failed");
  }
};




  return (

    <div className="employee-page">


      <div className="employee-header">


        <div>

          <h2>Employee List</h2>

          <p>
            Manage all employees
          </p>

        </div>
          
       <button onClick={() => openAttendance(employee)}>
          Attendance
          </button>

        <Link
          to="/Employees/Create"
          className="add-btn"
        >
          + Add Employee
        </Link>


      </div>


      <div className="search-card">


        <input

          type="text"

          placeholder="Search Employee..."

        />

      </div>








    

      <div className="table-card">


        <table>


          <thead>


            <tr>

              <th>ID</th>

              <th>Employee ID</th>

              <th>Name</th>

              <th>Department</th>

              <th>Designation</th>

              <th>Salary</th>

              <th>Action</th>


            </tr>


          </thead>






          <tbody>


          {

            employees.length > 0 ? (

              employees.map((emp)=>(


                <tr key={emp.id}>


                  <td>
                    {emp.id}
                  </td>



                  <td>
                    {emp.employee_id}
                  </td>




                  <td>
                    {emp.first_name} {emp.last_name}
                  </td>




                  <td>
                    {emp.department}
                  </td>




                  <td>
                    {emp.designation}
                  </td>




                  <td>
                    ₹{emp.salary}
                  </td>





               <td>
                              <select
                  className="action-select"
                  onChange={(e) => {
                    const value = e.target.value;
             
                    if (value === "document") {
                      window.location.href = `/Employee/Documents/${emp.id}`;
                    }
             
                    if (value === "view") {
                      window.location.href = `/Employees/View/${emp.id}`;
                    }
             
                    if (value === "edit") {
                      window.location.href = `/Employees/Edit/${emp.id}`;
                    }

                    if (value === "profile") {
                      window.location.href = `/Employee/Profile/${emp.id}`;
                    }
             
                    if (value === "delete") {
                     deleteEmployee(emp.id);
                   }
             
                   e.target.value = "";
                 }}
               >
                 <option value=""> Action</option>
                 <option value="document" onClick={()=>{
                   navigate(`/employee-documents/${employee.id}`)
                  }}>Document</option>
                 <option value="view">View</option>
                 <option value="edit">Edit</option>
                 <option value="profile">Profile</option>
                 <option value="delete">Delete</option>
               </select>
             </td>



                </tr>


              ))


            )

            :

            (

              <tr>

                <td colSpan="7">

                  No Employee Found

                </td>


              </tr>

            )


          }



          </tbody>


        </table>


      </div>


      




    </div>


  );

}


export default EmployeeList;











 