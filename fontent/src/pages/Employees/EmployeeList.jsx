
import "./EmployeeCreate.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function EmployeeList() {

    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate();

    const getEmployees = async () => {
        try {
            const response = await fetch(
                "http://localhost:8000/api/employees"
            );

            const data = await response.json();

            console.log("Employees API:", data);

            if (data.employees) {
                setEmployees(data.employees);
            } else {
                setEmployees(data);
            }

        } catch (error) {
            console.error("Get employees error:", error);
        }
    };

    useEffect(() => {
        getEmployees();
    }, []);

    const deleteEmployee = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this employee?"
        );

        if (!confirmDelete) return;

        try {

            const response = await fetch(
                `http://localhost:8000/api/employees/${id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            alert(data.message);

            getEmployees();

        } catch (error) {

            console.error("Delete error:", error);

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

                        {employees.length > 0 ? (

                            employees.map((emp) => (

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
                                            defaultValue=""
                                            onChange={(e) => {

                                                const value = e.target.value;

                                                if (value === "document") {
                                                    navigate(
                                                        `/Employee/Documents/${emp.id}`
                                                    );
                                                }

                                                if (value === "view") {
                                                    navigate(
                                                        `/Employees/View/${emp.id}`
                                                    );
                                                }

                                                if (value === "edit") {
                                                    navigate(
                                                        `/Employees/Edit/${emp.id}`
                                                    );
                                                }

                                                if (value === "profile") {
                                                    navigate(
                                                        `/Employee/Profile/${emp.id}`
                                                    );
                                                }

                                                if (value === "delete") {
                                                    deleteEmployee(emp.id);
                                                }

                                                e.target.value = "";

                                            }}
                                        >

                                            <option value="">
                                                Action
                                            </option>

                                            <option value="document">
                                                Document
                                            </option>

                                            <option value="view">
                                                View
                                            </option>

                                            <option value="edit">
                                                Edit
                                            </option>

                                            <option value="profile">
                                                Profile
                                            </option>

                                            <option value="delete">
                                                Delete
                                            </option>

                                        </select>

                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td colSpan="7">
                                    No Employee Found
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default EmployeeList;
