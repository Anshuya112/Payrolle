import "./Dashboard.css";


function ActivityList(){


  const activities = [
    {
      id:1,
      title:"New Employee Added",
      user:"Anshu Yadav",
      date:"24 July 2026",
      status:"Completed"
    }

  ];



  return (

    // MAIN PAGE START
    <div className="activity-page">


      {/* HEADER START */}
      <div className="activity-header">

        <h2>
          Activity List
        </h2>

        <p>
          Recent payroll system activities
        </p>

      </div>
      {/* HEADER END */}




      {/* TABLE CARD START */}
      <div className="activity-card">



        {/* TABLE START */}
        <table>



          {/* TABLE HEADER START */}
          <thead>

            <tr>

              <th>#</th>

              <th>
                Activity
              </th>

              <th>
                User
              </th>

              <th>
                Date
              </th>

              <th>
                Status
              </th>

            </tr>

          </thead>
          {/* TABLE HEADER END */}





          {/* TABLE BODY START */}
          <tbody>


          {
            activities.map((item)=>(


              // ROW START
              <tr key={item.id}>


                <td>
                  {item.id}
                </td>




                {/* ACTIVITY COLUMN START */}
                <td>

                  <div className="activity-name">


                    <div className="icon">
                      ✓
                    </div>


                    {item.title}


                  </div>

                </td>
                {/* ACTIVITY COLUMN END */}





                <td>
                  {item.user}
                </td>




                <td>
                  {item.date}
                </td>




                {/* STATUS START */}
                <td>


                  <span
                    className={
                      item.status === "Pending"
                      ? "pending"
                      : "success"
                    }
                  >

                    {item.status}

                  </span>


                </td>
                {/* STATUS END */}



              </tr>
              // ROW END


            ))
          }



          </tbody>
          {/* TABLE BODY END */}




        </table>
        {/* TABLE END */}



      </div>
      {/* TABLE CARD END */}



    </div>
    // MAIN PAGE END

  );


}


export default ActivityList;