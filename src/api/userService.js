import axiosInstance from './axiosInstance';

const userService = {
 // Récupérer la liste des utilisateurs
 getAllUsers: async () => {
    try {
      const response = await axiosInstance.get('/users');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer un utilisateur par ID
  getUserById: async (id) => {
    try {
      const response = await axiosInstance.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Créer un nouvel utilisateur
  // createUser: async (userData) => {
  //   try {
  //     const response = await axiosInstance.post('/users', userData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data', // utile si tu envoies une image
  //       },
  //     });
  //     return response.data;
  //   } catch (error) {
  //     throw error;
  //   }
  // },

  // Mettre à jour un utilisateur
  updateUser: async (id, userData) => {
    try {
      const response = await axiosInstance.put(`/users/${id}`, userData, {
        headers: {
          'Content-Type': 'multipart/form-data', // pareil ici si tu gères une image
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer un utilisateur
  deleteUser: async (id) => {
    try {
      const response = await axiosInstance.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  // Bloquer un utilisateur
  blockUser: async (id) => {
    try {
      const response = await axiosInstance.post(`/users/${id}/block`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Débloquer un utilisateur
  unblockUser: async (id) => {
    try {
      const response = await axiosInstance.post(`/users/${id}/unblock`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
};

export default userService;