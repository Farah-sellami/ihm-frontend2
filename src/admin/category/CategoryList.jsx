import { useEffect, useState } from "react";
import { Pagination, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import categoryService from "../../api/categoryService";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import SweetAlert from "sweetalert2";
import { uploadImage } from "../../api/uploadImage";  // Importer le service d'upload image

export const CategoryList = () => {
    const [allCategories, setAllCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [openModal, setOpenModal] = useState(false);
    const [newCategoryTitle, setNewCategoryTitle] = useState("");
    const [newCategoryDescription, setNewCategoryDescription] = useState(""); 
    const [newCategoryImage, setNewCategoryImage] = useState(null); // Image state
    const [categoryToEdit, setCategoryToEdit] = useState(null);  // For edit
    const itemsPerPage = 5;
    const navigate = useNavigate();

    const handleCreateNewCategory = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setNewCategoryTitle("");
        setNewCategoryDescription(""); 
        setNewCategoryImage(null); // Reset image
        setCategoryToEdit(null); // Clear edit state
    };

    const handleSaveCategory = async () => {
        if (!newCategoryTitle.trim()) {
            SweetAlert.fire("Error", "The title cannot be empty.", "error");
            return;
        }

        try {
            let imageUrl = null;
            if (newCategoryImage) {
                // Upload the image to Cloudinary
                imageUrl = await uploadImage(newCategoryImage);
            }

            const newCategory = {
                titre: newCategoryTitle,
                description: newCategoryDescription,
                image: imageUrl,
            };
            await categoryService.createCategory(newCategory);

            SweetAlert.fire("Success", "Category created successfully!", "success");

            const updatedCategories = await categoryService.getAllCategories();
            setAllCategories(updatedCategories);

            handleCloseModal();
        } catch (error) {
            console.error("Error while creating the category:", error);
            SweetAlert.fire("Error", "An error occurred while creating the category.", "error");
        }
    };

    const handleEditCategory = async () => {
        if (!categoryToEdit) return;

        try {
            let imageUrl = categoryToEdit.image; // Keep current image if not updated
            if (newCategoryImage) {
                imageUrl = await uploadImage(newCategoryImage);
            }

            const updatedCategory = {
                titre: newCategoryTitle,
                description: newCategoryDescription,
                image: imageUrl,
            };

            await categoryService.updateCategory(categoryToEdit.id, updatedCategory);

            SweetAlert.fire("Success", "Category updated successfully!", "success");

            const updatedCategories = await categoryService.getAllCategories();
            setAllCategories(updatedCategories);
            handleCloseModal();
        } catch (error) {
            console.error("Error while updating the category:", error);
            SweetAlert.fire("Error", "An error occurred while updating the category.", "error");
        }
    };

    const handleDeleteCategory = async (id) => {
        const result = await SweetAlert.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                await categoryService.deleteCategory(id);
                SweetAlert.fire("Deleted!", "Category has been deleted.", "success");

                const updatedCategories = await categoryService.getAllCategories();
                setAllCategories(updatedCategories);
            } catch (error) {
                SweetAlert.fire("Error", "An error occurred while deleting the category.", "error");
            }
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getAllCategories();
                setAllCategories(data);
            } catch (error) {
                console.error("Loading error:", error);
            }
        };

        fetchCategories();
    }, []);

    const filteredCategories = allCategories.filter((cat) =>
        cat.titre.toLowerCase().includes(search.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

    return (
        <div className="w-full flex justify-center px-4">
            <div className="w-full max-w-6xl mt-32 mb-10 shadow-s1 p-8 rounded-lg bg-white">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Categories List</h1>
                <div className="mb-4 flex justify-between items-center">
                    <Button
                        className="bg-green-800 text-white px-6 py-2 rounded-md"
                        onClick={handleCreateNewCategory}
                    >
                        Create New
                    </Button>
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        placeholder="Search by title..."
                        className="border px-4 py-2 rounded-md w-full"
                    />
                </div>

                <div className="overflow-x-auto rounded-lg">
                    <table className="min-w-[600px] w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th className="px-6 py-4">#</th>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Image</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((cat, index) => (
                                    <tr key={cat.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            {(currentPage - 1) * itemsPerPage + index + 1}
                                        </td>
                                        <td className="px-6 py-4">{cat.titre}</td>
                                        <td className="px-6 py-4">
                                            {cat.image && <img src={cat.image} alt={cat.titre} className="w-12 h-12 object-cover rounded-full" />}
                                        </td>
                                        <td className="px-6 py-4">{cat.description || "No description"}</td>
                                        <td className="px-6 py-4 text-right">
                                            <IconButton onClick={() => {
                                                setCategoryToEdit(cat);
                                                setNewCategoryTitle(cat.titre);
                                                setNewCategoryDescription(cat.description);
                                                setNewCategoryImage(null);
                                                setOpenModal(true);
                                            }} sx={{ color: 'orange', '&:hover': { color: 'darkorange' } }}>
                                                <Edit fontSize="small" />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteCategory(cat.id)} sx={{ color: 'red', '&:hover': { color: 'darkred' } }}>
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">No categories found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex justify-end">
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)}
                    />
                </div>
            </div>

            {/* Modal to create or edit category */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
  <DialogTitle>
    {categoryToEdit ? "Edit category" : "Create a new category"}
  </DialogTitle>

  <DialogContent dividers>
    <TextField
      label="Titre"
      fullWidth
      value={newCategoryTitle}
      onChange={(e) => setNewCategoryTitle(e.target.value)}
      margin="normal"
    />

    <TextField
      label="Description"
      fullWidth
      multiline
      minRows={3}
      value={newCategoryDescription}
      onChange={(e) => setNewCategoryDescription(e.target.value)}
      margin="normal"
    />

    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setNewCategoryImage(e.target.files[0])}
      />

      {(newCategoryImage || categoryToEdit?.image) && (
        <img
          src={
            newCategoryImage
              ? URL.createObjectURL(newCategoryImage)
              : categoryToEdit?.image
          }
          alt="Aperçu"
          className="mt-3 w-32 h-32 object-cover rounded-md border"
        />
      )}
    </div>
  </DialogContent>

  <DialogActions>
    <Button onClick={handleCloseModal} variant="outlined" color="primary">
      Cancel
    </Button>
    <Button
      onClick={categoryToEdit ? handleEditCategory : handleSaveCategory}
      variant="contained"
      color="primary"
    >
      {categoryToEdit ? "Update" : "Save"}
    </Button>
  </DialogActions>
</Dialog>

        </div>
    );
};
