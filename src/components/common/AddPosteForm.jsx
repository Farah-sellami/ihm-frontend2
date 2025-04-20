import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddPosteForm = () => {
  const [formData, setFormData] = useState({
    titre: '',
    photos: [], 
    description: '',
    prixIniale: '',
    endDate: '',
    estApprouvé: 1,
    scategorieID: '',
  });

  const [categories, setCategories] = useState([]);
  const [loadingImage, setLoadingImage] = useState(false);
  const [errorImage, setErrorImage] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/scategories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Error loading categories:', err));
  }, []);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoadingImage(true);
    setErrorImage(null);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "my_image_preset");
    data.append("cloud_name", "defx74d1x");

    try {
      const res = await axios.post("https://api.cloudinary.com/v1_1/defx74d1x/image/upload", data);
      const url = res.data.secure_url;
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, url],
      }));
    } catch (err) {
      console.error("Cloudinary error:", err);
      setErrorImage("Error uploading image.");
    } finally {
      setLoadingImage(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.photos.length === 0) {
      alert("Please upload at least one photo.");
      return;
    }

    // Get user_id directly from sessionStorage
    const userId = sessionStorage.getItem('userId');
    
    if (!userId) {
      alert("Please log in to create a post.");
      return;
    }

    const dataToSend = {
      ...formData,
      user_id: userId  // Add user_id to the request
    };

    try {
      const res = await axios.post('http://localhost:8000/api/postes', dataToSend, {
        headers: { 'Content-Type': 'application/json' },
      });
      alert("Post created successfully!");
      console.log(res.data);

      // Reset form
      setFormData({
        titre: '',
        photos: [],
        description: '',
        prixIniale: '',
        endDate: '',
        estApprouvé: 1,
        scategorieID: '',
      });

      // NEW: Redirect to the details page of the newly created post
      window.location.href = `/auctions`;
      
    } catch (err) {
      console.error("Error creating post:", err.response?.data || err.message);
      alert("Error creating post. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4">Add New Post</h2>

      <div className="mb-4">
        <label className="block mb-2">Title</label>
        <input
          type="text"
          name="titre"
          value={formData.titre}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Photos (1-4 images)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="w-full p-2 border rounded"
        />
        {loadingImage && <p className="text-blue-500">Uploading...</p>}
        {errorImage && <p className="text-red-500">{errorImage}</p>}
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.photos.map((url, i) => (
            <img key={i} src={url} alt="uploaded" className="w-20 h-20 object-cover rounded" />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Description</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Initial Price</label>
        <input
          type="number"
          name="prixIniale"
          value={formData.prixIniale}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">End Date</label>
        <input
          type="datetime-local"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Category</label>
        <select
          name="scategorieID"
          value={formData.scategorieID}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Select a category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.titre}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Create Auction
      </button>
    </form>
  );
};

export default AddPosteForm;