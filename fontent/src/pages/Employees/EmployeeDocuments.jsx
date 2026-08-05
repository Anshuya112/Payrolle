
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./EmployeeCreate.css";

function EmployeeDocuments(){

    const [documents,setDocuments] = useState([]);

    const {id} = useParams();


    useEffect(()=>{

        axios.get(
        `http://localhost:8000/api/employee-documents/${id}`
        )
        .then((response)=>{

            setDocuments(response.data.documents);

        })
        .catch((error)=>{

            console.log(error);

        });


    },[id]);



    return (

        <div className="create-page">

            <div className="create-header">

                <h2>
                    Employee Documents
                </h2>

            </div>


            <div className="create-card">

                <table className="document-table">

                    <thead>

                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>File</th>
                        <th>Action</th>
                    </tr>

                    </thead>


                    <tbody>

                    {
                    documents.map((doc,index)=>(

                        <tr key={index}>

                            <td>{index+1}</td>

                            <td>{doc.name}</td>

                            <td>
                                {doc.file ?? "Not Uploaded"}
                            </td>


                            <td>

                            {
                            doc.url &&
                            <a
                            href={doc.url}
                            target="_blank"
                            >
                            View
                            </a>
                            }

                            </td>


                        </tr>

                    ))
                    }

                    </tbody>


                </table>


            </div>


        </div>

    );


}


export default EmployeeDocuments;