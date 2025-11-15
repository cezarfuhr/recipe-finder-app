import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import {
  Close,
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  AccessTime,
  Restaurant,
} from '@mui/icons-material';
import { Recipe } from '../types';

interface RecipeDetailsProps {
  recipe: Recipe | null;
  open: boolean;
  onClose: () => void;
  onToggleFavorite: (recipe: Recipe) => void;
  onAddToShoppingList: (recipe: Recipe) => void;
}

export const RecipeDetails: React.FC<RecipeDetailsProps> = ({
  recipe,
  open,
  onClose,
  onToggleFavorite,
  onAddToShoppingList,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!recipe) return null;

  const steps = recipe.analyzedInstructions?.[0]?.steps || [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">{recipe.title}</Typography>
          <Box>
            <IconButton onClick={() => onToggleFavorite(recipe)} color="error">
              {recipe.isFavorite ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box
          component="img"
          src={recipe.image}
          alt={recipe.title}
          sx={{ width: '100%', borderRadius: 2, mb: 2 }}
        />

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          {recipe.readyInMinutes && (
            <Chip icon={<AccessTime />} label={`${recipe.readyInMinutes} min`} />
          )}
          {recipe.servings && (
            <Chip icon={<Restaurant />} label={`${recipe.servings} servings`} />
          )}
          {recipe.diets?.map((diet) => (
            <Chip key={diet} label={diet} color="primary" />
          ))}
        </Box>

        {recipe.summary && (
          <>
            <Typography variant="h6" gutterBottom>
              Summary
            </Typography>
            <Typography
              variant="body2"
              dangerouslySetInnerHTML={{ __html: recipe.summary }}
              sx={{ mb: 2 }}
            />
            <Divider sx={{ my: 2 }} />
          </>
        )}

        {recipe.extendedIngredients && recipe.extendedIngredients.length > 0 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Ingredients
              </Typography>
              <Button
                startIcon={<ShoppingCart />}
                onClick={() => onAddToShoppingList(recipe)}
                size="small"
              >
                Add to Shopping List
              </Button>
            </Box>
            <List dense>
              {recipe.extendedIngredients.map((ingredient, index) => (
                <ListItem key={index}>
                  <ListItemText primary={ingredient.original} />
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
          </>
        )}

        {steps.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom>
              Instructions
            </Typography>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={index} active={index === activeStep}>
                  <StepLabel
                    onClick={() => setActiveStep(index)}
                    sx={{ cursor: 'pointer' }}
                  >
                    Step {step.number}
                  </StepLabel>
                  <StepContent>
                    <Typography>{step.step}</Typography>
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={() => setActiveStep(index + 1)}
                        disabled={index === steps.length - 1}
                        size="small"
                      >
                        {index === steps.length - 1 ? 'Finish' : 'Continue'}
                      </Button>
                      <Button
                        disabled={index === 0}
                        onClick={() => setActiveStep(index - 1)}
                        size="small"
                        sx={{ ml: 1 }}
                      >
                        Back
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </>
        )}

        {recipe.nutrition && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Nutrition
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {recipe.nutrition.nutrients.slice(0, 5).map((nutrient) => (
                <Chip
                  key={nutrient.name}
                  label={`${nutrient.name}: ${nutrient.amount.toFixed(1)}${nutrient.unit}`}
                  variant="outlined"
                />
              ))}
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
