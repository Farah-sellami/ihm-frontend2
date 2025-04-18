import axiosInstance from './axiosInstance';

const posteService = {
  // Récupérer tous les postes avec leurs sous-catégories associées
  getAllPostes: async (scategorieID) => {
    const response = await axiosInstance.get('/postes', {
      params: {
        scategorie_id: scategorieID,  // On passe l'ID de la sous-catégorie en paramètre
      },
    });
    return response.data;
  },

  // Récupérer tous les postes avec filtrage et pagination
  getPostes: async (filter = '', page = 1) => {
    const response = await axiosInstance.get('/postesfiltre', {
      params: {
        filter: filter || '',  // Assurez-vous que le filtre a une valeur valide
        page: page || 1, 
      },
    });
    return response.data;
  },

  // Récupérer un poste spécifique par ID avec sa sous-catégorie associée
  getPosteById: async (id) => {
    const response = await axiosInstance.get(`/postes/${id}`);
    return response.data;
  },

  // Créer un nouveau poste
  createPoste: async (posteData) => {
    const formData = new FormData();
    formData.append('titre', posteData.titre);
    formData.append('description', posteData.description);
    formData.append('prixIniale', posteData.prixIniale);
    formData.append('duree', posteData.duree);
    formData.append('estApprouvé', posteData.estApprouvé);
    formData.append('scategorieID', posteData.scategorieID);
    formData.append('user_id', posteData.user_id);

    // Ajoutez les fichiers d'image
    posteData.photos.forEach(photo => {
      formData.append('photos[]', photo);
    });

    const response = await axiosInstance.post('/postes', formData, { 
      headers: { 'Content-Type': 'multipart/form-data' } 
    });
    return response.data;
  },

  // Mettre à jour un poste existant
  updatePoste: async (id, updatedData) => {
    const formData = new FormData();
    formData.append('titre', updatedData.titre);
    formData.append('description', updatedData.description);
    formData.append('prixIniale', updatedData.prixIniale);
    formData.append('duree', updatedData.duree);
    formData.append('estApprouvé', updatedData.estApprouvé);
    formData.append('scategorieID', updatedData.scategorieID);

    // Si des photos sont ajoutées ou modifiées
    if (updatedData.photos) {
      updatedData.photos.forEach(photo => {
        formData.append('photos[]', photo);
      });
    }

    const response = await axiosInstance.put(`/postes/${id}`, formData, { 
      headers: { 'Content-Type': 'multipart/form-data' } 
    });
    return response.data;
  },

  // Supprimer un poste
  deletePoste: async (id) => {
    const response = await axiosInstance.delete(`/postes/${id}`);
    return response.data;
  },

  // Approuver un poste
  approvePoste: async (id) => {
    const response = await axiosInstance.put(`/postes/${id}/approve`);
    return response.data;
  },

  // Désapprouver un poste
  disapprovePoste: async (id) => {
    const response = await axiosInstance.put(`/postes/${id}/disapprove`);
    return response.data;
  },

  // Récupérer des postes filtrés (par approbation ou non)
  getPostesFiltres: async (filter = '', page = 1) => {
    const response = await axiosInstance.get('/postesfiltre', {
      params: {
        filter: filter,  // Filtrer par 'approved' ou 'disapproved'
        page: page, 
      },
    });
    return response.data;
  },
};

export default posteService;
