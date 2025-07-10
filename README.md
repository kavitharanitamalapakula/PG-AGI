# Personalized Content Dashboard

## Overview
This project is a "Personalized Content Dashboard" built with React, Redux, Next.js, and TypeScript. It provides users with a dynamic and interactive interface to track and engage with personalized content such as news, music recommendations, and social media posts. The dashboard allows users to customize their preferences, reorder content via drag-and-drop, and enjoy a responsive, dark-mode enabled UI.

## Features

### Core Features
- **Personalized Content Feed**  
  - Fetches latest technology news from NewsAPI based on user preferences.  
  - Displays personalized music recommendations from Spotify API (new releases).  
  - Shows social media posts fetched from a mock API.  
- **Interactive Content Cards**  
  - Content displayed as cards with images, headlines, descriptions, and action buttons.  
  - Supports drag-and-drop reordering of content cards using React DnD.  
- **User Preferences & State Management**  
  - Uses Redux Toolkit for global state management of news, social posts, and Spotify tracks.  
  - Supports reordering of content with state persisted in Redux.  
- **Dashboard Layout & UI**  
  - Responsive layout with support for dark mode using Tailwind CSS.  
  - Smooth animations and transitions for interactive elements.  

## Tech Stack
- React 18 with Next.js 13 (App Router)  
- TypeScript for type safety  
- Redux Toolkit for state management  
- React DnD for drag-and-drop functionality  
- Tailwind CSS for styling and dark mode support  

## Usage
- Configure your content preferences in the settings panel (if implemented).  
- Browse personalized news, music, and social media posts in the unified feed.  
- Drag and reorder content cards to customize your dashboard layout.  
- Use the search bar to find content across categories (if implemented).  
- Toggle dark mode for a comfortable viewing experience.  


## Notes
- Spotify API integration uses client credentials flow to fetch new releases.  
- Social media posts are fetched from a mock API endpoint.  
- NewsAPI is used for fetching technology news headlines.  
- User preferences and dark mode settings can be persisted using Redux or localStorage (depending on implementation).  


Thank you for reviewing this project. For any questions or feedback, please open an issue or contact the maintainer.
