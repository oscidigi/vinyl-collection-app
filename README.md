# 🎵 Vinyl Collection Viewer

## Project Overview
A dynamic web application that displays a vinyl record collection pulled from a Google Sheet. Users can easily customize and deploy their own collection.

![Vinyl Collection Demo Screenshot](screenshot.png)

## Example Collection
- [Example collection with dummy data](https://oscidigi.github.io/vinyl-collection-app/)

## Features Showcase
This app provides an elegant, filterable grid view of your vinyl record collection. Key features include:
- Responsive album card display
- Comprehensive filtering options (by artist, genre, year, etc.)
- Clean, modern design
- Easy customization

## Key Features
- Fetch album data dynamically from a Google Sheet
- Display album artwork, details, and Spotify links
- Easy to fork or download for personal use
- Simple deployment to GitHub Pages

## Quick Start 🚀

### 1. Get the Template
- Open the [Vinyl Collection - TEMPLATE Google Sheet](https://docs.google.com/spreadsheets/d/1IRzoNtRO_GW0C_FxdZlZ-X9aHEeS7KSdf86Rxf4M6Ik/edit?usp=sharing)
- Make a copy to your Google Drive
- Enter your vinyl collection data

### 2. Publish Spreadsheet
- Click `File` > `Share` > `Publish to web`
- Select CSV format
- Copy the generated link

### 3. Deploy Your Collection

#### Option A: GitHub Pages (Recommended)
- Fork this repository
- Update the CSV link in `js/data.js`
- Enable GitHub Pages in repository settings

#### Option B: Self-Hosting
- Download the repository as a ZIP file
- Update the CSV link in `js/data.js`
- Upload to a web hosting service like Netlify, Vercel, or DigitalOcean

## Spreadsheet Columns 📊

| Column | Description | Required | Example |
|--------|-------------|----------|---------|
| artist | Full name of the artist/band | YES | "Miles Davis" |
| title | Album name | YES | "Kind of Blue" |
| category | Optional collection category | NO | "Jazz", "Personal Favorites" |
| genre | Music genre | YES | "Jazz" |
| year | Release year | YES | 1959 |
| favorite | Mark as favorite? | NO | "Yes" or "No" |
| isEP | Is this an EP? | NO | "Yes" or "No" |
| size | Vinyl record size | YES | "12\"", "10\"", or "7\"" |
| notes | Additional comments | NO | "Landmark jazz album" |
| artwork | Direct image URL | NO | "https://example.com/album-cover.jpg" |
| spotifyURL | Album Spotify link | YES | "https://open.spotify.com/album/..." |

## Features ✨
- Dynamically fetch album data from Google Sheets
- Display album artwork, details, and Spotify links
- Responsive design
- Easy customization
- No build step required

## Getting Started 📖
For detailed setup instructions, check out our [GETTING_STARTED.md](GETTING_STARTED.md)

## Contributing 🤝
- Open issues for bugs or feature requests
- Pull requests are welcome!

## License 📄
Open-source. See LICENSE file for details.

**Happy Collecting! 🎧🖤**
