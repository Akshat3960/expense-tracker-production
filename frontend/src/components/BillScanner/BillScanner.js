import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';
import './BillScanner.css';

const BillScanner = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [billId, setBillId] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  const [editedData, setEditedData] = useState({
    merchantName: '',
    totalAmount: '',
    date: '',
    category: 'Other'
  });

  const fileInputRef = useRef(null);

  const categories = [
    'Food', 'Transport', 'Shopping', 'Bills', 
    'Entertainment', 'Health', 'Education', 'Other'
  ];

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setError('');
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('bill', selectedFile);

    try {
      const res = await api.post('/api/bills/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setBillId(res.data.billId);
      setUploading(false);
      setProcessing(true);

      pollStatus(res.data.billId);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Error uploading bill');
      setUploading(false);
    }
  };

  const pollStatus = async (id) => {
    const maxAttempts = 30;
    let attempts = 0;

    const interval = setInterval(async () => {
      attempts++;

      try {
        const res = await api.get(`/api/bills/status/${id}`);

        if (res.data.status === 'processed') {
          clearInterval(interval);
          setProcessing(false);
          setParsedData(res.data.parsedData);
          
          setEditedData({
            merchantName: res.data.parsedData.merchantName || '',
            totalAmount: res.data.parsedData.totalAmount?.toString() || '',
            date: res.data.parsedData.date 
              ? new Date(res.data.parsedData.date).toISOString().split('T')[0]
              : new Date().toISOString().split('T')[0],
            category: res.data.parsedData.items?.[0]?.category || 'Other'
          });
        } else if (res.data.status === 'failed' || attempts >= maxAttempts) {
          clearInterval(interval);
          setProcessing(false);
          setError('Failed to process bill. Please try again with a clearer image.');
        }
      } catch (err) {
        clearInterval(interval);
        setProcessing(false);
        setError('Error checking status');
      }
    }, 2000);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleEditChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveEdits = () => {
    if (!editedData.merchantName.trim()) {
      setError('Merchant name cannot be empty');
      return;
    }

    const amount = parseFloat(editedData.totalAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!editedData.date) {
      setError('Please select a date');
      return;
    }

    setError('');
    setIsEditing(false);
    
    setParsedData(prev => ({
      ...prev,
      merchantName: editedData.merchantName,
      totalAmount: parseFloat(editedData.totalAmount),
      date: editedData.date
    }));
  };

  const handleCreateExpense = async () => {
    try {
      await api.post(`/api/bills/create-expense/${billId}`, {
        customTitle: editedData.merchantName,
        customAmount: parseFloat(editedData.totalAmount),
        customDate: editedData.date,
        customCategory: editedData.category
      });

      alert('Expense created successfully!');
      resetForm();
      navigate('/expense');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating expense');
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreview(null);
    setParsedData(null);
    setBillId(null);
    setError('');
    setIsEditing(false);
    setEditedData({
      merchantName: '',
      totalAmount: '',
      date: '',
      category: 'Other'
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bill-scanner-container">
      <button onClick={() => navigate('/dashboard')} className="btn-back">
        ← Back to Dashboard
      </button>
      
      <div className="bill-scanner-card">
        <h2>📸 Scan Your Bill</h2>
        <p className="subtitle">Upload a photo of your receipt and we'll extract the details automatically</p>

        {!parsedData ? (
          <>
            <div className="upload-section">
              {preview ? (
                <div className="preview-container">
                  <img src={preview} alt="Bill preview" className="bill-preview" />
                  <button onClick={resetForm} className="btn-reset">
                    Choose Different Image
                  </button>
                </div>
              ) : (
                <div
                  className="drop-zone"
                  onClick={() => fileInputRef.current.click()}
                >
                  <div className="drop-zone-content">
                    <span className="upload-icon">📤</span>
                    <p>Click to upload or drag and drop</p>
                    <p className="file-info">JPG, PNG, GIF (max 5MB)</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                </div>
              )}
            </div>

            {error && <div className="error-message">{error}</div>}

            {selectedFile && !uploading && !processing && (
              <button onClick={handleUpload} className="btn-scan">
                Scan Bill
              </button>
            )}

            {uploading && (
              <div className="status-message">
                <div className="spinner"></div>
                <p>Uploading bill...</p>
              </div>
            )}

            {processing && (
              <div className="status-message">
                <div className="spinner"></div>
                <p>Processing bill... This may take up to 30 seconds</p>
                <p className="hint">Tip: Better quality images give better results</p>
              </div>
            )}
          </>
        ) : (
          <div className="parsed-results">
            <div className="results-header">
              <h3>✅ Bill Scanned Successfully!</h3>
              <button 
                onClick={handleEditToggle} 
                className={`btn-edit ${isEditing ? 'editing' : ''}`}
              >
                {isEditing ? '✏️ Editing' : '✏️ Edit Details'}
              </button>
            </div>
            
            {error && <div className="error-message">{error}</div>}

            <div className="parsed-info">
              {isEditing ? (
                <>
                  <div className="edit-row">
                    <label>Merchant Name:</label>
                    <input
                      type="text"
                      value={editedData.merchantName}
                      onChange={(e) => handleEditChange('merchantName', e.target.value)}
                      className="edit-input"
                      placeholder="Enter merchant name"
                    />
                  </div>
                  
                  <div className="edit-row">
                    <label>Total Amount:</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editedData.totalAmount}
                      onChange={(e) => handleEditChange('totalAmount', e.target.value)}
                      className="edit-input"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="edit-row">
                    <label>Date:</label>
                    <input
                      type="date"
                      value={editedData.date}
                      onChange={(e) => handleEditChange('date', e.target.value)}
                      className="edit-input"
                    />
                  </div>

                  <div className="edit-row">
                    <label>Category:</label>
                    <select
                      value={editedData.category}
                      onChange={(e) => handleEditChange('category', e.target.value)}
                      className="edit-input"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="edit-actions">
                    <button onClick={handleSaveEdits} className="btn-save">
                      ✓ Save Changes
                    </button>
                    <button onClick={handleEditToggle} className="btn-cancel">
                      ✕ Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="info-row">
                    <label>Merchant:</label>
                    <span>{editedData.merchantName}</span>
                  </div>
                  <div className="info-row">
                    <label>Total Amount:</label>
                    <span className="amount">${parseFloat(editedData.totalAmount).toFixed(2)}</span>
                  </div>
                  <div className="info-row">
                    <label>Date:</label>
                    <span>{new Date(editedData.date).toLocaleDateString()}</span>
                  </div>
                  <div className="info-row">
                    <label>Category:</label>
                    <span className="category-badge">{editedData.category}</span>
                  </div>
                  <div className="info-row">
                    <label>Confidence:</label>
                    <span>{parsedData.confidence?.toFixed(0)}%</span>
                  </div>
                </>
              )}
            </div>

            {parsedData.items && parsedData.items.length > 0 && !isEditing && (
              <div className="items-section">
                <h4>Detected Line Items:</h4>
                <div className="items-list">
                  {parsedData.items.map((item, index) => (
                    <div key={index} className="item-row">
                      <span className="item-desc">{item.description}</span>
                      <span className="item-category">{item.category}</span>
                      <span className="item-amount">${item.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isEditing && (
              <div className="action-buttons">
                <button onClick={handleCreateExpense} className="btn-create-expense">
                  Create Expense
                </button>
                <button onClick={resetForm} className="btn-secondary">
                  Scan Another Bill
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BillScanner;