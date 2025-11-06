# Xpedition - Exotic Super Bikes

A modern, fully responsive bike dealership front-end built with Next.js (App Router), TypeScript, and Tailwind CSS.

## Features

- 🎨 Modern design with red, black, and white color palette
- 📱 Fully responsive across all devices
- ⚡ Built with Next.js 16 (App Router)
- 🎯 TypeScript for type safety
- 🎭 Framer Motion for smooth animations
- 🎨 Tailwind CSS for styling

## Pages

- **Home** - Main landing page with hero section, popular bikes, categories, and testimonials
- **Inventory** - Complete list of available bikes
- **Sell Us** - Form to sell your bike (front-end only)
- **Family** - Placeholder page
- **About** - About us information
- **Contact** - Contact information and form

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository or navigate to the project directory:
   ```bash
   cd Xpedition
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Build for Production

To create an optimized production build:

```bash
npm run build
npm start
```

## Project Structure

```
Xpedition/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── inventory/         # Inventory page
│   ├── sell-us/           # Sell Us page
│   ├── family/            # Family page
│   ├── about/             # About page
│   └── contact/           # Contact page
├── components/            # Reusable React components
│   ├── Navbar.tsx        # Navigation bar
│   ├── Hero.tsx          # Hero section
│   ├── BikeCard.tsx      # Bike card component
│   ├── PopularBikes.tsx  # Popular bikes section
│   ├── BrowseByCategory.tsx # Category browsing section
│   ├── CustomerTestimonials.tsx # Testimonials section
│   └── Footer.tsx         # Footer component
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── next.config.mjs        # Next.js configuration
```

## Components

### Navbar
Sticky navigation bar with links to all pages. Transparent on scroll, becomes solid on scroll down.

### Hero
Full-width split background (black/red) with bike image overlapping. Contains main heading and call-to-action buttons.

### BikeCard
Reusable card component for displaying bike information including image, price, model, and details.

### PopularBikes
Section displaying popular bikes in a responsive grid (4 columns on desktop).

### BrowseByCategory
Six circular category icons with hover effects on a dark background.

### CustomerTestimonials
Hexagonal layout for customer images with testimonials and brand logos.

### Footer
Four-column footer with About Us, Quick Links, Contact Info, and Google Maps iframe.

## Styling

The project uses Tailwind CSS with a custom color palette:
- Primary Red: `#DC2626`
- Primary Black: `#000000`
- Primary White: `#FFFFFF`
- Primary Dark: `#1A1A1A`

## Image Placeholders

Currently, all images use placeholder URLs from Unsplash. Replace these with your actual images when ready.

## Next Steps

- Add backend API integration
- Connect to database for bike inventory
- Implement form submission functionality
- Add image upload functionality
- Replace placeholder images with actual content

## Technologies

- **Next.js 16** - React framework with App Router
- **React 19** - Latest React version
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library

## License

This project is private and proprietary.

