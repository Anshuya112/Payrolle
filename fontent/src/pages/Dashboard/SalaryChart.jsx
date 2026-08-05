import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

import "./Dashboard.css";


function SalaryChart(){


  const monthlySalary = [
    {month:"Jan", salary:45000},
    {month:"Feb", salary:52000},
    {month:"Mar", salary:68000},
    {month:"Apr", salary:58000},
    {month:"May", salary:75000},
    {month:"Jun", salary:82000}
  ];



  const departmentSalary = [
    {dept:"IT", amount:85000},
    {dept:"HR", amount:45000},
    {dept:"Sales", amount:65000},
    {dept:"Finance", amount:55000}
  ];



return(


/* ================= MAIN PAGE START ================= */

<div className="salary-page">



  {/* ================= HEADER START ================= */}

  <div className="salary-header">

    <h2>
      Salary Chart
    </h2>

    <p>
      Monthly salary analysis and payroll report
    </p>

  </div>

  {/* ================= HEADER END ================= */}






  {/* ================= SUMMARY CARDS START ================= */}

  <div className="salary-cards">



    {/* CARD 1 START */}
    <div className="salary-card blue">

      <h4>
        Total Salary
      </h4>

      <h2>
        ₹4,85,000
      </h2>

    </div>
    {/* CARD 1 END */}





    {/* CARD 2 START */}
    <div className="salary-card green">

      <h4>
        Paid Salary
      </h4>

      <h2>
        ₹4,20,000
      </h2>

    </div>
    {/* CARD 2 END */}





    {/* CARD 3 START */}
    <div className="salary-card orange">

      <h4>
        Pending Salary
      </h4>

      <h2>
        ₹65,000
      </h2>

    </div>
    {/* CARD 3 END */}



  </div>

  {/* ================= SUMMARY CARDS END ================= */}









  {/* ================= CHART SECTION START ================= */}

  <div className="chart-grid">





    {/* ================= MONTHLY CHART START ================= */}

    <div className="chart-box">


      <h3>
        Monthly Salary
      </h3>



      <ResponsiveContainer
        width="100%"
        height={300}
      >


        <AreaChart data={monthlySalary}>


          <CartesianGrid strokeDasharray="3 3"/>


          <XAxis 
            dataKey="month"
          />


          <YAxis />


          <Tooltip />



          <Area
            type="monotone"
            dataKey="salary"
            stroke="#2563eb"
            fill="#93c5fd"
          />



        </AreaChart>


      </ResponsiveContainer>



    </div>

    {/* ================= MONTHLY CHART END ================= */}









    {/* ================= DEPARTMENT CHART START ================= */}

    <div className="chart-box">


      <h3>
        Department Salary
      </h3>



      <ResponsiveContainer
        width="100%"
        height={300}
      >


        <BarChart data={departmentSalary}>


          <XAxis 
            dataKey="dept"
          />


          <YAxis />


          <Tooltip />



          <Bar
            dataKey="amount"
            fill="#16a34a"
          />


        </BarChart>


      </ResponsiveContainer>



    </div>

    {/* ================= DEPARTMENT CHART END ================= */}





  </div>

  {/* ================= CHART SECTION END ================= */}







</div>

/* ================= MAIN PAGE END ================= */


)


}


export default SalaryChart;