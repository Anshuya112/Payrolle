import "./EmployeeCreate.css";

function EmployeeProfile() {

return (

<div className="create-page">

  <div className="create-header">

    <h2>Employee Profile</h2>

    <p>View employee details</p>

  </div>

  

  <div className="create-card">


    <div className="profile-top">

      <div className="profile-image">

        <img
          src="https://via.placeholder.com/120"
          alt="Employee"
        />

      </div>

      <div className="profile-info">

        <h3>Anshu Yadav</h3>

        <p>Software Developer</p>

        <span>Employee ID : EMP001</span>

      </div>

    </div>







    <div className="form-row">

      <div className="form-group">

        <label>First Name</label>

        <input
          type="text"
          value=""
          readOnly
        />

      </div>

      <div className="form-group">

        <label>Last Name</label>

        <input
          type="text"
          value=""
          readOnly
        />

      </div>

    </div>




    <div className="form-row">

      <div className="form-group">

        <label>Email</label>

        <input
          type="email"
          value=""
          readOnly
        />

      </div>

      <div className="form-group">

        <label>Phone</label>

        <input
          type="text"
          value=""
          readOnly
        />

      </div>

    </div>




    <div className="form-row">

      <div className="form-group">

        <label>Department</label>

        <input
          type="text"
          value=" "
          readOnly
        />

      </div>

      <div className="form-group">

        <label>Designation</label>

        <input
          type="text"
          value=" "
          readOnly
        />

      </div>

    </div>




    <div className="form-row">

      <div className="form-group">

        <label>Joining Date</label>

        <input
          type="text"
          value=""
          readOnly
        />

      </div>

      <div className="form-group">

        <label>Salary</label>

        <input
          type="text"
          value=""
          readOnly
        />

      </div>

    </div>




    <div className="form-group">

      <label>Address</label>

      <textarea
        rows="4"
        value=" "
        readOnly
      ></textarea>

    </div>

    {/*DETAILS END*/}





    {/*BUTTON START*/}

    <div className="button-group">

      <button
        className="save-btn"
      >
        Edit Profile
      </button>

      <button
        className="cancel-btn"
      >
        Back
      </button>

    </div>

    {/*BUTTON END*/}



  </div>

  {/*PROFILE CARD END*/}

</div>

);

}

export default EmployeeProfile;