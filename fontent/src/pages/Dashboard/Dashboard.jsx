import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
  import { Link } from "react-router-dom";

import "./Dashboard.css";


function Dashboard() {

  const collection = [
    {day:"18", value:400},
    {day:"19", value:250},
    {day:"20", value:500},
    {day:"21", value:350},
    {day:"22", value:300},
    {day:"23", value:450},
  ];


  const salary = [
    {month:"Jan", amount:5000},
    {month:"Feb", amount:7000},
    {month:"Mar", amount:6000},
    {month:"Apr", amount:9000},
  ];


  return (

    // MAIN DASHBOARD START
    <div className="dashboard-Links">


      {/* HEADER START */}
      <div className="top">

        <div>
          <h2>Good afternoon, Admin</h2>
          <p>Friday, 24 July 2026</p>
        </div>


        <div className="user">
          Admin
        </div>

      </div>
      {/* HEADER END */}



      {/* TOP CARDS ROW START */}
      <div className="grid">


        {/* COLLECTION CARD START */}
        <div className="box">

          <h4>Collected Today</h4>

          <h1>₹32,800</h1>

          <span className="green">
            ▲ 27% vs yesterday
          </span>


          <ResponsiveContainer width="100%" height={100}>

            <LineChart data={collection}>

              <Line 
                dataKey="value"
                stroke="#159f7b"
              />

            </LineChart>

          </ResponsiveContainer>



          <div className="bottom">

            <div>
              This Month
              <b>₹4,84,255</b>
            </div>


            <div>
              Pending Invoice
              <b>92</b>
            </div>

          </div>


        </div>
        {/* COLLECTION CARD END */}




        {/* EMPLOYEE STATUS START */}
        <div className="box">

          <h4>Employee Status</h4>

          <h1>1194</h1>


          <div className="progress">
            <span></span>
          </div>


          <div className="status">

            <p>
              Active <b>735</b>
            </p>

            <p>
              Disabled <b>183</b>
            </p>

            <p>
              Suspended <b>258</b>
            </p>

            <p>
              Pending <b>18</b>
            </p>

          </div>


        </div>
        {/* EMPLOYEE STATUS END */}






        {/* ATTENTION CARD START */}
        <div className="box">


          <h4>Needs Attention</h4>


          <ul className="attention">

            <li>
              Not Verified
              <b>1190</b>
            </li>


            <li>
              Expiring in 7 days
              <b>47</b>
            </li>


            <li>
              Pending Invoice
              <b>92</b>
            </li>


            <li>
              Open Complaints
              <b>5</b>
            </li>


          </ul>


        </div>
        {/* ATTENTION CARD END */}



      </div>
      {/* TOP CARDS ROW END */}






      {/* BOTTOM CHART ROW START */}
      <div className="grid bottom-grid">



        {/* SALARY CHART START */}
        <div className="box">
                 <Link to="/ActivityList" className="dash-link">
                   Activity List
                 </Link>

          <h4>Salary Collection</h4>


          <ResponsiveContainer width="100%" height={200}>


            <BarChart data={salary}>


              <XAxis dataKey="month"/>

              <YAxis/>

              <Tooltip/>


              <Bar
                dataKey="amount"
                fill="#2563eb"
              />


            </BarChart>


          </ResponsiveContainer>


        </div>
        {/* SALARY CHART END */}






        {/* ATTENDANCE CHART START */}
        <div className="box">


          <h4>Daily Attendance</h4>


          <ResponsiveContainer width="100%" height={200}>


            <LineChart data={collection}>


              <Line
                dataKey="value"
                stroke="#f97316"
              />


            </LineChart>


          </ResponsiveContainer>


        </div>
        {/* ATTENDANCE CHART END */}






        {/* OVERVIEW START */}
        <div className="box">
                    

          <h4>Employee Overview</h4>


          <div className="info">
            Active Employee                  
            <strong>220</strong>
          </div>


          <div className="info">
            On Leave
            <strong>25</strong>
          </div>


          <div className="info">
            Absent
            <strong>10</strong>
          </div>


        </div>
        {/* OVERVIEW END */}



      </div>
      {/* BOTTOM CHART ROW END */}

      {/* Dashboard Quick Links START */}

          <div className="dashboard-links">
          
            <Link to="/ActivityList" className="dash-link">
              Activity List
            </Link>
          
          
            <Link to="/SalaryChart" className="dash-link">
              Salary Chart
            </Link>
          
          
            <Link to="/StatusCard" className="dash-link">
              Status Card
            </Link>
          
          </div>

           {/* Dashboard Quick Links END */}

    </div>
    // MAIN DASHBOARD END


    

  );
  

}


export default Dashboard;