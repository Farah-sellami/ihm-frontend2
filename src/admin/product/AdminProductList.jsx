import { useEffect, useState } from "react";
import { Title } from "../../router";
import posteService from "../../api/posteService";
import {
  Pagination,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  IconButton,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

export const AdminProductList = () => {
  const [postes, setPostes] = useState([]);
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState({});

  useEffect(() => {
    const fetchPostes = async () => {
      try {
        const data = await posteService.getPostes(filter, currentPage);
        setPostes(data.postes);
        setTotalPages(data.totalPages);

        // Initialiser l'index photo pour chaque poste
        const initialPhotoIndexes = {};
        data.postes.forEach((poste) => {
          initialPhotoIndexes[poste.id] = 0;
        });
        setCurrentPhotoIndex(initialPhotoIndexes);
      } catch (error) {
        console.error("Error fetching postes:", error);
      }
    };

    fetchPostes();
  }, [filter, currentPage]);

  const handleApprove = async (id) => {
    try {
      await posteService.approvePoste(id);
      setPostes(postes.map(poste => poste.id === id ? { ...poste, estApprouvé: true } : poste));
    } catch (error) {
      console.error("Error approving poste:", error);
    }
  };

  const handleDisapprove = async (id) => {
    try {
      await posteService.disapprovePoste(id);
      setPostes(postes.map(poste => poste.id === id ? { ...poste, estApprouvé: false } : poste));
    } catch (error) {
      console.error("Error disapproving poste:", error);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const nextPhoto = (posteId, total) => {
    setCurrentPhotoIndex((prev) => ({
      ...prev,
      [posteId]: (prev[posteId] + 1) % total,
    }));
  };

  const prevPhoto = (posteId, total) => {
    setCurrentPhotoIndex((prev) => ({
      ...prev,
      [posteId]: (prev[posteId] - 1 + total) % total,
    }));
  };

  return (
    <section className="shadow-s1 p-8 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <Title level={5} className="font-normal">Product Lists</Title>
      </div>
      <hr className="my-5" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {postes.map((poste) => {
          const photoIndex = currentPhotoIndex[poste.id] || 0;
          const photos = poste.photos || [];

          return (
<Card key={poste.id} className="shadow-lg rounded-2xl overflow-hidden">
  <div className="relative w-full h-64 bg-gray-100 flex items-center justify-center">
    {photos.length > 0 && (
      <>
        <img
          src={photos[photoIndex]}
          alt={`Poste ${poste.id}`}
          className="object-cover h-full w-full"
        />
        {photos.length > 1 && (
          <>
            <IconButton
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={() => prevPhoto(poste.id, photos.length)}
            >
              <ArrowBackIos fontSize="small" />
            </IconButton>
            <IconButton
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={() => nextPhoto(poste.id, photos.length)}
            >
              <ArrowForwardIos fontSize="small" />
            </IconButton>
          </>
        )}
      </>
    )}
  </div>

  <CardContent className="p-4 space-y-2">
    <Typography variant="h6" className="font-bold">{poste.titre}</Typography>
    <Typography variant="body2" className="text-gray-700">{poste.description}</Typography>

    <div className="grid grid-cols-2 gap-2 text-sm text-gray-800">
      <p><strong>Prix initial :</strong> {poste.prixIniale} DT</p>
      <p><strong>Durée :</strong> {poste.duree} jours</p>
      <p><strong>Catégorie :</strong> {poste.scategorieID}</p>
      <p><strong>Utilisateur :</strong> {poste.user_id}</p>
    </div>

    <Typography
      variant="body2"
      className={`font-semibold mt-2 ${poste.estApprouvé ? "text-green-600" : "text-red-600"}`}
    >
      {poste.estApprouvé ? "✅ Approuvé" : "❌ Non Approuvé"}
    </Typography>
  </CardContent>

  <CardActions className="p-4 pt-0">
    {poste.estApprouvé ? (
      <Button
        onClick={() => handleDisapprove(poste.id)}
        color="error"
        variant="outlined"
        fullWidth
      >
        Désapprouver
      </Button>
    ) : (
      <Button
        onClick={() => handleApprove(poste.id)}
        color="primary"
        variant="contained"
        fullWidth
      >
        Approuver
      </Button>
    )}
  </CardActions>
</Card>

          );
        })}
      </div>

      <div className="flex justify-center mt-8">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
          siblingCount={1}
          boundaryCount={1}
        />
      </div>
    </section>
  );
};
