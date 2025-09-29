import "./FileUpload.css";

const FileUpload = ({ onFileChange }) => {
  const handle = (e) => {
    const f = e.target.files[0];
    if (onFileChange) onFileChange(f);
  };

  return (
    <div className="file-upload">
      <input type="file" accept="image/*" onChange={handle} />
    </div>
  );
};

export default FileUpload;
