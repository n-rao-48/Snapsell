import axios from "axios";
import { useState } from "react";

function FileUpload() {
    const [file, setFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState("");
    const [message, setMessage] = useState("");

    const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
        setMessage("Please select a file to upload.");
        return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("http://localhost:8080/api/auctions/upload", formData, {
                headers: {
                "Content-Type": "multipart/form-data",
                },
            });
            setUploadedImageUrl(response.data); // Save the uploaded image URL
            setMessage("File uploaded successfully!");
        } catch (error) {
            setMessage("File upload failed: " + error.message);
        }
    };

    return (
        <div>
            <h2>Upload Product Image</h2>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload}>Upload</button>
                    {message && <p>{message}</p>}
                    {uploadedImageUrl && (
                        <div>
                            <h3>Uploaded Image:</h3>
                            <img src={uploadedImageUrl} alt="Uploaded" style={{ maxWidth: "100%", marginTop: "10px" }} />
                        </div>
                    )}
        </div>
    );
}

export default FileUpload;