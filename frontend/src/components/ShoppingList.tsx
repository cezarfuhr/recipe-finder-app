import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Typography,
  Box,
  Button,
  Divider,
  Paper,
} from '@mui/material';
import { Delete, Clear } from '@mui/icons-material';
import { ShoppingListItem } from '../types';

interface ShoppingListProps {
  items: ShoppingListItem[];
  onTogglePurchased: (id: string, purchased: boolean) => void;
  onRemoveItem: (id: string) => void;
  onClearList: () => void;
  onClearPurchased: () => void;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({
  items,
  onTogglePurchased,
  onRemoveItem,
  onClearList,
  onClearPurchased,
}) => {
  const purchasedCount = items.filter((item) => item.purchased).length;

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Shopping List ({items.length} items, {purchasedCount} purchased)
        </Typography>
        <Box>
          <Button
            size="small"
            onClick={onClearPurchased}
            disabled={purchasedCount === 0}
            sx={{ mr: 1 }}
          >
            Clear Purchased
          </Button>
          <Button
            size="small"
            color="error"
            startIcon={<Clear />}
            onClick={onClearList}
            disabled={items.length === 0}
          >
            Clear All
          </Button>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {items.length === 0 ? (
        <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
          Your shopping list is empty. Add ingredients from recipes!
        </Typography>
      ) : (
        <List>
          {items.map((item) => (
            <ListItem
              key={item.id}
              sx={{
                textDecoration: item.purchased ? 'line-through' : 'none',
                opacity: item.purchased ? 0.6 : 1,
              }}
            >
              <Checkbox
                checked={item.purchased}
                onChange={(e) => onTogglePurchased(item.id, e.target.checked)}
              />
              <ListItemText
                primary={item.name}
                secondary={
                  <>
                    {item.amount} {item.unit}
                    {item.recipeName && ` • ${item.recipeName}`}
                  </>
                }
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => onRemoveItem(item.id)}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};
