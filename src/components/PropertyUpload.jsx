import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Property Upload Component - LocalStorage Demo Version
 * 
 * Features:
 * - Upload property details (single)
 * - Bulk upload via CSV/Excel
 * - Image upload simulation
 * - Preview properties
 * - Edit/Delete properties
 */

// ============================================
// LOCALSTORAGE SERVICE
// ============================================

const PROPERTIES_KEY = 'smartrent_properties';

/**
 * Get all properties from LocalStorage
 */
const getProperties = () => {
  try {
    const properties = localStorage.getItem(PROPERTIES_KEY);
    return properties ? JSON.parse(properties) : [];
  } catch (error) {
    return [];
  }
};

/**
 * Save properties to LocalStorage
 */
const saveProperties = (properties) => {
  try {
    localStorage.setItem(PROPERTIES_KEY, JSON.stringify(properties));
  } catch (error) {
    console.error('Error saving properties:', error);
  }
};

// ============================================
// CSV PARSER
// ============================================

/**
 * Parse CSV data
 */
const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    if (values.length === headers.length) {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = values[index];
      });
      data.push(obj);
    }
  }
  return data;
};

/**
 * Validate property data
 */
const validateProperty = (property) => {
  const errors = [];
  
  if (!property.title) errors.push('Title is required');
  if (!property.city) errors.push('City is required');
  if (!property.bhk || isNaN(property.bhk)) errors.push('Valid BHK is required');
  if (!property.area || isNaN(property.area)) errors.push('Valid area is required');
  if (!property.rent || isNaN(property.rent)) errors.push('Valid rent is required');
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Transform CSV data to property format
 */
const transformToProperty = (data) => {
  return {
    _id: `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: data.title || data.property_title || 'Untitled Property',
    description: data.description || '',
    city: data.city || 'Unknown',
    address: data.address || data.location || '',
    propertyType: data.property_type || data.propertytype || data.type || 'Apartment',
    bhk: parseInt(data.bhk) || parseInt(data.bedrooms) || 2,
    area: parseInt(data.area) || parseInt(data.sqft) || 800,
    rent: parseInt(data.rent) || parseInt(data.monthly_rent) || 20000,
    deposit: parseInt(data.deposit) || parseInt(data.security_deposit) || parseInt(data.rent) || 50000,
    amenities: data.amenities ? data.amenities.split(';').map(a => a.trim()) : [],
    images: [],
    status: 'Available',
    createdAt: new Date().toISOString()
  };
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function PropertyUpload({ onRefresh }) {
  const [properties, setProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [bulkData, setBulkData] = useState('');
  const [uploadResults, setUploadResults] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    address: '',
    propertyType: 'Apartment',
    bhk: 2,
    area: 800,
    rent: 20000,
    deposit: 50000,
    amenities: [],
    images: []
  });

  // Load properties on mount
  const loadProperties = useCallback(() => {
    const allProperties = getProperties();
    setProperties(allProperties);
  }, []);

  // Set up initial data
  const [initialized, setInitialized] = useState(false);
  const initData = useCallback(() => {
    if (!initialized) {
      loadProperties();
      setInitialized(true);
    }
  }, [initialized, loadProperties]);
  initData();

  const amenityOptions = [
    'WiFi', 'AC', 'Parking', 'Gym', 'Swimming Pool', 'Security',
    'Lift', 'Power Backup', 'Garden', 'Kids Play Area', 'Club House'
  ];

  // ============================================
  // FORM HANDLERS
  // ============================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['bhk', 'area', 'rent', 'deposit'].includes(name) ? Number(value) : value
    }));
  };

  const addAmenity = (amenity) => {
    if (!formData.amenities.includes(amenity)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenity]
      }));
    }
  };

  const removeAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls].slice(0, 5)
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProperty = {
      _id: editingProperty?._id || `prop_${Date.now()}`,
      ...formData,
      createdAt: editingProperty?.createdAt || new Date().toISOString(),
      status: 'Available'
    };

    if (editingProperty) {
      const updated = properties.map(p => p._id === editingProperty._id ? newProperty : p);
      saveProperties(updated);
    } else {
      const updated = [newProperty, ...properties];
      saveProperties(updated);
    }

    setProperties(editingProperty 
      ? properties.map(p => p._id === editingProperty._id ? newProperty : p)
      : [newProperty, ...properties]
    );

    resetForm();
    onRefresh?.();
  };

  const handleEdit = (property) => {
    setFormData(property);
    setEditingProperty(property);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      const updated = properties.filter(p => p._id !== id);
      saveProperties(updated);
      setProperties(updated);
      onRefresh?.();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      city: '',
      address: '',
      propertyType: 'Apartment',
      bhk: 2,
      area: 800,
      rent: 20000,
      deposit: 50000,
      amenities: [],
      images: []
    });
    setEditingProperty(null);
    setShowForm(false);
  };

  // ============================================
  // BULK UPLOAD HANDLERS
  // ============================================

  const handleBulkUpload = async () => {
    setUploading(true);
    setUploadResults(null);

    try {
      // Parse CSV
      const parsedData = parseCSV(bulkData);
      
      if (parsedData.length === 0) {
        setUploadResults({
          success: false,
          message: 'No valid data found in CSV',
          imported: 0,
          failed: 0,
          errors: ['CSV appears to be empty or malformed']
        });
        setUploading(false);
        return;
      }

      // Validate and transform each property
      const validProperties = [];
      const errors = [];

      parsedData.forEach((row, index) => {
        const validation = validateProperty(row);
        if (validation.isValid) {
          const property = transformToProperty(row);
          validProperties.push(property);
        } else {
          errors.push(`Row ${index + 2}: ${validation.errors.join(', ')}`);
        }
      });

      // Save to LocalStorage
      const existingProperties = getProperties();
      const allProperties = [...validProperties, ...existingProperties];
      saveProperties(allProperties);
      setProperties(allProperties);

      setUploadResults({
        success: validProperties.length > 0,
        message: validProperties.length > 0 
          ? `Successfully imported ${validProperties.length} properties` 
          : 'No valid properties to import',
        imported: validProperties.length,
        failed: parsedData.length - validProperties.length,
        errors: errors.slice(0, 5) // Show first 5 errors
      });

      setBulkData('');
      setShowBulkUpload(false);
      onRefresh?.();
    } catch (error) {
      setUploadResults({
        success: false,
        message: 'Error processing CSV file',
        imported: 0,
        failed: 0,
        errors: [error.message]
      });
    }

    setUploading(false);
  };

  const downloadSampleCSV = () => {
    const sampleCSV = `title,city,property_type,bhk,area,rent,deposit,address,description,amenities
Luxury 3BHK in Downtown,Mumbai,Apartment,3,1500,45000,135000,Downtown Mumbai,Spacious 3BHK with city views,WiFi;AC;Parking;Gym;Security
Cozy 2BHK in Suburbs,Bangalore,Apartment,2,1000,25000,75000,Whitefield Bangalore,Good ventilation and natural light,WiFi;AC;Parking;Lift
Studio Apartment,Delhi,Studio,1,400,15000,30000,Connaught Place,Compact living in prime location,WiFi;AC;Security
Villa with Garden,Pune,Villa,4,2500,65000,195000,Koregaon Park,Luxury villa with private garden,WiFi;AC;Parking;Gym;Swimming Pool;Garden`;

    const blob = new Blob([sampleCSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_properties.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Property Management</h2>
          <p className="text-gray-400 text-sm">{properties.length} properties</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowBulkUpload(true)}
            className="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Bulk Upload (CSV)
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Property
          </motion.button>
        </div>
      </div>

      {/* Upload Results */}
      <AnimatePresence>
        {uploadResults && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-xl border ${
              uploadResults.success 
                ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
          >
            <div className="flex items-center gap-3">
              {uploadResults.success ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <div>
                <p className="font-medium">{uploadResults.message}</p>
                <p className="text-sm opacity-80">
                  Imported: {uploadResults.imported} | Failed: {uploadResults.failed}
                </p>
              </div>
            </div>
            {uploadResults.errors?.length > 0 && (
              <div className="mt-3 text-sm">
                <p className="font-medium mb-1">Errors:</p>
                <ul className="list-disc list-inside opacity-80">
                  {uploadResults.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Upload Modal */}
      <AnimatePresence>
        {showBulkUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowBulkUpload(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-900 rounded-2xl p-6 w-full max-w-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Bulk Upload Properties (CSV)</h3>
                <button 
                  onClick={() => setShowBulkUpload(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* CSV Format Guide */}
              <div className="bg-dark-800/50 rounded-lg p-4 mb-4">
                <h4 className="text-white font-medium mb-2">CSV Format Guide</h4>
                <p className="text-gray-400 text-sm mb-2">
                  Required columns: <code className="text-primary-400">title, city, bhk, area, rent</code>
                </p>
                <p className="text-gray-400 text-sm mb-2">
                  Optional: <code className="text-gray-300">property_type, deposit, address, description, amenities</code>
                </p>
                <p className="text-gray-400 text-sm">
                  For amenities, separate with semicolons (;)
                </p>
                <button
                  onClick={downloadSampleCSV}
                  className="mt-3 text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Sample CSV
                </button>
              </div>

              {/* CSV Input */}
              <textarea
                value={bulkData}
                onChange={(e) => setBulkData(e.target.value)}
                placeholder={`title,city,property_type,bhk,area,rent,deposit,address,description,amenities\nLuxury 3BHK,Mumbai,Apartment,3,1500,45000,135000,Downtown,Spacious apartment,WiFi;AC;Parking`}
                className="w-full h-48 px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 font-mono text-sm resize-none"
              />

              {/* Actions */}
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => setShowBulkUpload(false)}
                  className="flex-1 px-4 py-3 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBulkUpload}
                  disabled={!bulkData.trim() || uploading}
                  className="flex-1 px-4 py-3 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Upload {bulkData.split('\n').length > 1 ? bulkData.split('\n').length - 1 : 0} Properties
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Single Property Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => resetForm()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-900 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingProperty ? 'Edit Property' : 'Add New Property'}
                </h3>
                <button onClick={resetForm} className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-gray-400 text-sm mb-2">Property Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Luxury 3BHK in Downtown"
                      className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g., Mumbai"
                      className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Property Type</label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    >
                      <option value="Apartment">Apartment</option>
                      <option value="House">House</option>
                      <option value="Villa">Villa</option>
                      <option value="PG">PG</option>
                      <option value="Studio">Studio</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">BHK *</label>
                    <select
                      name="bhk"
                      value={formData.bhk}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    >
                      {[1, 2, 3, 4, 5].map(n => (
                        <option key={n} value={n}>{n} BHK</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Area (sqft) *</label>
                    <input
                      type="number"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      min="100"
                      className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Monthly Rent (₹) *</label>
                    <input
                      type="number"
                      name="rent"
                      value={formData.rent}
                      onChange={handleInputChange}
                      min="1000"
                      className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Deposit (₹)</label>
                    <input
                      type="number"
                      name="deposit"
                      value={formData.deposit}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-400 text-sm mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Full address"
                      className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Amenities</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.amenities.map(amenity => (
                      <span
                        key={amenity}
                        className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm flex items-center gap-2"
                      >
                        {amenity}
                        <button
                          type="button"
                          onClick={() => removeAmenity(amenity)}
                          className="hover:text-white"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {amenityOptions
                      .filter(a => !formData.amenities.includes(a))
                      .map(amenity => (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => addAmenity(amenity)}
                          className="px-3 py-1 bg-dark-700 text-gray-400 rounded-full text-sm hover:bg-dark-600 hover:text-white transition-colors"
                        >
                          + {amenity}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Images */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Images (max 5)</label>
                  <div className="flex flex-wrap gap-3">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden">
                        <img src={img} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-bl flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {formData.images.length < 5 && (
                      <label className="w-20 h-20 border-2 border-dashed border-dark-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary-500 transition-colors">
                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Describe the property..."
                    className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500 resize-none"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-3 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    {editingProperty ? 'Update Property' : 'Add Property'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Properties Grid */}
      {properties.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <p className="text-gray-400 mb-4">No properties added yet</p>
          <div className="flex justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Add Single Property
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowBulkUpload(true)}
              className="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors"
            >
              Bulk Upload (CSV)
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, index) => (
            <motion.div
              key={property._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass rounded-xl overflow-hidden"
            >
              {/* Image */}
              <div className="h-48 bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                {property.images?.[0] ? (
                  <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-white font-semibold">{property.title}</h3>
                    <p className="text-gray-400 text-sm">{property.city}</p>
                  </div>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                    {property.status || 'Available'}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-gray-400 text-sm mb-3">
                  <span>{property.bhk} BHK</span>
                  <span>•</span>
                  <span>{property.area} sqft</span>
                  <span>•</span>
                  <span>{property.propertyType}</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {property.amenities?.slice(0, 4).map(amenity => (
                    <span key={amenity} className="px-2 py-0.5 bg-dark-700 text-gray-400 rounded text-xs">
                      {amenity}
                    </span>
                  ))}
                  {property.amenities?.length > 4 && (
                    <span className="px-2 py-0.5 bg-dark-700 text-gray-400 rounded text-xs">
                      +{property.amenities.length - 4}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-400 font-bold text-lg">₹{property.rent?.toLocaleString()}</p>
                    <p className="text-gray-500 text-xs">+ ₹{property.deposit?.toLocaleString()} deposit</p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(property)}
                      className="p-2 bg-dark-700 text-gray-400 rounded-lg hover:bg-dark-600 hover:text-white"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(property._id)}
                      className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
