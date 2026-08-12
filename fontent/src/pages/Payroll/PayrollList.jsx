import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./GeneratePayroll.css";

const PayrollList = () => {

   
    const navigate = useNavigate();

    const [payrollData, setPayrollData] = useState([]);

    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("All");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const rowsPerPage = 5;


   

    useEffect(() => {
        fetchPayrolls();
    }, []);


    const fetchPayrolls = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await axios.get(
                "http://localhost:8000/api/payrolls"
            );

            console.log(
                "Payroll API Response:",
                response.data
            );


            const data = response.data;


            let payrolls = [];

            if (
                data?.payrolls?.data &&
                Array.isArray(data.payrolls.data)
            ) {

                payrolls = data.payrolls.data;

            } else if (
                Array.isArray(data?.payrolls)
            ) {

                payrolls = data.payrolls;

            } else if (
                Array.isArray(data)
            ) {

                payrolls = data;

            }


            console.log(
                "Payroll Records:",
                payrolls
            );


            setPayrollData(payrolls);

        } catch (error) {

            console.error(
                "Payroll fetch error:",
                error.response?.data || error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load payroll records."
            );

        } finally {

            setLoading(false);

        }

    };



    const filteredData = payrollData.filter((item) => {

        const employee = item.employee || {};


        const employeeId =
            employee.employee_id ||
            item.employee_id ||
            "";


        const employeeName =
            `${employee.first_name || ""} ${
                employee.last_name || ""
            }`.trim();


        const departmentName =
            employee.department || "";


        const matchSearch =

            employeeName
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                )

            ||

            String(employeeId)
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                );


        const matchDepartment =
            department === "All" ||
            departmentName === department;


        return (
            matchSearch &&
            matchDepartment
        );

    });



    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredData.length / rowsPerPage
        )
    );


    const displayedRows =
        filteredData.slice(
            (currentPage - 1) * rowsPerPage,
            currentPage * rowsPerPage
        );

    const handleSearchChange = (e) => {

        setSearch(e.target.value);
        setCurrentPage(1);

    };


    const handleDepartmentChange = (e) => {

        setDepartment(e.target.value);
        setCurrentPage(1);

    };


    const formatMoney = (amount) => {

        return Number(amount || 0).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        );

    };


    const handlePrevious = () => {

        setCurrentPage((prev) =>
            Math.max(prev - 1, 1)
        );

    };


    const handleNext = () => {

        setCurrentPage((prev) =>
            Math.min(
                prev + 1,
                totalPages
            )
        );

    };
    const handleView = (row) => {
        
    if (!row?.id) {
        alert("Payroll ID not found.");
        return;
    }

         navigate(`/Payroll/Details/${row.id}`);

   };


    if (loading) {

        return (
            <div className="payroll-container">

                <div className="page-header">

                    <h2>
                        Payroll List
                    </h2>

                    <p>
                        Loading payroll records...
                    </p>

                </div>

            </div>
        );

    }


    return (

        <div className="payroll-container">


            <div className="page-header">

                <h2>
                    Payroll List
                </h2>

                <p>
                    Manage and view generated payroll records.
                </p>

            </div>



            {error && (

                <div className="card">

                    <p className="error-text">
                        {error}
                    </p>

                    <button
                        className="generate-btn"
                        onClick={fetchPayrolls}
                    >
                        Retry
                    </button>

                </div>

            )}



            <div className="card payroll-filter-card">

                <div className="payroll-filter-grid">

                    {/* Search */}

                    <div className="form-group">

                        <label>
                            Search Employee
                        </label>

                        <input
                            type="text"
                            placeholder="Employee ID or Name"
                            value={search}
                            onChange={
                                handleSearchChange
                            }
                        />

                    </div>


                    {/* Department */}

                    <div className="form-group">

                        <label>
                            Department
                        </label>

                        <select
                            value={department}
                            onChange={
                                handleDepartmentChange
                            }
                        >

                            <option value="All">
                                All
                            </option>

                            <option value="IT">
                                IT
                            </option>

                            <option value="HR">
                                HR
                            </option>

                            <option value="Finance">
                                Finance
                            </option>

                            <option value="Sales">
                                Sales
                            </option>

                            <option value="Marketing">
                                Marketing
                            </option>

                        </select>

                    </div>

                </div>

            </div>


        

            <div className="card table-card">

                <div className="table-responsive">

                    <table className="payroll-table">

                        <thead>

                            <tr>

                                <th>
                                    Employee ID
                                </th>

                                <th>
                                    Employee Name
                                </th>

                                <th>
                                    Department
                                </th>

                                <th>
                                    Payroll Month
                                </th>

                                <th>
                                    Year
                                </th>

                                <th>
                                    Net Salary
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {displayedRows.length > 0 ? (

                                displayedRows.map(
                                    (row) => {

                                        const employee =
                                            row.employee || {};


                                        const employeeId =
                                            employee.employee_id ||
                                            row.employee_id ||
                                            "-";


                                        const employeeName =
                                            `${employee.first_name || ""} ${
                                                employee.last_name || ""
                                            }`.trim() ||
                                            "-";


                                        const departmentName =
                                            employee.department ||
                                            "-";


                                        return (

                                            <tr
                                                key={row.id}
                                            >

                                                {/* Employee ID */}

                                                <td>
                                                    {employeeId}
                                                </td>


                                                {/* Employee Name */}

                                                <td>
                                                    {employeeName}
                                                </td>


                                                {/* Department */}

                                                <td>
                                                    {departmentName}
                                                </td>


                                                {/* Month */}

                                                <td>
                                                    {row.payroll_month ||
                                                        "-"}
                                                </td>


                                                {/* Year */}

                                                <td>
                                                    {row.payroll_year ||
                                                        "-"}
                                                </td>


                                                {/* Net Salary */}

                                                <td>

                                                    ₹{" "}

                                                    {formatMoney(
                                                        row.net_salary
                                                    )}

                                                </td>


                                                {/* Action */}

                                                <td>

                                                    <button
                                                        
                                                       type="button"
                                                       className="table-btn"
                                                       onClick={() => handleView(row)}
                                                       
                                                    >
                                                        View
                                                    </button>

                                                </td>

                                            </tr>

                                        );

                                    }
                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="no-data"
                                    >
                                        No payroll records found.
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

                <div className="pagination">

                    <button
                        type="button"
                        className="page-btn"
                        onClick={
                            handlePrevious
                        }
                        disabled={
                            currentPage === 1
                        }
                    >
                        Previous
                    </button>


                    <span>

                        Page{" "}
                        {currentPage}{" "}
                        of{" "}
                        {totalPages}

                    </span>


                    <button
                        type="button"
                        className="page-btn"
                        onClick={
                            handleNext
                        }
                        disabled={
                            currentPage === totalPages
                        }
                    >
                        Next
                    </button>

                </div>

            </div>

        </div>

    );

};

export default PayrollList;