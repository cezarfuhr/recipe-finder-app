import React, { useEffect } from 'react';
import { Container, Grid, Typography, CircularProgress, Box } from '@mui/material';
import { useRecipeStore } from '../stores/useRecipeStore';
import { RecipeCard } from '../components/RecipeCard';
import { SearchFilters } from '../components/SearchFilters';
import { RecipeDetails } from '../components/RecipeDetails';
import { SearchFilters as Filters } from '../types';

export const Home: React.FC = () => {
  const {
    recipes,
    selectedRecipe,
    loading,
    searchRecipes,
    getRandomRecipes,
    setSelectedRecipe,
    toggleFavorite,
    addIngredientsToShoppingList,
  } = useRecipeStore();

  useEffect(() => {
    getRandomRecipes();
  }, [getRandomRecipes]);

  const handleSearch = (filters: Filters) => {
    if (Object.keys(filters).length === 0 || !filters.query) {
      getRandomRecipes();
    } else {
      searchRecipes(filters);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom textAlign="center" sx={{ mb: 4 }}>
        Recipe Finder
      </Typography>

      <SearchFilters onSearch={handleSearch} />

      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {recipes.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} key={recipe.id}>
              <RecipeCard
                recipe={recipe}
                onSelect={setSelectedRecipe}
                onToggleFavorite={toggleFavorite}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {recipes.length === 0 && !loading && (
        <Typography variant="body1" textAlign="center" color="text.secondary" py={8}>
          No recipes found. Try adjusting your search filters.
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
