# Bidalong Auction Website
### Preview of home page and Single listing page
![Skjermopptak6-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/951020eb-43e3-41cc-a20c-b32080a0fd83)
### Preview of profile page and Edit listing page
![opptak4-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/f6b10abf-f36e-4099-b17e-8bc07bc767f2)


## Table of Contents
1. [Project Description](#project-description)
2. [Features](#features)
3. [User Stories](#user-stories)
4. [Technology Used](#technology-used)
5. [Installation Instructions](#installation-instructions)
7. [Credits](#credits)

## Project Description

The Bidalong Auction Website is a dynamic web application designed as a platform for users to create and participate in online auctions. Users can register, list items for bidding, place bids on items, and manage their profiles. This project showcases the skills developed over three semesters and integrates a front-end interface with a provided API.


## Features


- User registration and login for users with `stud.noroff.no` emails
- Profile management with avatar updates and credit balance display
- Auction functionality:
  - Create listings with titles, descriptions, deadlines, and media galleries
  - Place bids on listings created by other users
  - View all bids on a specific listing
- Search functionality for unregistered users to browse listings
- Responsive design for a seamless experience on various devices

## User Stories

1. **For registered users**:
   - Register with a `stud.noroff.no` email to access all features.
   - Login to view and manage your profile, including avatar updates and credit balance.
   - Create auction listings with a title, deadline, description, and media.
   - Place bids on available listings and view bids on your own listings.
2. **For unregistered users**:
   - Search and browse available auction listings.

## Technology Used

- HTML5
- Tailwind CSS
- JavaScript (ES6)
- PostCSS
- Vite
- Prettier
- Font Awesome (for icons)
- Netlify (for deployment)
- RESTful API (provided by Noroff)

## Installation Instructions

To set up the project locally, follow these steps:

### 1. **Clone the repository**:

```bash
git clone https://github.com/julieoyen/semesterproject-year2-julieoyen.git
```

### 2. **Navigate to the project directory**:

```bash
cd semesterproject-year2-julieoyen
```

### 3. **Install dependencies**:

Ensure you have Node.js installed. Then, run:

```bash
npm install
```

### 4. Environment Setup

Copy the .env_template File:
```bash
cp .env
```
Add Your API Key:

Open the newly created .env file in your code editor.

Add your API key in place of your-api-key-here:

    VITE_API_KEY=your-api-key-here

and add your API base:

    VITE_API_BASE=your-base-here

The base is the url of the api, https://v2.api.noroff.dev

You can get your API key here: Noroff API Key Documentation.

### 5. **Start the development server**:

```bash
npm start
```

### 6. **Open the project**:

The application will be accessible at `http://localhost:3000` in your preferred web browser.

## Credits

- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework.
- [Font Awesome](https://fontawesome.com/) for the icon library.
- Adobe Express
- Figma
