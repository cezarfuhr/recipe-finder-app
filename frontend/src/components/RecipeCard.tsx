import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  IconButton,
  Chip,
  Box,
} from '@mui/material';
import { Favorite, FavoriteBorder, AccessTime, Restaurant } from '@mui/icons-material';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  onToggleFavorite: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onSelect,
  onToggleFavorite,
}) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={recipe.image || '/placeholder-recipe.jpg'}
        alt={recipe.title}
        sx={{ cursor: 'pointer' }}
        onClick={() => onSelect(recipe)}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="h2"
          sx={{ cursor: 'pointer' }}
          onClick={() => onSelect(recipe)}
        >
          {recipe.title}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
          {recipe.readyInMinutes && (
            <Chip
              icon={<AccessTime />}
              label={`${recipe.readyInMinutes} min`}
              size="small"
              variant="outlined"
            />
          )}
          {recipe.servings && (
            <Chip
              icon={<Restaurant />}
              label={`${recipe.servings} servings`}
              size="small"
              variant="outlined"
            />
          )}
        </Box>

        {recipe.diets && recipe.diets.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
            {recipe.diets.slice(0, 2).map((diet) => (
              <Chip key={diet} label={diet} size="small" color="primary" />
            ))}
          </Box>
        )}
      </CardContent>

      <CardActions>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(recipe);
          }}
          color="error"
        >
          {recipe.isFavorite ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
      </CardActions>
    </Card>
  );
};
