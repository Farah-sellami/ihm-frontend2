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

  // Fonction pour récupérer l'ID de l'utilisateur authentifié à partir du token dans sessionStorage
  const getUserIdFromToken = () => {
    const token = sessionStorage.getItem('token'); // Supposons que le token est stocké ici
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1])); // Décode le token
      return decoded.user_id; // Remplacez par la clé appropriée de votre payload JWT
    }
    return null;
  };

  useEffect(() => {
    axios.get('http://localhost:8000/api/scategories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Erreur chargement catégories:', err));
  }, []);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoadingImage(true);
    setErrorImage(null);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "my_image_preset"); // Changez avec votre propre preset Cloudinary
    data.append("cloud_name", "defx74d1x");

    try {
      const res = await axios.post("https://api.cloudinary.com/v1_1/defx74d1x/image/upload", data);
      const url = res.data.secure_url;
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, url],
      }));
    } catch (err) {
      console.error("Erreur Cloudinary:", err);
      setErrorImage("Erreur lors du téléversement de l’image.");
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
      alert("Veuillez téléverser au moins une photo.");
      return;
    }

    // Récupère l'ID de l'utilisateur authentifié
    const userId = getUserIdFromToken();

    if (!userId) {
      alert("Utilisateur non authentifié.");
      return;
    }

    const dataToSend = {
      ...formData,
      user_id: userId,  // Ajoute l'ID utilisateur à la requête
    };

    try {
      const res = await axios.post('http://localhost:8000/api/Addpostes', dataToSend, {
        headers: { 'Content-Type': 'application/json' },
      });
      alert("Poste créé avec succès !");
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
    } catch (err) {
      console.error("Erreur création poste:", err.response?.data || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4">Ajouter un poste</h2>

      <label className="block mb-2">Titre</label>
      <input
        type="text"
        name="titre"
        value={formData.titre}
        onChange={handleChange}
        required
        className="w-full mb-4 border p-2 rounded"
      />

      <label className="block mb-2">Photo (1 à 4 images)</label>
      <input
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="w-full mb-2 border p-2 rounded"
      />
      {loadingImage && <p className="text-blue-500 mb-2">Téléversement en cours...</p>}
      {errorImage && <p className="text-red-500 mb-2">{errorImage}</p>}
      {formData.photos.length > 0 && (
        <div className="mb-4 flex gap-2 flex-wrap">
          {formData.photos.map((url, i) => (
            <img key={i} src={url} alt="uploaded" className="w-20 h-20 object-cover rounded" />
          ))}
        </div>
      )}

      <label className="block mb-2">Description</label>
      <input
        type="text"
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
        className="w-full mb-4 border p-2 rounded"
      />

      <label className="block mb-2">Prix Initial</label>
      <input
        type="number"
        name="prixIniale"
        value={formData.prixIniale}
        onChange={handleChange}
        required
        className="w-full mb-4 border p-2 rounded"
      />

      <label className="block mb-2">Date de fin</label>
      <input
        type="datetime-local"
        name="endDate"
        value={formData.endDate}
        onChange={handleChange}
        required
        className="w-full mb-4 border p-2 rounded"
      />

      <input
        type="checkbox"
        name="estApprouvé"
        checked={formData.estApprouvé === 1}
        onChange={handleChange}
        className="hidden"
      />

      <label className="block mb-2">Sous-catégorie</label>
      <select
        name="scategorieID"
        value={formData.scategorieID}
        onChange={handleChange}
        required
        className="w-full mb-4 border p-2 rounded"
      >
        <option value="">-- Choisir une sous-catégorie --</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.titre}</option>
        ))}
      </select>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Créer le poste
      </button>
    </form>
  );
};

export default AddPosteForm;
