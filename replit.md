# Overview

Loralore is the official website for a student technology studio that develops innovative solutions including WeChat mini-programs, desktop applications, web applications, and algorithm research. The website showcases the team's philosophy, technical capabilities, and project portfolio with a modern, responsive design featuring dynamic backgrounds, interactive galleries, and multiple theme templates.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The website uses a pure static frontend approach with modern web technologies:

- **HTML5/CSS3/JavaScript (ES6+)**: Core structure built with semantic HTML, modern CSS features (Grid/Flexbox layouts, CSS variables, animations), and native JavaScript for all interactions
- **Responsive Design**: Mobile-first approach using media queries and flexible layouts
- **Multiple Theme System**: Contains separate template directories (`简约风格`, `二次元风格`, `影`, `音`) each with complete standalone implementations
- **Dynamic Visual Effects**: Particles.js integration for animated backgrounds, custom silk-shader backgrounds using Three.js, and fuzzy text effects

## Serverless Backend Architecture
The application leverages Netlify's serverless platform:

- **Netlify Functions**: Cloud functions handle backend operations like visitor counting and form processing
- **Netlify Blobs**: Provides persistent storage for data like visitor statistics
- **Static Site Generation**: Deployed as a static site with serverless augmentation

## Data Storage Strategy
- **Client-Side Storage**: Uses browser localStorage for user preferences and temporary data
- **Cloud Storage**: Netlify Blobs for persistent data like visitor counts
- **No Traditional Database**: Follows JAMstack principles with serverless data management

## Interactive Components
- **Gallery System**: Multiple display modes for project showcases with modal overlays
- **Contact Forms**: FormSpree integration for secure form submissions without backend infrastructure
- **Music/Media Players**: Custom implementations in theme templates with playlist management
- **Navigation System**: Smooth scrolling, responsive mobile menus, and multi-page routing

## Asset Management
- **Image Optimization**: Python script for WebP conversion and compression
- **Font Loading**: Google Fonts with preconnect optimization
- **CDN Integration**: Font Awesome and other assets loaded from CDNs

# External Dependencies

## Core Libraries
- **Particles.js**: Dynamic particle background animations
- **Three.js**: 3D graphics and shader-based visual effects (silk backgrounds)
- **Font Awesome**: Icon library for UI elements
- **Google Fonts**: Typography (Lato, Poppins, Noto Sans SC)

## Serverless Platform
- **Netlify**: Primary hosting platform providing Functions, Blobs storage, and CDN
- **@netlify/blobs**: Node.js package for serverless data persistence

## Third-Party Services
- **FormSpree**: Contact form processing and email delivery
- **Baidu Analytics**: Website traffic monitoring and analytics

## Development Tools
- **PIL (Python Imaging Library)**: Image compression and optimization scripts
- **GSAP**: Animation library used in some theme templates
- **Bootstrap**: CSS framework used in certain template variations

## Content Delivery
- **Various CDNs**: Bootstrap, Swiper.js, and other assets delivered via CDN for performance
- **Cross-origin Resource Management**: Proper CORS configuration for asset loading