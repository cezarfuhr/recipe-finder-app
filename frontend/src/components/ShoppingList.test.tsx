import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ShoppingList } from './ShoppingList';
import { ShoppingListItem } from '../types';

const mockItems: ShoppingListItem[] = [
  {
    id: '1',
    name: 'Tomatoes',
    amount: 2,
    unit: 'kg',
    purchased: false,
  },
  {
    id: '2',
    name: 'Milk',
    amount: 1,
    unit: 'L',
    purchased: true,
  },
];

describe('ShoppingList', () => {
  it('renders shopping list items', () => {
    const onTogglePurchased = jest.fn();
    const onRemoveItem = jest.fn();
    const onClearList = jest.fn();
    const onClearPurchased = jest.fn();

    render(
      <ShoppingList
        items={mockItems}
        onTogglePurchased={onTogglePurchased}
        onRemoveItem={onRemoveItem}
        onClearList={onClearList}
        onClearPurchased={onClearPurchased}
      />
    );

    expect(screen.getByText('Tomatoes')).toBeInTheDocument();
    expect(screen.getByText('Milk')).toBeInTheDocument();
  });

  it('shows correct item count', () => {
    const onTogglePurchased = jest.fn();
    const onRemoveItem = jest.fn();
    const onClearList = jest.fn();
    const onClearPurchased = jest.fn();

    render(
      <ShoppingList
        items={mockItems}
        onTogglePurchased={onTogglePurchased}
        onRemoveItem={onRemoveItem}
        onClearList={onClearList}
        onClearPurchased={onClearPurchased}
      />
    );

    expect(screen.getByText(/2 items, 1 purchased/)).toBeInTheDocument();
  });

  it('shows empty message when no items', () => {
    const onTogglePurchased = jest.fn();
    const onRemoveItem = jest.fn();
    const onClearList = jest.fn();
    const onClearPurchased = jest.fn();

    render(
      <ShoppingList
        items={[]}
        onTogglePurchased={onTogglePurchased}
        onRemoveItem={onRemoveItem}
        onClearList={onClearList}
        onClearPurchased={onClearPurchased}
      />
    );

    expect(screen.getByText(/Your shopping list is empty/)).toBeInTheDocument();
  });
});
