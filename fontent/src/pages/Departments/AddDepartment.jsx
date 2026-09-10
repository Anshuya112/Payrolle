import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddDepartment.css";

const AddDepartment = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status: "Active",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        if (!formData.name.trim()) {
            setError("Department name is required.");
            return;
        }

        try {

            setLoading(true);

            const response = await axios.post(
                "http://localhost:8000/api/departments",
                {
                    name: formData.name.trim(),
                    description: formData.description.trim(),
                    status: formData.status,
                }
            );

            console.log(
                "Department created:",
                response.data
            );

            alert(
                "Department added successfully!"
            );

            navigate("/DepartmentList");

        } catch (error) {

            console.error(
                "Department create error:",
                error.response?.data || error
            );

            setError(
                error.response?.data?.message ||
                "Failed to add department."
            );

        } finally {

            setLoading(false);
        }
    };


    return (
        <div className="payroll-container">

            {/* Page Header */}

            <div className="page-header">

                <h1>
                    Add Department
                </h1>

                <p>
                    Create a new department for your organization.
                </p>

            </div>


            {/* Form */}

            <form onSubmit={handleSubmit}>

                <div className="card">

                    <h3>
                        Department Information
                    </h3>


                    {error && (
                        <div className="error-text">
                            {error}
                        </div>
                    )}


                    {/* Department Name */}

                    <div className="form-group">

                        <label>
                            Department Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter department name"
                            required
                        />

                    </div>


                    {/* Description */}

                    <div className="form-group">

                        <label>
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter department description"
                            rows="5"
                        />

                    </div>


                    {/* Status */}

                    <div className="form-group">

                        <label>
                            Status
                        </label>

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >

                            <option value="Active">
                                Active
                            </option>

                            <option value="Inactive">
                                Inactive
                            </option>

                        </select>

                    </div>


                    {/* Buttons */}

                    <div className="btn-group">

                        <button
                            type="button"
                            className="preview-btn"
                            onClick={() =>
                                navigate("/DepartmentList")
                            }
                            disabled={loading}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="generate-btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : "Add Department"}
                        </button>

                    </div>

                </div>

            </form>

        </div>
    );
};

export default AddDepartment;