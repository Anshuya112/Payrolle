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

   
    const [departments, setDepartments] = useState([]);
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [loadingDepartments, setLoadingDepartments] = useState(false);

    
    const [designation, setDesignation] = useState("");
    const [joiningDate, setJoiningDate] = useState("");
    const [salary, setSalary] = useState("");
    const [address, setAddress] = useState("");

   
    const [oldDocuments, setOldDocuments] = useState({
        aadhar_card: "",
        resume: "",
        pan_card: "",
        reports: "",
        experience_letter: "",
        other_document: ""
    });

    
    const [documents, setDocuments] = useState({
        aadhar_card: null,
        resume: null,
        pan_card: null,
        reports: null,
        experience_letter: null,
        other_document: null
    });


    useEffect(() => {

        getEmployee();
        fetchDepartments();

    }, []);


    const fetchDepartments = async () => {

        try {

            setLoadingDepartments(true);

            const response = await axios.get(
                "http://localhost:8000/api/departments"
            );

            const data = response.data;

            if (Array.isArray(data)) {

                setDepartments(data);

            } else if (
                Array.isArray(data.departments)
            ) {

                setDepartments(data.departments);

            } else {

                setDepartments([]);

            }

        } catch (error) {

            console.error(
                "Department fetch error:",
                error.response?.data || error
            );

            setDepartments([]);

        } finally {

            setLoadingDepartments(false);

        }

    };


    const getEmployee = async () => {

        try {

            const response = await axios.get(
                `http://localhost:8000/api/employees/${id}`
            );

            console.log(
                "EDIT EMPLOYEE DATA:",
                response.data
            );

            const emp =
                response.data.employee ||
                response.data;


        

            setFirstName(
                emp.first_name || ""
            );

            setLastName(
                emp.last_name || ""
            );

            setEmail(
                emp.email || ""
            );

            setPhone(
                emp.phone || ""
            );

            setDesignation(
                emp.designation || ""
            );

            setJoiningDate(
                emp.joining_date || ""
            );

            setSalary(
                emp.salary || ""
            );

            setAddress(
                emp.address || ""
            );


         

            const employeeDepartments =
                Array.isArray(emp.departments)
                    ? emp.departments
                    : [];


            setSelectedDepartments(
                employeeDepartments.map(
                    (dept) => Number(dept.id)
                )
            );


          

            setOldDocuments({

                aadhar_card:
                    emp.aadhar_card || "",

                resume:
                    emp.resume || "",

                pan_card:
                    emp.pan_card || "",

                reports:
                    emp.reports || "",

                experience_letter:
                    emp.experience_letter || "",

                other_document:
                    emp.other_document || ""

            });

        } catch (error) {

            console.error(
                "Get employee error:",
                error.response?.data || error
            );

            alert("Employee Not Found");

        }

    };


    const handleDepartmentChange = (
        departmentId
    ) => {

        setSelectedDepartments((prev) => {

            // Remove department
            if (
                prev.includes(departmentId)
            ) {

                return prev.filter(
                    (id) =>
                        id !== departmentId
                );

            }

            // Add department
            return [
                ...prev,
                departmentId
            ];

        });

    };



    const handleDocumentChange = (e) => {

        const {
            name,
            files
        } = e.target;

        setDocuments((prev) => ({

            ...prev,

            [name]:
                files && files.length > 0
                    ? files[0]
                    : null

        }));

    };


    const updateEmployee = async (e) => {

        e.preventDefault();

        try {

            const formData = new FormData();



            formData.append(
                "first_name",
                firstName
            );

            formData.append(
                "last_name",
                lastName
            );

            formData.append(
                "email",
                email
            );

            formData.append(
                "phone",
                phone
            );


            selectedDepartments.forEach(
                (departmentId) => {

                    formData.append(
                        "department_ids[]",
                        departmentId
                    );

                }
            );


            formData.append(
                "designation",
                designation
            );

            formData.append(
                "joining_date",
                joiningDate
            );

            formData.append(
                "salary",
                salary
            );

            formData.append(
                "address",
                address
            );



            Object.keys(documents).forEach(
                (key) => {

                    if (documents[key]) {

                        formData.append(
                            key,
                            documents[key]
                        );

                    }

                }
            );



            await axios.post(

                `http://localhost:8000/api/employees/${id}?_method=PUT`,

                formData,

                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data"
                    }
                }

            );


            alert(
                "Employee Updated Successfully"
            );


            navigate("/Employee");


        } catch (error) {

            console.error(
                "Employee update error:",
                error.response?.data || error
            );

            alert(
                error.response?.data?.message ||
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

                <form
                    onSubmit={updateEmployee}
                >
                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                First Name
                            </label>

                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) =>
                                    setFirstName(
                                        e.target.value
                                    )
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
                                onChange={(e) =>
                                    setLastName(
                                        e.target.value
                                    )
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
                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Phone
                            </label>

                            <input
                                type="text"
                                value={phone}
                                onChange={(e) =>
                                    setPhone(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                    </div>


                    <div className="form-row">


                        {/* Departments */}

                        <div className="form-group">

                            <label>
                                Departments
                            </label>


                            {loadingDepartments ? (

                                <p>
                                    Loading departments...
                                </p>

                            ) : departments.length === 0 ? (

                                <p className="error-text">
                                    No departments available.
                                </p>

                            ) : (

                                <div className="department-checkbox-list">

                                    {departments.map(
                                        (dept) => (

                                            <label
                                                key={dept.id}
                                                className="department-checkbox-item"
                                            >

                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        selectedDepartments.includes(
                                                            Number(
                                                                dept.id
                                                            )
                                                        )
                                                    }
                                                    onChange={() =>
                                                        handleDepartmentChange(
                                                            Number(
                                                                dept.id
                                                            )
                                                        )
                                                    }
                                                />

                                                <span>
                                                    {dept.name}
                                                </span>

                                            </label>

                                        )
                                    )}

                                </div>

                            )}


                            {selectedDepartments.length > 0 && (

                                <small>

                                    {
                                        selectedDepartments.length
                                    }

                                    {" "}

                                    department

                                    {
                                        selectedDepartments.length >
                                        1
                                            ? "s"
                                            : ""
                                    }

                                    {" selected"}

                                </small>

                            )}

                        </div>


                      

                        <div className="form-group">

                            <label>
                                Designation
                            </label>

                            <select
                                value={designation}
                                onChange={(e) =>
                                    setDesignation(
                                        e.target.value
                                    )
                                }
                            >

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
                                onChange={(e) =>
                                    setJoiningDate(
                                        e.target.value
                                    )
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
                                onChange={(e) =>
                                    setSalary(
                                        e.target.value
                                    )
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
                            onChange={(e) =>
                                setAddress(
                                    e.target.value
                                )
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
                                onChange={
                                    handleDocumentChange
                                }
                            />


                            {oldDocuments.aadhar_card && (

                                <p>

                                    <a
                                        href={`http://localhost:8000/storage/${oldDocuments.aadhar_card}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        View Existing Aadhar Card
                                    </a>

                                </p>

                            )}

                        </div>


                        <div className="form-group">

                            <label>
                                Resume
                            </label>

                            <input
                                type="file"
                                name="resume"
                                onChange={
                                    handleDocumentChange
                                }
                            />

                        </div>

                    </div>

                    <div className="form-row">


                        <div className="form-group">

                            <label>

                                PAN Card

                                <span className="optional">
                                    {" "}
                                    (Optional)
                                </span>

                            </label>

                            <input
                                type="file"
                                name="pan_card"
                                onChange={
                                    handleDocumentChange
                                }
                            />

                        </div>


                        <div className="form-group">

                            <label>

                                Reports

                                <span className="optional">
                                    {" "}
                                    (Optional)
                                </span>

                            </label>

                            <input
                                type="file"
                                name="reports"
                                onChange={
                                    handleDocumentChange
                                }
                            />

                        </div>

                    </div>

                    <div className="form-row">


                        <div className="form-group">

                            <label>

                                Experience Letter

                                <span className="optional">
                                    {" "}
                                    (Optional)
                                </span>

                            </label>

                            <input
                                type="file"
                                name="experience_letter"
                                onChange={
                                    handleDocumentChange
                                }
                            />

                        </div>


                        <div className="form-group">

                            <label>

                                Other Document

                                <span className="optional">
                                    {" "}
                                    (Optional)
                                </span>

                            </label>

                            <input
                                type="file"
                                name="other_document"
                                onChange={
                                    handleDocumentChange
                                }
                            />

                        </div>

                    </div>



                    <div className="button-group">

                        <button
                            type="submit"
                            className="save-btn"
                        >
                            Update Employee
                        </button>


                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() =>
                                navigate("/Employee")
                            }
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