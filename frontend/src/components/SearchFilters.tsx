import React, { useState } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  Slider,
} from '@mui/material';
import { ExpandMore, Search } from '@mui/icons-material';
import { SearchFilters as Filters } from '../types';

interface SearchFiltersProps {
  onSearch: (filters: Filters) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch }) => {
  const [filters, setFilters] = useState<Filters>({});

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleChange = (field: keyof Filters, value: string | number | undefined) => {
    setFilters((prev) => ({ ...prev, [field]: value || undefined }));
  };

  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        fullWidth
        label="Search recipes..."
        variant="outlined"
        value={filters.query || ''}
        onChange={(e) => handleChange('query', e.target.value)}
        InputProps={{
          endAdornment: (
            <Button
              variant="contained"
              onClick={handleSearch}
              startIcon={<Search />}
              sx={{ ml: 1 }}
            >
              Search
            </Button>
          ),
        }}
        sx={{ mb: 2 }}
      />

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Advanced Filters</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Cuisine</InputLabel>
                <Select
                  value={filters.cuisine || ''}
                  label="Cuisine"
                  onChange={(e) => handleChange('cuisine', e.target.value)}
                >
                  <MenuItem value="">Any</MenuItem>
                  <MenuItem value="italian">Italian</MenuItem>
                  <MenuItem value="mexican">Mexican</MenuItem>
                  <MenuItem value="asian">Asian</MenuItem>
                  <MenuItem value="american">American</MenuItem>
                  <MenuItem value="french">French</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Diet</InputLabel>
                <Select
                  value={filters.diet || ''}
                  label="Diet"
                  onChange={(e) => handleChange('diet', e.target.value)}
                >
                  <MenuItem value="">Any</MenuItem>
                  <MenuItem value="vegetarian">Vegetarian</MenuItem>
                  <MenuItem value="vegan">Vegan</MenuItem>
                  <MenuItem value="gluten free">Gluten Free</MenuItem>
                  <MenuItem value="ketogenic">Ketogenic</MenuItem>
                  <MenuItem value="paleo">Paleo</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filters.type || ''}
                  label="Type"
                  onChange={(e) => handleChange('type', e.target.value)}
                >
                  <MenuItem value="">Any</MenuItem>
                  <MenuItem value="main course">Main Course</MenuItem>
                  <MenuItem value="dessert">Dessert</MenuItem>
                  <MenuItem value="appetizer">Appetizer</MenuItem>
                  <MenuItem value="breakfast">Breakfast</MenuItem>
                  <MenuItem value="salad">Salad</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Max Ready Time (minutes)</Typography>
              <Slider
                value={filters.maxReadyTime || 120}
                onChange={(_, value) => handleChange('maxReadyTime', value as number)}
                min={0}
                max={240}
                step={15}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>
                Calories: {filters.minCalories || 0} - {filters.maxCalories || 2000}
              </Typography>
              <Slider
                value={[filters.minCalories || 0, filters.maxCalories || 2000]}
                onChange={(_, value) => {
                  const [min, max] = value as number[];
                  handleChange('minCalories', min);
                  handleChange('maxCalories', max);
                }}
                min={0}
                max={2000}
                step={50}
                valueLabelDisplay="auto"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography gutterBottom>
                Protein (g): {filters.minProtein || 0} - {filters.maxProtein || 100}
              </Typography>
              <Slider
                value={[filters.minProtein || 0, filters.maxProtein || 100]}
                onChange={(_, value) => {
                  const [min, max] = value as number[];
                  handleChange('minProtein', min);
                  handleChange('maxProtein', max);
                }}
                min={0}
                max={100}
                step={5}
                valueLabelDisplay="auto"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography gutterBottom>
                Carbs (g): {filters.minCarbs || 0} - {filters.maxCarbs || 200}
              </Typography>
              <Slider
                value={[filters.minCarbs || 0, filters.maxCarbs || 200]}
                onChange={(_, value) => {
                  const [min, max] = value as number[];
                  handleChange('minCarbs', min);
                  handleChange('maxCarbs', max);
                }}
                min={0}
                max={200}
                step={10}
                valueLabelDisplay="auto"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography gutterBottom>
                Fat (g): {filters.minFat || 0} - {filters.maxFat || 100}
              </Typography>
              <Slider
                value={[filters.minFat || 0, filters.maxFat || 100]}
                onChange={(_, value) => {
                  const [min, max] = value as number[];
                  handleChange('minFat', min);
                  handleChange('maxFat', max);
                }}
                min={0}
                max={100}
                step={5}
                valueLabelDisplay="auto"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
