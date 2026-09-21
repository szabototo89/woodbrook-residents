# Juliet Rose gift cards

Status: Available

## Job to be done

When someone wants to give a Juliet Rose treatment as a gift, help them understand the eGift card and reach the studio’s existing checkout without leaving the site’s visual experience too early.

## Visible behavior

- Gift-card links in the homepage, desktop and mobile navigation, and footer open `/gift-cards`.
- The gift-card page uses the Juliet Rose typography, warm ivory and blush palette, existing floral gift-card image, and familiar primary action style.
- The page explains that the recipient can choose a Juliet Rose treatment and that the purchaser chooses the value in the existing checkout.
- The primary action clearly tells visitors when they are continuing to the existing Juliet Rose checkout.
- A compact help section provides the studio’s existing telephone and email contact paths.
- On mobile, content forms a single readable column, the checkout action fills the content width, tap targets remain at least 48 pixels high, and the page has no horizontal overflow.

## Acceptance criteria

- `/gift-cards` has Juliet Rose page metadata and a canonical URL.
- The homepage “Buy a gift card” action opens `/gift-cards`.
- The gift-card page exposes a visible, accessible checkout link to `https://www.julietrosebeauty.com/gift-card`.
- The checkout handoff remains functional without pretending that payment is processed by this app.
- Automated tests cover the page content, homepage entry point, external checkout destination, metadata, mobile action size, and mobile overflow.
- The Juliet Rose app passes unit tests, type checking, browser tests, end-to-end tests, and a production build.

## Scope

This capability adds a responsive, in-app gift-card information and purchase-handoff page. It does not implement payment processing, a cart, gift-card delivery, balance lookup, redemption, or order management.

## Content source

- Juliet Rose Beauty Studio gift-card page: https://www.julietrosebeauty.com/gift-card (accessed 19 September 2026).
