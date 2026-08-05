import "./Dashboard.css";


function StatusCard(){

  return (
    <div className="status-page">

      <div className="status-header">

        <h2>
          Employee Status Card
        </h2>

        <p>
          Employee overview and current status
        </p>

      </div>


      <div className="status-cards">


        <div className="status-card active">

          <div className="status-icon">
            👥
          </div>

          <div>
            <h4>Active Employees</h4>
            <h2>735</h2>
            <span>Working Employees</span>
          </div>

        </div>



        <div className="status-card leave">

          <div className="status-icon">
            🏖️
          </div>

          <div>
            <h4>On Leave</h4>
            <h2>45</h2>
            <span>Currently Leave</span>
          </div>

        </div>



        <div className="status-card absent">

          <div className="status-icon">
            ⚠️
          </div>

          <div>
            <h4>Absent</h4>
            <h2>18</h2>
            <span>Today's Absent</span>
          </div>

        </div>



        <div className="status-card pending">

          <div className="status-icon">
            ⏳
          </div>

          <div>
            <h4>Pending Approval</h4>
            <h2>12</h2>
            <span>Waiting Approval</span>
          </div>

        </div>


      </div>



      <div className="status-details">


        <div className="detail-box">

          <h3>
            Attendance Summary
          </h3>


          <div className="progress-box">

            <div className="progress-bar">
              <span></span>
            </div>

            <p>
              92% Attendance Rate
            </p>

          </div>

        </div>



        <div className="detail-box">

          <h3>
            Employee Distribution
          </h3>


          <ul>

            <li>
              Full Time <b>850</b>
            </li>

            <li>
              Part Time <b>210</b>
            </li>

            <li>
              Contract <b>134</b>
            </li>

          </ul>


        </div>


      </div>


    </div>
  );

}


export default StatusCard;