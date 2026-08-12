import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./GeneratePayroll.css";

const PayrollDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [payroll, setPayroll] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchPayrollDetails();
    }, [id]);

    const fetchPayrollDetails = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `http://localhost:8000/api/payrolls/${id}`
            );

            console.log(
                "Payroll Details Response:",
                response.data
            );

            const data = response.data;

            setPayroll(
                data.payroll || data
            );

        } catch (error) {
            console.error(
                "Payroll details error:",
                error.response?.data || error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load payroll details."
            );
        } finally {
            setLoading(false);
        }
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

    if (loading) {
        return (
            <div className="payroll-container">
                <div className="page-header">
                    <h2>Payroll Details</h2>
                    <p>Loading payroll details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="payroll-container">
                <div className="page-header">
                    <h2>Payroll Details</h2>
                </div>

                <div className="card">
                    <p className="error-text">
                        {error}
                    </p>

                    <button
                        className="generate-btn"
                        onClick={() => navigate("/PayrollList")}
                    >
                        Back to Payroll List
                    </button>
                </div>
            </div>
        );
    }

    if (!payroll) {
        return (
            <div className="payroll-container">
                <div className="card">
                    <p>No payroll record found.</p>
                </div>
            </div>
        );
    }

    const employee = payroll.employee || {};

    const employeeId =
        employee.employee_id ||
        payroll.employee_id ||
        "-";

    const employeeName =
        `${employee.first_name || ""} ${
            employee.last_name || ""
        }`.trim() || "-";

    const department =
        employee.department || "-";

    const designation =
        employee.designation || "-";

    const totalEarnings =
        Number(payroll.total_earnings || 0);

    const totalDeductions =
        Number(payroll.total_deductions || 0);

    const netSalary =
        Number(
            payroll.net_salary ??
            totalEarnings - totalDeductions
        );

    return (
        <div className="payroll-container">

            <div className="page-header">

                <h2>
                    Payroll Details
                </h2>

                <p>
                    Employee salary information
                    and payroll summary.
                </p>

            </div>

            {/* Employee Information */}

            <div className="card">

                <h3>
                    Employee Information
                </h3>

                <div className="details-grid">

                    <div>
                        <label>
                            Employee ID
                        </label>

                        <p>
                            {employeeId}
                        </p>
                    </div>

                    <div>
                        <label>
                            Employee Name
                        </label>

                        <p>
                            {employeeName}
                        </p>
                    </div>

                    <div>
                        <label>
                            Department
                        </label>

                        <p>
                            {department}
                        </p>
                    </div>

                    <div>
                        <label>
                            Designation
                        </label>

                        <p>
                            {designation}
                        </p>
                    </div>

                    <div>
                        <label>
                            Payroll Month
                        </label>

                        <p>
                            {payroll.payroll_month || "-"}
                            {" "}
                            {payroll.payroll_year || ""}
                        </p>
                    </div>

                    <div>
                        <label>
                            Working Days
                        </label>

                        <p>
                            {payroll.working_days || 0}
                        </p>
                    </div>

                </div>

            </div>

            {/* Earnings + Deductions */}

            <div className="payroll-grid">

                {/* Earnings */}

                <div className="card">

                    <h3>
                        Earnings
                    </h3>

                    <table className="salary-table">

                        <tbody>

                            <tr>
                                <td>
                                    Basic Salary
                                </td>

                                <td>
                                    ₹{" "}
                                    {formatMoney(
                                        payroll.basic_salary
                                    )}
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    Allowance
                                </td>

                                <td>
                                    ₹{" "}
                                    {formatMoney(
                                        payroll.allowance
                                    )}
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    Bonus
                                </td>

                                <td>
                                    ₹{" "}
                                    {formatMoney(
                                        payroll.bonus
                                    )}
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    Overtime
                                </td>

                                <td>
                                    ₹{" "}
                                    {formatMoney(
                                        payroll.overtime
                                    )}
                                </td>
                            </tr>

                            <tr className="table-total">

                                <td>
                                    Total Earnings
                                </td>

                                <td>
                                    ₹{" "}
                                    {formatMoney(
                                        totalEarnings
                                    )}
                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

               

                <div className="card">

                    <h3>
                        Deductions
                    </h3>

                    <table className="salary-table">

                        <tbody>

                            <tr>
                                <td>
                                    Income Tax
                                </td>

                                <td>
                                    ₹{" "}
                                    {formatMoney(
                                        payroll.tax
                                    )}
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    Provident Fund
                                </td>

                                <td>
                                    ₹{" "}
                                    {formatMoney(
                                        payroll.pf
                                    )}
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    Loan
                                </td>

                                <td>
                                    ₹{" "}
                                    {formatMoney(
                                        payroll.loan
                                    )}
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    Other
                                </td>

                                <td>
                                    ₹{" "}
                                    {formatMoney(
                                        payroll.other_deduction
                                    )}
                                </td>
                            </tr>

                            <tr className="table-total deduction-total">

                                <td>
                                    Total Deductions
                                </td>

                                <td>
                                    ₹{" "}
                                    {formatMoney(
                                        totalDeductions
                                    )}
                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </div>


            <div className="card">

                <div className="net-salary-box">

                    <h2>
                        Net Salary
                    </h2>

                    <h1>
                        ₹ {formatMoney(netSalary)}
                    </h1>

                    <p>
                        Payroll generated successfully.
                    </p>

                </div>

                <div className="btn-group">

                    <button
                        type="button"
                        className="preview-btn"
                        onClick={() => window.print()}
                    >
                        🖨 Print
                    </button>

                    <button
                        type="button"
                        className="generate-btn"
                        onClick={() =>
                            navigate("/PayrollList")
                        }
                    >
                        Back to Payroll List
                    </button>

                </div>

            </div>

        </div>
    );
};

export default PayrollDetails;
