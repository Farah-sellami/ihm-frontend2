import { useEffect, useState } from "react";
import {
  Pagination,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  Typography,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import Swal from "sweetalert2";
import { PrimaryButton } from "../../router";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import sCategoryService from "../../api/sCategoryService";
import categoryService from "../../api/categoryService";

export const SCategoryList = () => {
  const [sousCategories, setSousCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [newSubCat, setNewSubCat] = useState({ titre: "", categorieID: "" });
  const [editingSubCat, setEditingSubCat] = useState(null);

  const itemsPerPage = 6;

  useEffect(() => {
    loadSubcategories();
    loadCategories();
  }, []);

  const loadSubcategories = async () => {
    try {
      const data = await sCategoryService.getAllSubcategories();
      setSousCategories(data);
    } catch (error) {
      console.error("Erreur lors du chargement des sous-catégories", error);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Erreur lors du chargement des catégories", error);
    }
  };

  const handleCreate = async () => {
    try {
      await sCategoryService.createSubcategory(newSubCat);
      Swal.fire("Success", "Subcategory successfully created!", "success");
      setOpenCreateModal(false);
      setNewSubCat({ titre: "", categorieID: "" });
      loadSubcategories();
    } catch (err) {
      Swal.fire("Erreur", "Unable to create subcategory.", "error");
    }
  };

  const handleEdit = async () => {
    try {
      await sCategoryService.updateSubcategory(editingSubCat.id, editingSubCat);
      Swal.fire("Success", "Subcategory successfully modified!", "success");
      setOpenEditModal(false);
      setEditingSubCat(null);
      loadSubcategories();
    } catch (err) {
      Swal.fire("Erreur", "Échec de la modification.", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete ?",
      text: "Do you really want to delete this subcategory ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await sCategoryService.deleteSubcategory(id);
        Swal.fire("Deleted", "Subcategory successfully deleted.", "success");
        loadSubcategories();
      } catch (err) {
        Swal.fire("Error", "Deletion failed.", "error");
      }
    }
  };

  const filteredList = sousCategories.filter((item) => {
    const matchesSearch = item.titre.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCat ? item.categorieID === selectedCat : true;
    return matchesSearch && matchesCategory;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const currentItems = filteredList.slice(indexOfLastItem - itemsPerPage, indexOfLastItem);
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  return (
    <div className="w-full flex justify-center px-4">
      <div className="w-full max-w-6xl mt-32 mb-10 shadow-s1 p-8 rounded-lg bg-white">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Sub Categories list
        </h1>

        <div className="mb-4 flex justify-between items-center">
          <Button
            className="bg-green-800 text-white px-6 py-2 rounded-md"
            onClick={() => setOpenCreateModal(true)}
          >
            Create new
          </Button>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-4">
          <input
            type="text"
            placeholder="Recherche..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="border px-3 py-2 rounded-md w-64"
          />

          <FormControl size="small" className="min-w-[200px]">
            <InputLabel id="select-cat">Categorie</InputLabel>
            <Select
              labelId="select-cat"
              value={selectedCat}
              label="Categorie"
              onChange={(e) => {
                setSelectedCat(e.target.value);
                setCurrentPage(1);
              }}
            >
              <MenuItem value="">Toutes</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.titre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.length > 0 ? (
            currentItems.map((item) => (
              <Card key={item.id} className="shadow-md">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {item.titre}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Catégorie : {item.categorie ? item.categorie.titre : "Non défini"}
                  </Typography>
                </CardContent>
                <CardActions className="flex justify-end pr-4 pb-2">
                  <IconButton
                    onClick={() => {
                      setEditingSubCat(item);
                      setOpenEditModal(true);
                    }}
                    sx={{ color: "orange" }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(item.id)}
                    sx={{ color: "red" }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400">
             No subcategories found.
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
            color="primary"
          />
        </div>

        {/* Modal de création */}
        <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)} fullWidth>
          <DialogTitle>Create a subcategory</DialogTitle>
          <DialogContent className="flex flex-col gap-4 mt-2">
            <TextField
              label="Titre"
              value={newSubCat.titre}
              onChange={(e) => setNewSubCat({ ...newSubCat, titre: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={newSubCat.categorieID}
                onChange={(e) =>
                  setNewSubCat({ ...newSubCat, categorieID: e.target.value })
                }
                label="Category"
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.titre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCreateModal(false)}>Cancel</Button>
            <Button onClick={handleCreate} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal de modification */}
        <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} fullWidth>
          <DialogTitle>Edit sub-category</DialogTitle>
          {editingSubCat && (
            <DialogContent className="flex flex-col gap-4 mt-2">
              <br />
              <TextField
                label="Title"
                value={editingSubCat.titre}
                onChange={(e) =>
                  setEditingSubCat({ ...editingSubCat, titre: e.target.value })
                }
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={editingSubCat.categorieID}
                  onChange={(e) =>
                    setEditingSubCat({ ...editingSubCat, categorieID: e.target.value })
                  }
                  label="Catégorie"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.titre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </DialogContent>
          )}
          <DialogActions>
            <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
            <Button onClick={handleEdit} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};
