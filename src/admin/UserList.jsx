import { useEffect, useState } from "react";
import { Pagination, IconButton } from "@mui/material";
import userService from "../api/userService"; 
import { ExpandLess, ExpandMore, Edit, Delete } from "@mui/icons-material";
import { PrimaryButton } from "../router";
import { Block, Visibility, LockOpen  } from '@mui/icons-material';



export const UserList = () => {
  const [allUsers, setAllUsers] = useState([]); // Liste des utilisateurs
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expanded, setExpanded] = useState({}); // Pour gérer l'affichage des détails des utilisateurs
  const itemsPerPage = 5;
 const User1 = "https://cdn-icons-png.flaticon.com/128/6997/6997662.png";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAllUsers(); // Remplacez par la fonction appropriée pour récupérer les utilisateurs
        setAllUsers(data);
      } catch (error) {
        console.error("Erreur de chargement des utilisateurs :", error);
      }
    };

    fetchUsers();
  }, []);

  // 🔎 Appliquer le filtre
  const filteredUsers = allUsers.filter((user) =>
    (user.nom && user.nom.toLowerCase().includes(search.toLowerCase())) ||
    (user.prenom && user.prenom.toLowerCase().includes(search.toLowerCase())) 
  );

  // 📄 Pagination côté client
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const toggleExpand = async (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

    // Charger les informations supplémentaires de l'utilisateur si nécessaire
    if (!expanded[id]) {
      // Implémenter la logique pour charger les détails supplémentaires si nécessaire
    }
  };

  const handleBlock = async (id) => {
    try {
      await userService.blockUser(id);
      setAllUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, is_blocked: true } : user
        )
      );
    } catch (error) {
      console.error("Erreur lors du blocage de l'utilisateur :", error);
    }
  };

  const handleUnblock = async (id) => {
    try {
      await userService.unblockUser(id);
      setAllUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, is_blocked: false } : user
        )
      );
    } catch (error) {
      console.error("Erreur lors du déblocage de l'utilisateur :", error);
    }
  };

  return (
    <div className="w-full flex justify-center px-4">
      <div className="w-full max-w-6xl mt-32 mb-10 shadow-s1 p-8 rounded-lg bg-white">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Users List
        </h1>

        {/* Barre de recherche */}
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by username or email..."
            className="border px-4 py-2 rounded-md w-full"
          />
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-[600px] w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">Date de naissance</th>
                <th className="px-6 py-4">Ville</th>
                <th className="px-6 py-4">Photo</th>
                <th className="px-6 py-4">Date creation</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((user, index) => (
                  <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4">{user.nom} {user.prenom}</td>
                    <td className="px-6 py-4">{user.dateNaissance}</td>
                    <td className="px-6 py-4">{user.ville}</td>
                    <td className="px-6 py-4">
                      <img src={user.photoProfil || User1 } alt={user.username} className="w-10 h-10 rounded-full" />
                    </td>
                    <td className="px-6 py-4">  {new Date(user.created_at).toLocaleDateString('fr-CA')}</td>
                    <td
                      className={`px-6 py-4 ${user.is_blocked ? 'bg-red-200' : 'bg-green-200'}`}
                    >
                      {user.is_blocked ? "Blocked" : "Active"}
                    </td>

                    <td className="px-6 py-4 text-right">
                    {/* Blocage */}
                    <IconButton
                      onClick={() => handleBlock(user.id)}
                      sx={{ color: 'red', '&:hover': { color: 'darkred' } }}
                      aria-label="Block" // Ajout de l'attribut aria-label
                    >
                      <Block fontSize="small" />
                    </IconButton>

                    {/* Déblocage */}
                    <IconButton
                      onClick={() => handleUnblock(user.id)}
                      sx={{ color: 'green', '&:hover': { color: 'darkgreen' } }}
                      aria-label="Unblock" // Ajout de l'attribut aria-label
                    >
                      <LockOpen  fontSize="small" />
                    </IconButton>
                  </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center px-6 py-4">
                    Aucun résultat trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-end">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
            color="primary"
          />
        </div>
      </div>
    </div>
  );
};
