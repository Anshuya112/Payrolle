import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./EmployeeCreate.css";


function EmployeeEdit() {

    const { id } = useParams();
    const navigate = useNavigate();


    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [department, setDepartment] = useState("");
    const [designation, setDesignation] = useState("");
    const [joiningDate, setJoiningDate] = useState("");
    const [salary, setSalary] = useState("");
    const [address, setAddress] = useState("");
    const [oldDocuments, setOldDocuments] = useState({
           aadhar_card:"",
           resume:"",
           pan_card:"",
           reports:"",
           experience_letter:"",
           other_document:""
       });
    


    const [documents, setDocuments] = useState({
        aadhar_card: null,
        resume: null,
        pan_card: null,
        reports: null,
        experience_letter: null,
        other_document: null
    });



    // GET EMPLOYEE DATA

    useEffect(() => {

        getEmployee();

    }, []);



    const getEmployee = async () => {

    try {

        const response = await axios.get(
            `http://localhost:8000/api/employees/${id}`
        );

        console.log("EDIT EMPLOYEE DATA:", response.data);

        const emp = response.data.employee || response.data;


        setFirstName(emp.first_name || "");
        setLastName(emp.last_name || "");
        setEmail(emp.email || "");
        setPhone(emp.phone || "");
        setDepartment(emp.department || "");
        setDesignation(emp.designation || "");
        setJoiningDate(emp.joining_date || "");
        setSalary(emp.salary || "");
        setAddress(emp.address || "");

         setOldDocuments({

            aadhar_card: emp.aadhar_card || "",
            resume: emp.resume || "",
            pan_card: emp.pan_card || "",
            reports: emp.reports || "",
            experience_letter: emp.experience_letter || "",
            other_document: emp.other_document || ""

        });

    }
    catch(error){

        console.log(error.response);

        alert("Employee Not Found");

    }

};





    const handleDocumentChange = (e) => {


        setDocuments({

            ...documents,

            [e.target.name]: e.target.files[0]

        });


    };







    // UPDATE EMPLOYEE

    const updateEmployee = async (e) => {

        e.preventDefault();


        try {


            const formData = new FormData();


            formData.append("first_name", firstName);
            formData.append("last_name", lastName);
            formData.append("email", email);
            formData.append("phone", phone);
            formData.append("department", department);
            formData.append("designation", designation);
            formData.append("joining_date", joiningDate);
            formData.append("salary", salary);
            formData.append("address", address);



            Object.keys(documents).forEach((key)=>{


                if(documents[key]){

                    formData.append(
                        key,
                        documents[key]
                    );

                }


            });




            await axios.post(

                `http://localhost:8000/api/employees/${id}?_method=PUT`,

                formData,

                {
                    headers:{
                        "Content-Type":
                        "multipart/form-data"
                    }
                }

            );



            alert(
                "Employee Updated Successfully"
            );


            navigate("/employees");


        }
        catch(error){


            console.log(error.response);


            alert(
                "Update Failed"
            );


        }


    };








    return (

        <div className="create-page">


            <div className="create-header">

                <h2>
                    Edit Employee
                </h2>

                <p>
                    Update employee information
                </p>

            </div>





            <div className="create-card">


                <form onSubmit={updateEmployee}>


                    <div className="form-row">


                        <div className="form-group">

                            <label>
                                First Name
                            </label>


                            <input

                                type="text"

                                value={firstName}

                                onChange={
                                    e=>setFirstName(e.target.value)
                                }

                            />

                        </div>





                        <div className="form-group">

                            <label>
                                Last Name
                            </label>


                            <input

                                type="text"

                                value={lastName}

                                onChange={
                                    e=>setLastName(e.target.value)
                                }

                            />

                        </div>


                    </div>







                    <div className="form-row">


                        <div className="form-group">


                            <label>
                                Email
                            </label>


                            <input

                                type="email"

                                value={email}

                                onChange={
                                    e=>setEmail(e.target.value)
                                }

                            />


                        </div>





                        <div className="form-group">


                            <label>
                                Phone
                            </label>


                            <input

                                value={phone}

                                onChange={
                                    e=>setPhone(e.target.value)
                                }

                            />


                        </div>


                    </div>







                    <div className="form-row">


                        <div className="form-group">


                            <label>
                                Department
                            </label>


                            <select

                                value={department}

                                onChange={
                                    e=>setDepartment(e.target.value)
                                }

                            >

                                <option>IT</option>
                                <option>HR</option>
                                <option>Finance</option>
                                <option>Sales</option>


                            </select>


                        </div>





                        <div className="form-group">


                            <label>
                                Designation
                            </label>


                            <select

                                value={designation}

                                onChange={
                                    e=>setDesignation(e.target.value)
                                }

                            >

                                <option>Developer</option>
                                <option>Manager</option>
                                <option>Accountant</option>


                            </select>


                        </div>


                    </div>







                    <div className="form-row">


                        <div className="form-group">

                            <label>
                                Joining Date
                            </label>


                            <input

                                type="date"

                                value={joiningDate}

                                onChange={
                                    e=>setJoiningDate(e.target.value)
                                }

                            />


                        </div>





                        <div className="form-group">


                            <label>
                                Salary
                            </label>


                            <input

                                type="number"

                                value={salary}

                                onChange={
                                    e=>setSalary(e.target.value)
                                }

                            />


                        </div>


                    </div>







                    <div className="form-group">


                        <label>
                            Address
                        </label>


                        <textarea

                            rows="4"

                            value={address}

                            onChange={
                                e=>setAddress(e.target.value)
                            }

                        />


                    </div>







                    <h3>
                        Update Documents
                    </h3>



                    <div className="form-row">


                        <div className="form-group">


                            <label>
                                Aadhar Card
                            </label>


                            <input

                                type="file"

                                name="aadhar_card"

                                onChange={handleDocumentChange}

                            />

                              
                           {
                              oldDocuments.aadhar_card &&

                              <p>
                              <a
                              href={`http://localhost:8000/storage/${oldDocuments.aadhar_card}`}
                              target="_blank"
                              >
                              View Existing Aadhar Card
                              </a>
                              </p>

                            }


                        </div>





                        <div className="form-group">


                            <label>
                                Resume
                            </label>


                            <input

                                type="file"

                                name="resume"

                                onChange={handleDocumentChange}

                            />


                        </div>


                    </div>




                     
                    <div className="form-row">


                        <div className="form-group">

                            <label>
                                PAN Card <span className="optional">(Optional)</span>
                            </label>

                            <input
                               type="file"
                                 name="pan_card"
                                 onChange={handleDocumentChange}
                            />

                        </div>



                       <div className="form-group">

                           <label>
                             Reports <span className="optional">(Optional)</span>
                           </label >
                           <input
                             type="file"
                             name="reports"
                             onChange={handleDocumentChange}
                           />

                        </div>


                    </div>



                    <div className="form-row">


                        <div className="form-group">

                           <label>
                              Experience Letter <span className="optional">(Optional)</span>
                           </label>
                    
                            <input
                              type="file"
                              name="experience_letter"
                              onChange={handleDocumentChange}
                            />

                        </div>



                        <div className="form-group">

                           <label>
                             Other Document <span className="optional">(Optional)</span>
                           </label>
                     
                           <input
                             type="file"
                             name="other_document"
                             onChange={handleDocumentChange}
                           />

                        </div>
                        </div>



                    <div className="button-group">


                         <button type="submit" className="save-btn">
                           Update Employee
                         </button>

                        <button
                          type="button"
                          className="cancel-btn"
                          onClick={() => navigate("/Employee")}
                         >
                           Cancel
                         </button>

            

                    </div>



                </form>


            </div>


        </div>


    );


}


export default EmployeeEdit;