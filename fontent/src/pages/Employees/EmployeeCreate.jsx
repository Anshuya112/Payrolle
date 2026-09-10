import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./EmployeeCreate.css";


function EmployeeCreate() {

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
    const [documents, setDocuments] = useState({
        aadhar_card: null,
        resume: null,
        pan_card: null,
        reports: null,
        experience_letter: null,
        other_document: null
    });


    const [errors, setErrors] = useState({});



    useEffect(() => {
        fetchDepartments();
    }, []);


    const fetchDepartments = async () => {
    try {
        setLoadingDepartments(true);

        const response = await axios.get(
            "http://127.0.0.1:8000/api/departments"
        );

        console.log("Departments API Response:", response.data);

        if (
            response.data?.success &&
            Array.isArray(response.data.departments)
        ) {
            setDepartments(response.data.departments);
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




    const handleDocumentChange = (e) => {

        setDocuments((prev) => ({
            ...prev,
            [e.target.name]: e.target.files[0]
        }));

    };

    const handleDepartmentChange = (departmentId) => {

        setSelectedDepartments((prev) => {

            if (prev.includes(departmentId)) {

                return prev.filter(
                    (id) => id !== departmentId
                );

            }

            return [
                ...prev,
                departmentId
            ];

        });

    };


    const saveEmployee = async (e) => {

        e.preventDefault();


        let validationErrors = {};


        if (!firstName.trim())
            validationErrors.firstName =
                "Please fill this field";


        if (!lastName.trim())
            validationErrors.lastName =
                "Please fill this field";


        if (!email.trim())
            validationErrors.email =
                "Please fill this field";


        if (!phone.trim())
            validationErrors.phone =
                "Please fill this field";


        // IMPORTANT
        if (selectedDepartments.length === 0)
            validationErrors.department =
                "Please select at least one department";


        if (!designation)
            validationErrors.designation =
                "Please select designation";


        if (!joiningDate)
            validationErrors.joiningDate =
                "Please select joining date";


        if (!salary)
            validationErrors.salary =
                "Please fill this field";


        if (!address.trim())
            validationErrors.address =
                "Please fill this field";


        if (!documents.aadhar_card)
            validationErrors.aadhar_card =
                "Aadhar Card is required";


        if (!documents.resume)
            validationErrors.resume =
                "Resume is required";


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

    selectedDepartments.forEach((departmentId) => {
        formData.append(
            "department_ids[]",
            departmentId
        );
    });

    formData.append("designation", designation);
    formData.append("joining_date", joiningDate);
    formData.append("salary", salary);
    formData.append("address", address);

    formData.append(
        "aadhar_card",
        documents.aadhar_card
    );

    formData.append(
        "resume",
        documents.resume
    );

    if (documents.pan_card) {
        formData.append(
            "pan_card",
            documents.pan_card
        );
    }

    if (documents.reports) {
        formData.append(
            "reports",
            documents.reports
        );
    }

    if (documents.experience_letter) {
        formData.append(
            "experience_letter",
            documents.experience_letter
        );
    }

    if (documents.other_document) {
        formData.append(
            "other_document",
            documents.other_document
        );
    }

    // API CALL
    const response = await axios.post(
        "http://localhost:8000/api/employees",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    console.log(
        "Employee Created:",
        response.data
    );

    // Show generated password
    alert(
        `Employee Saved Successfully\n\n` +
        `Employee ID: ${response.data.employee.employee_id}\n` +
        `Password: ${response.data.password}`
    );

    setErrors({});

    navigate("/Employee");

} catch (error) {

    console.error(
        "Employee save error:",
        error.response?.data || error
    );

    if (error.response?.status === 422) {

        const backendErrors =
            error.response.data.errors || {};

        console.log(
            "Validation Errors:",
            backendErrors
        );

        alert(
            JSON.stringify(
                backendErrors,
                null,
                2
            )
        );

    } else {

        alert(
            error.response?.data?.message ||
            "Something went wrong."
        );
    }
}


    };


    return (

        <>

            <div className="create-page">

                <div className="create-header">

                    <h2>
                        Create Employee
                    </h2>

                    <p>
                        Add a new employee to the payroll system
                    </p>

                </div>


                <div className="create-card">

                    <form onSubmit={saveEmployee}>


                        <div className="form-row">


                            <div className="form-group">

                                <label>
                                    First Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter First Name"
                                    value={firstName}
                                    onChange={(e) =>
                                        setFirstName(
                                            e.target.value
                                        )
                                    }
                                />

                                {errors.firstName && (

                                    <p className="error-text">
                                        {errors.firstName}
                                    </p>

                                )}

                            </div>


                            <div className="form-group">

                                <label>
                                    Last Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter Last Name"
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(
                                            e.target.value
                                        )
                                    }
                                />

                                {errors.lastName && (

                                    <p className="error-text">
                                        {errors.lastName}
                                    </p>

                                )}

                            </div>


                        </div>


                    

                        <div className="form-row">


                            <div className="form-group">

                                <label>
                                    Email
                                </label>

                                <input
                                    type="email"
                                    placeholder="Enter Email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                />

                                {errors.email && (

                                    <p className="error-text">
                                        {errors.email}
                                    </p>

                                )}

                            </div>


                            <div className="form-group">

                                <label>
                                    Phone
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter Mobile Number"
                                    value={phone}
                                    onChange={(e) =>
                                        setPhone(
                                            e.target.value
                                        )
                                    }
                                />

                                {errors.phone && (

                                    <p className="error-text">
                                        {errors.phone}
                                    </p>

                                )}

                            </div>


                        </div>


                        {/* Department + Designation */}

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
                                                        checked={selectedDepartments.includes(
                                                            dept.id
                                                        )}
                                                        onChange={() =>
                                                            handleDepartmentChange(
                                                                dept.id
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


                                {errors.department && (

                                    <p className="error-text">
                                        {errors.department}
                                    </p>

                                )}

                            </div>


                            {/* Designation */}

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


                                {errors.designation && (

                                    <p className="error-text">
                                        {errors.designation}
                                    </p>

                                )}

                            </div>


                        </div>


                        {/* Joining Date + Salary */}

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

                                {errors.joiningDate && (

                                    <p className="error-text">
                                        {errors.joiningDate}
                                    </p>

                                )}

                            </div>


                            <div className="form-group">

                                <label>
                                    Salary
                                </label>

                                <input
                                    type="number"
                                    placeholder="Enter Salary"
                                    value={salary}
                                    onChange={(e) =>
                                        setSalary(
                                            e.target.value
                                        )
                                    }
                                />

                                {errors.salary && (

                                    <p className="error-text">
                                        {errors.salary}
                                    </p>

                                )}

                            </div>


                        </div>


                        {/* Address */}

                        <div className="form-group">

                            <label>
                                Address
                            </label>

                            <textarea
                                rows="4"
                                placeholder="Enter Address"
                                value={address}
                                onChange={(e) =>
                                    setAddress(
                                        e.target.value
                                    )
                                }
                            />

                            {errors.address && (

                                <p className="error-text">
                                    {errors.address}
                                </p>

                            )}

                        </div>


                        {/* Documents */}

                        <div className="document-section">

                            <h3 className="document-title">
                                Employee Documents
                            </h3>


                            <div className="form-row">


                                <div className="form-group">

                                    <label>
                                        Aadhar Card
                                        {" "}
                                        <span className="required">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        type="file"
                                        name="aadhar_card"
                                        onChange={
                                            handleDocumentChange
                                        }
                                    />

                                    {errors.aadhar_card && (

                                        <p className="error-text">
                                            {errors.aadhar_card}
                                        </p>

                                    )}

                                </div>


                                <div className="form-group">

                                    <label>
                                        Resume
                                        {" "}
                                        <span className="required">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        type="file"
                                        name="resume"
                                        onChange={
                                            handleDocumentChange
                                        }
                                    />

                                    {errors.resume && (

                                        <p className="error-text">
                                            {errors.resume}
                                        </p>

                                    )}

                                </div>


                            </div>


                            <div className="form-row">


                                <div className="form-group">

                                    <label>
                                        PAN Card
                                        {" "}
                                        <span className="optional">
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
                                        {" "}
                                        <span className="optional">
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
                                        {" "}
                                        <span className="optional">
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
                                        {" "}
                                        <span className="optional">
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


                        </div>


                        {/* Buttons */}

                        <div className="button-group">


                            <button
                                type="submit"
                                className="save-btn"
                            >
                                Save Employee
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

        </>

    );
}


export default EmployeeCreate;