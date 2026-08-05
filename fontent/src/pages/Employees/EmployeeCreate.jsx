import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./EmployeeCreate.css";


function EmployeeCreate() {


  const navigate = useNavigate();
const [firstName,setFirstName] = useState("");
const [lastName,setLastName] = useState("");
const [email,setEmail] = useState("");
const [phone,setPhone] = useState("");
const [department,setDepartment] = useState("");
const [designation,setDesignation] = useState("");
const [joiningDate,setJoiningDate] = useState("");
const [salary,setSalary] = useState("");
const [address,setAddress] = useState("");

const [documents,setDocuments] = useState({
  aadhar_card:null,
  resume:null,
  pan_card:null,
  reports:null,
  experience_letter:null,
  other_document:null
});


const [errors,setErrors] = useState({});

const handleDocumentChange = (e)=>{

setDocuments({
  ...documents,
  [e.target.name]:e.target.files[0]
});

};


const saveEmployee = async(e)=>{

e.preventDefault();


    let validationErrors = {};

    if (!firstName)
        validationErrors.firstName = "Please fill this field";

    if (!lastName)
        validationErrors.lastName = "Please fill this field";

    if (!email)
        validationErrors.email = "Please fill this field";

    if (!phone)
        validationErrors.phone = "Please fill this field";

    if (!department)
        validationErrors.department = "Please select department";

    if (!designation)
        validationErrors.designation = "Please select designation";

    if (!joiningDate)
        validationErrors.joiningDate = "Please select joining date";

    if (!salary)
        validationErrors.salary = "Please fill this field";

    if (!address)
        validationErrors.address = "Please fill this field";

    if (!documents.aadhar_card)
        validationErrors.aadhar_card = "Aadhar Card is required";

    if (!documents.resume)
        validationErrors.resume = "Resume is required";

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
        return;
    }

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

        formData.append("aadhar_card", documents.aadhar_card);
        formData.append("resume", documents.resume);

        if (documents.pan_card)
            formData.append("pan_card", documents.pan_card);

        if (documents.reports)
            formData.append("reports", documents.reports);

        if (documents.experience_letter)
            formData.append("experience_letter", documents.experience_letter);

        if (documents.other_document)
            formData.append("other_document", documents.other_document);




        const response = await axios.post(
            "http://localhost:8000/api/employees",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        console.log(response.data);

        alert("Employee Saved Successfully");

        setErrors({});

    } catch (error) {

        console.log(error.response);

        console.log(error.response?.data);

        console.log(error.response?.data?.errors);

        if (error.response?.status === 422) {
            alert(JSON.stringify(error.response.data.errors, null, 2));
        } else {
            alert("Something went wrong.");
        }
        
    }
}



    return (
    <>

    <div className="create-page">         

        <div className="create-header">    

            <h2>Create Employee</h2>

            <p>Add a new employee to the payroll system</p>

        </div>                            

        <div className="create-card">      

            <form onSubmit={saveEmployee}>

                <div className="form-row">            


                    <div className="form-group">        
                        
                       <label>First Name</label>
                        
                        <input
                           type="text"
                           placeholder="Enter First Name"
                           value={firstName}
                           onChange={(e)=>setFirstName(e.target.value)}
                        />

                       {
                          errors.firstName &&
                           <p className="error-text">
                             {errors.firstName}
                           </p>
                       }
                    
                    </div>                             
                    
                    
        
                     <div className="form-group">       
                 
                         <label>Last Name</label>
                             
                         <input
                          type="text"
                          placeholder="Enter Last Name"
                          value={lastName}
                          onChange={(e)=>setLastName(e.target.value)}
                         />
          
                       {
                         errors.lastName &&
                         <p className="error-text">
                            {errors.lastName}
                         </p>
                       }
         
                    </div>                              

         
                </div>                                  


                <div className="form-row">              


                    <div className="form-group">       
               
                       <label>Email</label>
               
                       <input
                           type="email"
                           placeholder="Enter Email"
                           value={email}
                           onChange={(e)=>setEmail(e.target.value)}
                       />
               
                       {
                      errors.email &&
                     <p className="error-text">
                         {errors.email}
                     </p>
                      }
        
                    </div>                              
        
                   <div className="form-group">        
                         
                     <label>Phone</label>
                 
                        <input
                             type="text"
                             placeholder="Enter Mobile Number"
                             value={phone}
                             onChange={(e)=>setPhone(e.target.value)}
                        />
                 
                       {
                         errors.phone &&
                            <p className="error-text">
                                 {errors.phone}
                            </p>
                        }
                 
                    </div>                             
                 
                 
                </div>  

                <div className="form-row">              


                    <div className="form-group">       

                        <label>Department</label>

                        <select
                            value={department}
                            onChange={(e)=>setDepartment(e.target.value)}>
                
                            <option value="">
                                Select Department
                            </option>
                
                            <option value="IT">
                                IT
                            </option>
                
                            <option value="HR">
                                HR
                            </option>
                
                            <option value="Finance">
                                Finance
                            </option>
                
                            <option value="Sales">
                                Sales
                            </option>
                
                        </select>
                
                        {
                            errors.department &&
                            <p className="error-text">
                                {errors.department}
                            </p>
                        }
                
                    </div>                      

                    <div className="form-group">     

                        <label>Designation</label>

                        <select
                           value={designation}
                           onChange={(e)=>setDesignation(e.target.value)}>

                        <option value="">
                            Select Designation
                        </option>
            
                        <option value="Developer">
                            Developer
                        </option>
            
                        <option value="Manager">
                            Manager
                        </option>
            
                        <option value="Accountant">
                            Accountant
                        </option>
            
                        </select>
            
                        {
                        errors.designation &&
                        <p className="error-text">
                            {errors.designation}
                        </p>
                       }
            
                    </div>                            
                    
                    
                </div>                                
            
                <div className="form-row">              


                    <div className="form-group">       
               
                        <label>Joining Date</label>
               
                       <input
                            type="date"
                            value={joiningDate}
                           onChange={(e)=>setJoiningDate(e.target.value)}
                       />
               
                       {
                            errors.joiningDate &&
                            <p className="error-text">
                                {errors.joiningDate}
                            </p>
                        }
                 
                    </div>                              
        
                    <div className="form-group">        
                 
                        <label>Salary</label>

                        <input
                            type="number"
                            placeholder="Enter Salary"
                            value={salary}
                            onChange={(e)=>setSalary(e.target.value)}
                        />
                
                        {
                            errors.salary &&
                            <p className="error-text">
                                {errors.salary}
                            </p>
                        }
                
                    </div>                              
                

                </div>                                
             

                <div className="form-group">


                    <label>Address</label>


                    <textarea

                      rows="4"

                      placeholder="Enter Address"

                      value={address}

                       onChange={(e)=>setAddress(e.target.value)}>

                    </textarea>


                    {
                      errors.address &&
                      <p className="error-text">
                        {errors.address}
                      </p>
                    }



                </div>


                      {/* DOCUMENT SECTION START */}

                <div className="document-section">

                    <h3 className="document-title">
                        Employee Documents
                    </h3>
                    
                    
                    <div className="form-row">
                    
                    
                       <div className="form-group">
                    
                           <label>
                               Aadhar Card <span className="required">*</span>
                           </label> 
                           <input
                               type="file"
                               name="aadhar_card"
                              onChange={handleDocumentChange}
                            />
                    
                            {
                              errors.aadhar_card &&
                              <p className="error-text">
                                {errors.aadhar_card}
                              </p>
                            }
                           
                        </div>



                        <div className="form-group">
                       
                          <label>
                            Resume <span className="required">*</span>
                          </label>
                       
                            <input
                              type="file"
                               name="resume"
                               onChange={handleDocumentChange}
                            />
                       
                            {
                              errors.resume &&
                               <p className="error-text">
                                  {errors.resume}
                               </p>
                            }

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


                </div>

                  {/* DOCUMENT SECTION END */}
                <div className="button-group">


                    <button
                       type="submit"
                        className="save-btn">
                        Save Employee
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
 </>                               

);


}


export default EmployeeCreate;