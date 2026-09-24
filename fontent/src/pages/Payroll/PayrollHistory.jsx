import { useEffect, useState } from "react";
import axios from "axios";
import "./GeneratePayroll.css";

const PayrollHistory = () => {

    const [historyData, setHistoryData] = useState([]);

    const [month, setMonth] = useState("All");
    const [year, setYear] = useState("All");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchPayrollHistory = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await axios.get(
                "http://localhost:8000/api/payroll/history",
                {
                    params: {
                        month,
                        year,
                    },
                }
            );

            console.log(
                "Payroll History API:",
                response.data
            );

            if (
                response.data?.payrolls &&
                Array.isArray(response.data.payrolls)
            ) {
                setHistoryData(response.data.payrolls);
            } else if (Array.isArray(response.data)) {
                setHistoryData(response.data);
            } else {
                setHistoryData([]);
            }

        } catch (error) {

            console.error(
                "Payroll history error:",
                error.response?.data || error
            );

            setHistoryData([]);

            setError(
                error.response?.data?.message ||
                "Failed to load payroll history."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchPayrollHistory();
    }, [month, year]);


    return (
        <div className="payroll-container">

            <div className="page-header">

                <h2>
                    Payroll History
                </h2>

                <p>
                    View previously generated payroll records.
                </p>

            </div>


            {/* Filters */}

            <div className="card payroll-filter-card">

                <div className="payroll-filter-grid">

                    <div className="form-group">

                        <label>
                            Month
                        </label>

                        <select
                            value={month}
                            onChange={(e) =>
                                setMonth(e.target.value)
                            }
                        >

                            <option value="All">
                                All
                            </option>

                            <option value="January">
                                January
                            </option>

                            <option value="February">
                                February
                            </option>

                            <option value="March">
                                March
                            </option>

                            <option value="April">
                                April
                            </option>

                            <option value="May">
                                May
                            </option>

                            <option value="June">
                                June
                            </option>

                            <option value="July">
                                July
                            </option>

                            <option value="August">
                                August
                            </option>

                            <option value="September">
                                September
                            </option>

                            <option value="October">
                                October
                            </option>

                            <option value="November">
                                November
                            </option>

                            <option value="December">
                                December
                            </option>

                        </select>

                    </div>


                    <div className="form-group">

                        <label>
                            Year
                        </label>

                        <select
                            value={year}
                            onChange={(e) =>
                                setYear(e.target.value)
                            }
                        >

                            <option value="All">
                                All
                            </option>

                            <option value="2024">
                                2024
                            </option>

                            <option value="2025">
                                2025
                            </option>

                            <option value="2026">
                                2026
                            </option>

                            <option value="2027">
                                2027
                            </option>

                            <option value="2028">
                                2028
                            </option>

                            <option value="2029">
                                2029
                            </option>

                            <option value="2030">
                                2030
                            </option>

                        </select>

                    </div>

                </div>

            </div>


            {/* Error */}

            {error && (
                <p className="error-text">
                    {error}
                </p>
            )}


            {/* Table */}

            <div className="card table-card">

                <div className="table-responsive">

                    <table className="payroll-table">

                        <thead>

                            <tr>

                                <th>
                                    Employee ID
                                </th>

                                <th>
                                    Employee
                                </th>

                                <th>
                                    Department
                                </th>

                                <th>
                                    Month
                                </th>

                                <th>
                                    Year
                                </th>

                                <th>
                                    Net Salary
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        style={{
                                            textAlign: "center",
                                        }}
                                    >
                                        Loading payroll history...
                                    </td>

                                </tr>

                            ) : historyData.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        style={{
                                            textAlign: "center",
                                        }}
                                    >
                                        No payroll records found.
                                    </td>

                                </tr>

                            ) : (

                                historyData.map((item) => {

                                    const employee =
                                        item.employee || {};

                                    const employeeName =
                                        `${employee.first_name || ""} ${
                                            employee.last_name || ""
                                        }`.trim() || "-";

                                    return (

                                        <tr key={item.id}>

                                            <td>
                                                {item.employee_id}
                                            </td>

                                            <td>
                                                {employeeName}
                                            </td>

                                            <td>
                                                {employee.department || "-"}
                                            </td>

                                            <td>
                                                {item.month}
                                            </td>

                                            <td>
                                                {item.year}
                                            </td>

                                            <td>
                                                ₹{" "}
                                                {Number(
                                                    item.net_salary || 0
                                                ).toLocaleString(
                                                    "en-IN",
                                                    {
                                                        minimumFractionDigits: 2,
                                                    }
                                                )}
                                            </td>

                                            <td>

                                                <span
                                                    className={`status-badge ${
                                                        (
                                                            item.status ||
                                                            "Generated"
                                                        ).toLowerCase()
                                                    }`}
                                                >
                                                    {item.status ||
                                                        "Generated"}
                                                </span>

                                            </td>

                                            <td>

                                                <button
                                                    className="table-btn"
                                                >
                                                    View
                                                </button>

                                                <button
                                                    className="table-btn download-btn"
                                                    style={{
                                                        marginLeft: "10px",
                                                    }}
                                                >
                                                    Download
                                                </button>

                                            </td>

                                        </tr>

                                    );

                                })

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
};

export default PayrollHistory;