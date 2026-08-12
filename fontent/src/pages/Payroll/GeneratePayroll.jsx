import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./GeneratePayroll.css";

const GeneratePayroll = () => {
    const navigate = useNavigate();

   
    
    const [employees, setEmployees] = useState([]);
    const [employeeId, setEmployeeId] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [loadingEmployees, setLoadingEmployees] = useState(false);
    const [employeeError, setEmployeeError] = useState("");

  
    const [formData, setFormData] = useState({
        employee_id: "",
        month: "August",
        year: "2026",

        working_days: 26,
        overtime_hours: 0,

        allowance: 0,
        bonus: 0,

        tax: 0,
        pf: 0,
        loan: 0,
        other: 0,
    });
  

useEffect(() => {
    fetchEmployees();
}, []);

const fetchEmployees = async () => {
    try {
        setLoadingEmployees(true);
        setEmployeeError("");

        const response = await axios.get(
            "http://localhost:8000/api/employees"
        );

        console.log("Employees API Response:", response.data);

        const data = response.data;

        if (data?.employees && Array.isArray(data.employees)) {
            setEmployees(data.employees);
        } else if (Array.isArray(data)) {
            setEmployees(data);
        } else {
            setEmployees([]);
            setEmployeeError("No employees found.");
        }

    } catch (error) {
        console.error("Employees fetch error:", error);

        setEmployees([]);

        setEmployeeError(
            error.response?.data?.message ||
            "Failed to fetch employees."
        );
    } finally {
        setLoadingEmployees(false);
    }
};
    const handleEmployeeIdChange = (e) => {
    const value = e.target.value;

    setEmployeeId(value);
    setEmployeeError("");

    if (!value.trim()) {
        setSelectedEmployee(null);

        setFormData((prev) => ({
            ...prev,
            employee_id: "",
        }));

        return;
    }

    const employee = employees.find(
        (emp) =>
            emp?.employee_id &&
            String(emp.employee_id)
                .toLowerCase()
                .trim() === value.toLowerCase().trim()
    );

    if (employee) {
        setSelectedEmployee(employee);

        setFormData((prev) => ({
            ...prev,
            employee_id: employee.employee_id,
        }));

        console.log("Selected Employee:", employee);
    } else {
        setSelectedEmployee(null);

        setFormData((prev) => ({
            ...prev,
            employee_id: "",
        }));
    }
};
   
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const workingDays =
        Number(formData.working_days) || 0;

    const overtimeHours =
        Number(formData.overtime_hours) || 0;

    const allowance =
        Number(formData.allowance) || 0;

    const bonus =
        Number(formData.bonus) || 0;

    const tax =
        Number(formData.tax) || 0;

    const pf =
        Number(formData.pf) || 0;

    const loan =
        Number(formData.loan) || 0;

    const other =
        Number(formData.other) || 0;

   
    const monthlySalary =
        Number(selectedEmployee?.salary) || 0;

   
    const dailyRate =
        workingDays > 0
            ? monthlySalary / workingDays
            : 0;

    
    const overtimeRate = 400;

   
    const basicSalary =
        workingDays * dailyRate;


    const overtimeSalary =
        overtimeHours * overtimeRate;

    // Total Earnings
    const totalEarnings =
        basicSalary +
        overtimeSalary +
        allowance +
        bonus;

   
    const totalDeductions =
        tax +
        pf +
        loan +
        other;

   
    const netSalary =
        totalEarnings -
        totalDeductions;

    const formatMoney = (amount) => {
        return Number(amount || 0).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        );
    };


    const handlePreview = () => {
        if (!selectedEmployee) {
            alert("Please enter a valid Employee ID.");
            return;
        }

        window.print();
    };

   const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEmployee) {
        alert("Please enter a valid Employee ID.");
        return;
    }

    const payrollData = {
        employee_id: selectedEmployee.employee_id,

        month: formData.month,
        year: Number(formData.year),

        working_days: workingDays,
        overtime_hours: overtimeHours,

        allowance: allowance,
        bonus: bonus,

        tax: tax,
        pf: pf,
        loan: loan,
        other: other,

        daily_salary: dailyRate,
        overtime_rate: overtimeRate,
        basic_salary: basicSalary,
        overtime: overtimeSalary,

        total_earnings: totalEarnings,
        total_deductions: totalDeductions,
        net_salary: netSalary,
    };

    try {
        const response = await axios.post(
            "http://localhost:8000/api/payroll/generate",
            payrollData
        );

        console.log("Payroll saved:", response.data);

        localStorage.setItem(
            "generatedPayroll",
            JSON.stringify(payrollData)
        );

        alert("Payroll generated successfully!");

        navigate("/Payslip");

    } catch (error) {
        console.error(
            "Payroll save error:",
            error.response?.data || error
        );

        alert(
            error.response?.data?.message ||
            "Failed to generate payroll."
        );
    }
};

   
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

  
    const years = [
        2024,
        2025,
        2026,
        2027,
        2028,
        2029,
        2030,
    ];

    return (
        <div className="payroll-container">


            <div className="page-header">

                <h1>
                    Generate Payroll
                </h1>

                <p>
                    Create employee payroll and preview salary details.
                </p>

            </div>

            <form onSubmit={handleSubmit}>

                <div className="payroll-grid">


                    <div className="card">

                        <h3>
                            Employee Information
                        </h3>

                        {/* Employee ID Search */}

                        <div className="form-group">

                            <label>
                                Employee ID
                            </label>

                            <input
                                type="text"
                                value={employeeId}
                                onChange={
                                    handleEmployeeIdChange
                                }
                                placeholder="Enter Employee ID"
                                autoComplete="off"
                            />

                            {loadingEmployees && (
                                <small>
                                    Loading employees...
                                </small>
                            )}

                            {!loadingEmployees &&
                                employeeId &&
                                !selectedEmployee && (
                                    <small className="error-text">
                                        Employee not found
                                    </small>
                                )}

                        </div>


                        {selectedEmployee && (

                            <div className="employee-result">

                                <div className="employee-result-row">

                                    <span>
                                        Employee ID
                                    </span>

                                    <strong>
                                        {
                                            selectedEmployee.employee_id
                                        }
                                    </strong>

                                </div>

                                <div className="employee-result-row">

                                    <span>
                                        Name
                                    </span>

                                    <strong>
                                        {
                                            `${selectedEmployee.first_name || ""} ${
                                                selectedEmployee.last_name || ""
                                            }`.trim()
                                        }
                                    </strong>

                                </div>

                                <div className="employee-result-row">

                                    <span>
                                        Department
                                    </span>

                                    <strong>
                                        {
                                            selectedEmployee.department ||
                                            "-"
                                        }
                                    </strong>

                                </div>

                                <div className="employee-result-row">

                                    <span>
                                        Designation
                                    </span>

                                    <strong>
                                        {
                                            selectedEmployee.designation ||
                                            "-"
                                        }
                                    </strong>

                                </div>

                                <div className="employee-result-row">

                                    <span>
                                        Salary
                                    </span>

                                    <strong>
                                        ₹{" "}
                                        {formatMoney(
                                            selectedEmployee.salary
                                        )}
                                    </strong>

                                </div>

                            </div>

                        )}

                        {/* API Error */}

                        {employeeError && (
                            <p className="error-text">
                                {employeeError}
                            </p>
                        )}

                       

                        <div className="row">

                            <div className="form-group">

                                <label>
                                    Month
                                </label>

                                <select
                                    name="month"
                                    value={formData.month}
                                    onChange={handleChange}
                                >

                                    {months.map(
                                        (month) => (
                                            <option
                                                key={month}
                                                value={month}
                                            >
                                                {month}
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>

                            <div className="form-group">

                                <label>
                                    Year
                                </label>

                                <select
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                >

                                    {years.map(
                                        (year) => (
                                            <option
                                                key={year}
                                                value={year}
                                            >
                                                {year}
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>

                        </div>


                        <div className="rate-box">

                            <div className="rate-row">

                                <span>
                                    Monthly Salary
                                </span>

                                <strong>
                                    ₹{" "}
                                    {formatMoney(
                                        monthlySalary
                                    )}
                                </strong>

                            </div>

                            <div className="rate-row">

                                <span>
                                    Daily Salary
                                </span>

                                <strong>
                                    ₹{" "}
                                    {formatMoney(
                                        dailyRate
                                    )}{" "}
                                    / Day
                                </strong>

                            </div>

                            <div className="rate-row">

                                <span>
                                    Overtime Rate
                                </span>

                                <strong>
                                    ₹{" "}
                                    {formatMoney(
                                        overtimeRate
                                    )}{" "}
                                    / Hour
                                </strong>

                            </div>

                        </div>

                        

                        <h3 className="section-title">
                            Attendance & Earnings
                        </h3>

                        {/* Working Days */}

                        <div className="form-group">

                            <label>
                                Working Days
                            </label>

                            <input
                                type="number"
                                name="working_days"
                                min="0"
                                step="1"
                                value={
                                    formData.working_days
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                            <small>
                                ₹
                                {formatMoney(
                                    dailyRate
                                )}{" "}
                                × {workingDays} days = ₹
                                {formatMoney(
                                    basicSalary
                                )}
                            </small>

                        </div>

                        {/* Overtime */}

                        <div className="form-group">

                            <label>
                                Overtime Hours
                            </label>

                            <input
                                type="number"
                                name="overtime_hours"
                                min="0"
                                step="0.5"
                                value={
                                    formData.overtime_hours
                                }
                                onChange={
                                    handleChange
                                }
                            />

                            <small>
                                ₹
                                {formatMoney(
                                    overtimeRate
                                )}{" "}
                                × {overtimeHours} hours = ₹
                                {formatMoney(
                                    overtimeSalary
                                )}
                            </small>

                        </div>

                        {/* Allowance */}

                        <div className="form-group">

                            <label>
                                Allowance
                            </label>

                            <input
                                type="number"
                                name="allowance"
                                min="0"
                                step="0.01"
                                value={
                                    formData.allowance
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                        {/* Bonus */}

                        <div className="form-group">

                            <label>
                                Bonus
                            </label>

                            <input
                                type="number"
                                name="bonus"
                                min="0"
                                step="0.01"
                                value={
                                    formData.bonus
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                    </div>


                    <div className="card">

                        <h3>
                            Deductions
                        </h3>

                        {/* Tax */}

                        <div className="form-group">

                            <label>
                                Income Tax
                            </label>

                            <input
                                type="number"
                                name="tax"
                                min="0"
                                step="0.01"
                                value={
                                    formData.tax
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                        {/* PF */}

                        <div className="form-group">

                            <label>
                                Provident Fund
                            </label>

                            <input
                                type="number"
                                name="pf"
                                min="0"
                                step="0.01"
                                value={
                                    formData.pf
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                        {/* Loan */}

                        <div className="form-group">

                            <label>
                                Loan
                            </label>

                            <input
                                type="number"
                                name="loan"
                                min="0"
                                step="0.01"
                                value={
                                    formData.loan
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                        {/* Other */}

                        <div className="form-group">

                            <label>
                                Other
                            </label>

                            <input
                                type="number"
                                name="other"
                                min="0"
                                step="0.01"
                                value={
                                    formData.other
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>


                        <div className="summary-card">

                            <h3>
                                Payroll Summary
                            </h3>

                            <div className="summary-row">

                                <span>
                                    Basic Salary
                                </span>

                                <strong>
                                    ₹{" "}
                                    {formatMoney(
                                        basicSalary
                                    )}
                                </strong>

                            </div>

                            <div className="summary-row">

                                <span>
                                    Overtime
                                </span>

                                <strong>
                                    ₹{" "}
                                    {formatMoney(
                                        overtimeSalary
                                    )}
                                </strong>

                            </div>

                            <div className="summary-row">

                                <span>
                                    Allowance
                                </span>

                                <strong>
                                    ₹{" "}
                                    {formatMoney(
                                        allowance
                                    )}
                                </strong>

                            </div>

                            <div className="summary-row">

                                <span>
                                    Bonus
                                </span>

                                <strong>
                                    ₹{" "}
                                    {formatMoney(
                                        bonus
                                    )}
                                </strong>

                            </div>

                            <div className="summary-row">

                                <span>
                                    Total Earnings
                                </span>

                                <strong>
                                    ₹{" "}
                                    {formatMoney(
                                        totalEarnings
                                    )}
                                </strong>

                            </div>

                            <div className="summary-row">

                                <span>
                                    Total Deductions
                                </span>

                                <strong className="red">
                                    ₹{" "}
                                    {formatMoney(
                                        totalDeductions
                                    )}
                                </strong>

                            </div>

                            <div className="summary-row total">

                                <span>
                                    Net Salary
                                </span>

                                <strong className="green">
                                    ₹{" "}
                                    {formatMoney(
                                        netSalary
                                    )}
                                </strong>

                            </div>

                            {/* Buttons */}

                            <div className="btn-group">

                                <button
                                    type="button"
                                    className="preview-btn"
                                    onClick={
                                        handlePreview
                                    }
                                    disabled={
                                        !selectedEmployee
                                    }
                                >
                                    Preview
                                </button>

                                <button
                                    type="submit"
                                    className="generate-btn"
                                    disabled={
                                        !selectedEmployee
                                    }
                                >
                                    Generate Payroll
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </form>

        </div>
    );
};

export default GeneratePayroll;