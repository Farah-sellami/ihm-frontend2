import axiosInstance from './axiosInstance';

const offreService = {
  // Récupérer toutes les offres avec leurs postes associés
  getAllOffres: async () => {
    const response = await axiosInstance.get('/offres');
    return response.data;
  },

  // Récupérer une offre spécifique par ID avec son poste associé
  getOffreById: async (id) => {
    const response = await axiosInstance.get(`/offres/${id}`);
    return response.data;
  },

  // Créer une nouvelle offre
  createOffre: async (offreData) => {
    const response = await axiosInstance.post('/offres', offreData);
    return response.data;
  },

  // Mettre à jour une offre existante
  updateOffre: async (id, updatedData) => {
    const response = await axiosInstance.put(`/offres/${id}`, updatedData);
    return response.data;
  },

  // Supprimer une offre
  deleteOffre: async (id) => {
    const response = await axiosInstance.delete(`/offres/${id}`);
    return response.data;
  }
};

export default offreService;
