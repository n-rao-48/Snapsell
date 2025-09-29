// CreateAuction.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUpload from "../api/components/FileUpload";
import auctionService from "../services/auctionService";
import "./CreateAuction.css";

export default function CreateAuction() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [duration, setDuration] = useState("7");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const nav = useNavigate();

  const categories = ["Mobiles", "Laptops", "Books", "Electronics", "Furniture", "Accessories"];
  const conditions = ["New", "Excellent", "Good", "Fair"];
  const durations = [
    { value: "3", label: "3 Days" },
    { value: "7", label: "7 Days" },
    { value: "14", label: "14 Days" },
    { value: "30", label: "30 Days" }
  ];

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const validateStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        return name.trim() && category && condition;
      case 2:
        return file;
      case 3:
        return price && Number(price) > 0;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    } else {
      alert("Please fill in all required fields");
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = "";
      if (file) {
        imageUrl = await auctionService.uploadImage(file);
      }
      
      const payload = {
        name,
        price: Number(price),
        category,
        condition,
        description,
        imageUrl,
        owner: { id: 1 },
        type: "PUBLIC",
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + Number(duration) * 24 * 3600 * 1000).toISOString(),
        status: "ACTIVE",
      };
      
      await auctionService.createAuction(payload);
      alert("Auction created successfully!");
      nav("/auctions");
    } catch (err) {
      console.error(err);
      alert("Failed to create auction. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const stepTitles = ["Item Details", "Upload Photos", "Set Price", "Review & Publish"];
  const progress = (step / stepTitles.length) * 100;

  return (
    <div className="create-auction-container">
      <div className="create-header">
        <h1>Create New Auction</h1>
        <p>List your item and start selling to fellow students</p>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="step-indicators">
          {stepTitles.map((title, index) => (
            <div
              key={index}
              className={`step-indicator ${step > index + 1 ? 'completed' : step === index + 1 ? 'active' : ''}`}
            >
              <div className="step-number">
                {step > index + 1 ? (
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span className="step-title">{title}</span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="auction-form">
        {/* Step 1: Item Details */}
        {step === 1 && (
          <div className="form-step">
            <h2 className="step-heading">Tell us about your item</h2>
            
            <div className="form-group">
              <label className="form-label">
                Item Name <span className="required">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., iPhone 13 Pro Max 256GB"
                className="form-input"
                required
              />
              <span className="form-hint">Be specific and descriptive</span>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Category <span className="required">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Condition <span className="required">*</span>
                </label>
                <div className="condition-buttons">
                  {conditions.map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      className={`condition-btn ${condition === cond ? 'active' : ''}`}
                      onClick={() => setCondition(cond)}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your item's features, condition, and any other relevant details..."
                className="form-textarea"
                rows="5"
              />
              <span className="form-hint">{description.length} / 500 characters</span>
            </div>
          </div>
        )}

        {/* Step 2: Upload Photos */}
        {step === 2 && (
          <div className="form-step">
            <h2 className="step-heading">Add photos of your item</h2>
            <p className="step-description">Good photos help your item sell faster!</p>

            <div className="upload-section">
              {preview ? (
                <div className="preview-container">
                  <img src={preview} alt="Preview" className="preview-image" />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                    }}
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="upload-area">
                  <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <h3>Drag & drop or click to upload</h3>
                  <p>PNG, JPG up to 10MB</p>
                  <FileUpload onFileChange={handleFileChange} />
                </div>
              )}
            </div>

            <div className="photo-tips">
              <h4>📸 Photo Tips:</h4>
              <ul>
                <li>Use good lighting</li>
                <li>Show all angles of the item</li>
                <li>Include any defects or wear</li>
                <li>Use a clean, simple background</li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 3: Set Price */}
        {step === 3 && (
          <div className="form-step">
            <h2 className="step-heading">Set your starting price</h2>
            
            <div className="price-section">
              <div className="form-group">
                <label className="form-label">
                  Starting Bid <span className="required">*</span>
                </label>
                <div className="price-input-wrapper">
                  <span className="currency-symbol">₹</span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="1000"
                    className="form-input price-input"
                    required
                    min="1"
                  />
                </div>
                <span className="form-hint">Set a competitive starting price</span>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Auction Duration <span className="required">*</span>
                </label>
                <div className="duration-buttons">
                  {durations.map((dur) => (
                    <button
                      key={dur.value}
                      type="button"
                      className={`duration-btn ${duration === dur.value ? 'active' : ''}`}
                      onClick={() => setDuration(dur.value)}
                    >
                      <span className="duration-value">{dur.label.split(' ')[0]}</span>
                      <span className="duration-label">Days</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pricing-info">
                <div className="info-card">
                  <h4>💡 Pricing Tips</h4>
                  <ul>
                    <li>Research similar items</li>
                    <li>Start lower to attract bidders</li>
                    <li>Consider item condition</li>
                    <li>Factor in demand</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="form-step">
            <h2 className="step-heading">Review your listing</h2>
            
            <div className="review-section">
              <div className="review-card">
                {preview && (
                  <img src={preview} alt={name} className="review-image" />
                )}
                <div className="review-details">
                  <h3 className="review-title">{name}</h3>
                  
                  <div className="review-meta">
                    <span className="review-badge">{category}</span>
                    <span className="review-badge">{condition}</span>
                  </div>

                  <p className="review-description">
                    {description || "No description provided"}
                  </p>

                  <div className="review-pricing">
                    <div className="price-detail">
                      <span className="price-label">Starting Bid</span>
                      <span className="price-value">₹{price}</span>
                    </div>
                    <div className="price-detail">
                      <span className="price-label">Duration</span>
                      <span className="price-value">{duration} days</span>
                    </div>
                  </div>

                  <div className="review-dates">
                    <p><strong>Starts:</strong> {new Date().toLocaleDateString()}</p>
                    <p><strong>Ends:</strong> {new Date(Date.now() + Number(duration) * 24 * 3600 * 1000).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="terms-section">
                <label className="checkbox-label">
                  <input type="checkbox" required />
                  <span>I agree to the <a href="/terms">Terms & Conditions</a></span>
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" required />
                  <span>I confirm that all information provided is accurate</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="form-navigation">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="btn-secondary"
              disabled={loading}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
          )}
          
          {step < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="btn-primary"
              disabled={!validateStep(step)}
            >
              Next
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              type="submit"
              className="btn-primary btn-publish"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Publish Auction
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

/* CreateAuction.css */