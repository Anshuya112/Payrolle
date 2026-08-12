
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GeneratePayroll.css";

const Payslip = () => {

    const navigate = useNavigate();

    const [payroll, setPayroll] = useState(null);



    useEffect(() => {

        const savedPayroll =
            localStorage.getItem("generatedPayroll");

        if (savedPayroll) {

            setPayroll(JSON.parse(savedPayroll));

        } else {

            // Payroll data nahi mila
            navigate("/generate-payroll");

        }

    }, [navigate]);


    if (!payroll) {

        return (
            <div className="payroll-loading">
                Loading Salary Slip...
            </div>
        );

    }



    const formatMoney = (amount) => {

        return Number(amount || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    };



    const handlePrint = () => {

        window.print();

    };


    return (

        <div className="payroll-slip-page">

            <div className="salary-slip">



                <div className="slip-header">

                    <div>

                        <h1>
                            Salary Slip
                        </h1>

                        <p>
                            {payroll.month} {payroll.year}
                        </p>

                    </div>


                    <div>

                        <strong>
                            Payroll #{payroll.id}
                        </strong>

                    </div>

                </div>



                <div className="employee-info">


                 

                    <div className="info-box">

                        <span>
                            Employee
                        </span>

                        <strong>
                            {payroll.employee?.name || "-"}
                        </strong>

                    </div>



                  

                    <div className="info-box">

                        <span>
                            Working Days
                        </span>

                        <strong>
                            {payroll.working_days} Days
                        </strong>

                    </div>



                 

                    <div className="info-box">

                        <span>
                            Daily Salary
                        </span>

                        <strong>
                            ₹ {formatMoney(payroll.daily_salary)}
                        </strong>

                    </div>



                    

                    <div className="info-box">

                        <span>
                            Overtime
                        </span>

                        <strong>

                            {payroll.overtime_hours} Hours × ₹
                            {formatMoney(payroll.overtime_rate)}

                        </strong>

                    </div>

                </div>




                <div className="salary-columns">


                    <div className="salary-section">

                        <h3>
                            Earnings
                        </h3>


                        <div className="salary-row">

                            <span>
                                Basic Salary
                            </span>

                            <strong>
                                ₹ {formatMoney(payroll.basic_salary)}
                            </strong>

                        </div>


                        <div className="salary-row">

                            <span>
                                Allowance
                            </span>

                            <strong>
                                ₹ {formatMoney(payroll.allowance)}
                            </strong>

                        </div>


                        <div className="salary-row">

                            <span>
                                Bonus
                            </span>

                            <strong>
                                ₹ {formatMoney(payroll.bonus)}
                            </strong>

                        </div>


                        <div className="salary-row">

                            <span>
                                Overtime
                            </span>

                            <strong>
                                ₹ {formatMoney(payroll.overtime)}
                            </strong>

                        </div>


                        <div className="salary-row total-row">

                            <strong>
                                Total Earnings
                            </strong>

                            <strong>
                                ₹ {formatMoney(payroll.total_earnings)}
                            </strong>

                        </div>

                    </div>



                    <div className="salary-section">

                        <h3>
                            Deductions
                        </h3>


                        <div className="salary-row">

                            <span>
                                Income Tax
                            </span>

                            <strong>
                                ₹ {formatMoney(payroll.tax)}
                            </strong>

                        </div>


                        <div className="salary-row">

                            <span>
                                Provident Fund
                            </span>

                            <strong>
                                ₹ {formatMoney(payroll.pf)}
                            </strong>

                        </div>


                        <div className="salary-row">

                            <span>
                                Loan
                            </span>

                            <strong>
                                ₹ {formatMoney(payroll.loan)}
                            </strong>

                        </div>


                        <div className="salary-row">

                            <span>
                                Other
                            </span>

                            <strong>
                                ₹ {formatMoney(payroll.other)}
                            </strong>

                        </div>


                        <div className="salary-row total-row">

                            <strong>
                                Total Deductions
                            </strong>

                            <strong>
                                ₹ {formatMoney(payroll.total_deductions)}
                            </strong>

                        </div>

                    </div>

                </div>



                <div className="net-salary">

                    <span>
                        Net Salary
                    </span>

                    <span>
                        ₹ {formatMoney(payroll.net_salary)}
                    </span>

                </div>



                <div className="slip-actions">

                    <button
                        type="button"
                        className="back-btn"
                        onClick={() =>
                            navigate("/generate-payroll")
                        }
                    >
                        Back
                    </button>


                    <button
                        type="button"
                        className="print-btn"
                        onClick={handlePrint}
                    >
                        Print Salary Slip
                    </button>

                </div>

            </div>

        </div>

    );

};

export default Payslip;
