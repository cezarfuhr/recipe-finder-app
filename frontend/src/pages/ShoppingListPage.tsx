import React, { useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { useRecipeStore } from '../stores/useRecipeStore';
import { ShoppingList } from '../components/ShoppingList';

export const ShoppingListPage: React.FC = () => {
  const {
    shoppingList,
    loadShoppingList,
    updateShoppingListItem,
    removeFromShoppingList,
    clearShoppingList,
    clearPurchasedItems,
  } = useRecipeStore();

  useEffect(() => {
    loadShoppingList();
  }, [loadShoppingList]);

  const handleTogglePurchased = (id: string, purchased: boolean) => {
    updateShoppingListItem(id, { purchased });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4 }}>
        Shopping List
      </Typography>

      <ShoppingList
        items={shoppingList}
        onTogglePurchased={handleTogglePurchased}
        onRemoveItem={removeFromShoppingList}
        onClearList={clearShoppingList}
        onClearPurchased={clearPurchasedItems}
      />
    </Container>
  );
};
