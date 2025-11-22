# James Khadan - Portfolio Website

A modern, responsive portfolio website built with Next.js, TypeScript, and Tailwind CSS. This portfolio showcases my journey as a Computer Science student at Northeastern University and my experience as a full-stack software engineer.

[![Deploy to GitHub Pages](https://github.com/jkhadan/jkhadan.github.io/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/jkhadan/jkhadan.github.io/actions/workflows/deploy.yml)
![Next.js](https://img.shields.io/badge/Next.js-14+-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4+-38B2AC)

## 🌟 Features

### Core Functionality
- **Responsive Design** - Perfect display across all devices and screen sizes
- **Dark/Light Theme** - Seamless theme switching with system preference detection
- **Smooth Animations** - Engaging micro-interactions and page transitions
- **Interactive Components** - Dynamic project and experience detail modals
- **Optimized Performance** - Fast loading times and efficient rendering

### Sections
- **Hero** - Dynamic typewriter effect showcasing multiple roles
- **About** - Personal introduction and educational background
- **Skills & Education** - Technical skills, coursework, and club involvement
- **Projects** - Featured projects with detailed modal views and image galleries
- **Experience** - Professional timeline with comprehensive details
- **Contact** - Multiple contact methods and social links

### Advanced Features
- **Project Gallery** - Image navigation with enlarged view modal
- **Experience Timeline** - Interactive timeline with detailed cards
- **Club Details** - Comprehensive club involvement with achievements
- **Course Information** - Detailed coursework with skills learned
- **Mobile Navigation** - Collapsible mobile menu with smooth animations

## 🛠️ Tech Stack

### Frontend
- **Next.js 13+** - React framework with App Router
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework

### Libraries & Tools
- **next-themes** - Theme switching functionality
- **Lucide React** - Beautiful icon library
- **React Icons** - Additional icon sets (Di*, Si*, etc.)
- **Framer Motion** - Smooth animations and transitions

### Development
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jkhadan/portfolio-website.git
   cd portfolio-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start

# or

yarn build
yarn start
```

## 📁 Project Structure

```
├── components/              # React components
│   ├── clubs/              # Club-related components
│   ├── courses/            # Course detail components
│   ├── experience/         # Experience components
│   ├── home/               # Home page sections
│   ├── layout/             # Layout components (Header, Footer)
│   ├── projects/           # Project components
│   └── ui/                 # Reusable UI components
├── data/                   # Static data files
│   ├── experience.ts       # Professional experience data
│   ├── projects.ts         # Project portfolio data
│   └── skills.ts           # Skills and education data
├── pages/                  # Next.js pages
├── styles/                 # Global styles
├── theme/                  # Theme provider configuration
└── types/                  # TypeScript type definitions
```

## 📱 Mobile Optimization

The website includes:
- Responsive grid layouts
- Mobile-specific navigation
- Touch-friendly interactive elements
- Accessible mobile experience

## ♿ Accessibility Features

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Color contrast compliance
- Screen reader optimization

## 🔧 Performance Optimizations

- Lazy loading components
- Minimal JavaScript bundles
- CSS purging with Tailwind
- Optimized font loading

## 📞 Contact

- **Email**: [jameskhadan@gmail.com](mailto:jameskhadan@gmail.com)
- **LinkedIn**: [linkedin.com/in/jameskhadan](https://linkedin.com/in/jameskhadan)
- **GitHub**: [github.com/jkhadan](https://github.com/jkhadan)
- **Portfolio**: [jkhadan.github.io](https://jkhadan.github.io)
