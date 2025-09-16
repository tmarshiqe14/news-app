# Setup Instructions

## Prerequisites

Before running this application, you need to install Node.js and npm.

### Install Node.js

**Option 1: Using Homebrew (Recommended for macOS)**
```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node
```

**Option 2: Download from Official Website**
1. Go to [nodejs.org](https://nodejs.org/)
2. Download the LTS version for macOS
3. Run the installer

**Option 3: Using Node Version Manager (nvm)**
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal or run:
source ~/.bashrc

# Install Node.js
nvm install node
nvm use node
```

## Verify Installation

After installing Node.js, verify it's working:

```bash
node --version
npm --version
```

You should see version numbers for both commands.

## Install Dependencies

Once Node.js is installed, run:

```bash
cd /Users/tk.tamer14/Downloads/cursor_folder/news-app
npm install
```

## Start the Development Server

```bash
npm run dev
```

The application will be available at: http://localhost:3000

## Troubleshooting

If you encounter any issues:

1. **Permission errors**: Try using `sudo` with npm commands
2. **Port already in use**: The app will automatically use the next available port
3. **Package conflicts**: Delete `node_modules` and `package-lock.json`, then run `npm install` again

## Project Features

Once running, you'll see:
- ✅ 20 news articles with mock data
- ✅ Responsive grid layout
- ✅ Beautiful shadcn/ui components
- ✅ Intelligent text truncation
- ✅ Article pages with AI summaries
- ✅ Interactive AI chatbot
- ✅ Mobile-responsive design
- ✅ High-quality images from external sources
