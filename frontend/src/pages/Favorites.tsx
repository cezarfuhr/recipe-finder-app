import React, { useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Box,
  Button,
} from '@mui/material';
import { Clear } from '@mui/icons-material';
import { useRecipeStore } from '../stores/useRecipeStore';
import { RecipeCard } from '../components/RecipeCard';
import { RecipeDetails } from '../components/RecipeDetails';

export const Favorites: React.FC = () => {
  const {
    favorites,
    selectedRecipe,
    loading,
    loadFavorites,
    setSelectedRecipe,
    toggleFavorite,
    addIngredientsToShoppingList,
    clearFavorites,
  } = useRecipeStore();

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1">
          Favorite Recipes
        </Typography>
        {favorites.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<Clear />}
            onClick={clearFavorites}
          >
            Clear All
          </Button>
        )}
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {favorites.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} key={recipe.id}>
              <RecipeCard
                recipe={{ ...recipe, isFavorite: true }}
                onSelect={setSelectedRecipe}
                onToggleFavorite={toggleFavorite}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {favorites.length === 0 && !loading && (
        <Typography variant="body1" textAlign="center" color="text.secondary" py={8}>
          No favorite recipes yet. Start adding some from the search page!
        </Typography>
      )}

      <RecipeDetails
        recipe={selectedRecipe}
        open={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        onToggleFavorite={toggleFavorite}
        onAddToShoppingList={addIngredientsToShoppingList}
      />
    </Container>
  );
};
