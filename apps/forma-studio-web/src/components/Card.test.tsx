import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

test('Card renders panel, white, and muted variants with consistent padding classes', () => {
  const { rerender } = render(
    <Card variant="panel" data-testid="panel">
      Panel content
    </Card>,
  );
  const panel = screen.getByTestId('panel');
  expect(panel.tagName).toBe('SECTION');
  expect(panel).toHaveClass('card');
  expect(panel).toHaveClass('card--panel');
  expect(panel).toHaveClass('card--padding-lg');

  rerender(
    <Card as="article" variant="white" data-testid="white">
      White content
    </Card>,
  );
  const white = screen.getByTestId('white');
  expect(white.tagName).toBe('ARTICLE');
  expect(white).toHaveClass('card');
  expect(white).toHaveClass('card--white');
  expect(white).toHaveClass('card--padding-md');

  rerender(
    <Card as="div" variant="muted" padding="none" data-testid="muted">
      Muted content
    </Card>,
  );
  const muted = screen.getByTestId('muted');
  expect(muted).toHaveClass('card');
  expect(muted).toHaveClass('card--muted');
  expect(muted).toHaveClass('card--padding-none');
});

test('Card merges a custom className without dropping the base card classes', () => {
  render(
    <Card variant="white" className="package-card" data-testid="custom">
      Custom
    </Card>,
  );
  const card = screen.getByTestId('custom');
  expect(card).toHaveClass('card');
  expect(card).toHaveClass('card--white');
  expect(card).toHaveClass('package-card');
});

test('popular package cards keep identical padding to regular cards', () => {
  render(
    <>
      <Card variant="white" data-testid="regular">
        Regular
      </Card>
      <Card variant="white" popular data-testid="popular">
        Popular
      </Card>
    </>,
  );
  const regular = screen.getByTestId('regular');
  const popular = screen.getByTestId('popular');
  expect(regular.className).toContain('card--padding-md');
  expect(popular.className).toContain('card--padding-md');
  expect(popular).toHaveClass('card--popular');
});
