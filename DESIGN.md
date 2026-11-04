---
version: alpha
name: EazyWed
description: Botanical editorial wedding discovery with calm, practical planning tools.
colors:
  primary: "#183E35"
  background: "#FFFFFF"
  surface: "#F3F7F4"
  accent: "#B89B60"
  text: "#183E35"
  muted: "#5F746A"
  border: "#DCE5DF"
  danger: "#A02D3A"
typography:
  sans:
    fontFamily: "Manrope, Arial, sans-serif"
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
rounded:
  DEFAULT: "0.75rem"
  sm: "0.5rem"
  lg: "1.25rem"
spacing:
  section-gap: "5rem"
  page-max: "80rem"
components:
  button:
    minHeight: "44px"
  card:
    imageRatio: "4 / 3"
  input:
    minHeight: "48px"
---

# EazyWed design system

## Current beta scope

Laayoune only, frontend only. This decision supersedes earlier all-Morocco and database-backed plans. Public business records live in `eazywed/src/data/laayoune.js`. No backend process or Atlas connection is used. Unknown prices, reviews and discounts remain unknown. HeroOffers owns the rotating service-highlight banners; BetaVendorDetails owns the source-backed detail page. See UX-CONTRACT.md.

## Overview

The reference world is a garden wedding invitation: botanical green, delicate serif lettering and evocative photographs. The signature is an editorial photo composition with a useful search panel beneath it. Product screens remain quieter and task-focused.

Audience: couples and families planning Moroccan weddings. Evidence: existing city filters, MAD prices, wedding categories and vendor onboarding. English UI with fr-MA currency formatting; no Japan-market scope. Hybrid register: expressive homepage, functional catalog/details/auth. Retain EazyWed brand and role permissions.

## Token ownership/runtime mapping

This document describes the runtime source of truth, `eazywed/src/styles/experience.css` :root --ew-* tokens. --ew-forest and --ew-ink map primary/text; --ew-sage and --ew-surface map surface; --ew-gold and --ew-accent map accent. Agents must update this document and runtime together.

## Typography and layout

Cormorant Garamond for editorial headings, Manrope for controls/body, system fallbacks. Display headings use responsive clamp; body 15–16px, 1.6 line height. Page width 1280px, 24px gutters desktop and 20px phone. 8px spacing rhythm. Catalog uses 3 columns desktop and 1 phone. No fixed-height content that clips text.

## Shapes and depth

8px controls, 12–20px panels, circular icon buttons only. Use borders for utility, soft tinted shadow for floating search. Photography provides depth; avoid excessive gradients and decorative cards.

## Components and states

Shared Navbar/Footer/SearchBar/ServiceCard are canonical. Buttons have 44px targets, hover/focus/pressed/disabled states. Photos reserve aspect ratio and load lazily except hero. Cards are links, save action is a separate button. Empty/error states explain recovery. Native selects intentionally accept OS popup geometry and keyboard behavior. Dialog uses native dialog semantics with focus restoration and Escape. Toasts use the existing provider; critical errors remain inline.

## Motion and accessibility

160–220ms feedback, no parallax. Respect prefers-reduced-motion. Focus uses a visible gold/green ring, text labels accompany important icons. Global scrollbar track/thumb styles cover all owned scrollers. White-on-forest primary actions; gold is an accent rather than small text on white.

## Content

Use plain sentence case, MAD prices, honest vendor data. No invented trust badges, transaction counts or testimonials. Demo data is explicitly marked; no fake WhatsApp or booking action. Preserve protected admin/vendor operations.

## Do / don't

Keep search, filters and prices prominent. Keep city/filter state shareable. Do not make users sign in to browse. Do not add unsupported business policies or obscure unavailable features.
