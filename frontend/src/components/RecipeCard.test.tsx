import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RecipeCard } from './RecipeCard';
import { Recipe } from '../types';

const mockRecipe: Recipe = {
  id: 1,
  title: 'Test Recipe',
  image: 'test.jpg',
  readyInMinutes: 30,
  servings: 4,
  diets: ['vegetarian'],
  isFavorite: false,
};

describe('RecipeCard', () => {
  it('renders recipe information', () => {
    const onSelect = jest.fn();
    const onToggleFavorite = jest.fn();

    render(
      <RecipeCard
        recipe={mockRecipe}
        onSelect={onSelect}
        onToggleFavorite={onToggleFavorite}
      />
    );

    expect(screen.getByText('Test Recipe')).toBeInTheDocument();
    expect(screen.getByText('30 min')).toBeInTheDocument();
    expect(screen.getByText('4 servings')).toBeInTheDocument();
    expect(screen.getByText('vegetarian')).toBeInTheDocument();
  });

  it('calls onSelect when recipe is clicked', () => {
    const onSelect = jest.fn();
    const onToggleFavorite = jest.fn();

    render(
      <RecipeCard
        recipe={mockRecipe}
        onSelect={onSelect}
        onToggleFavorite={onToggleFavorite}
      />
    );

    fireEvent.click(screen.getByText('Test Recipe'));
    expect(onSelect).toHaveBeenCalledWith(mockRecipe);
  });

  it('calls onToggleFavorite when favorite button is clicked', () => {
    const onSelect = jest.fn();
    const onToggleFavorite = jest.fn();

    render(
      <RecipeCard
        recipe={mockRecipe}
        onSelect={onSelect}
        onToggleFavorite={onToggleFavorite}
      />
    );

    const favoriteButton = screen.getByRole('button');
    fireEvent.click(favoriteButton);
    expect(onToggleFavorite).toHaveBeenCalledWith(mockRecipe);
  });
});
