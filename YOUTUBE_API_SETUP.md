# YouTube API Setup Guide

This app uses the YouTube Data API v3 to fetch personalized educational videos for athletes about NIL, taxes, and financial planning.

## Quick Setup (5 minutes)

### 1. Get Your Free API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click **"Select a project"** → **"New Project"**
4. Enter a project name (e.g., "Athlete Dashboard") and click **Create**
5. Wait for the project to be created (about 30 seconds)

### 2. Enable YouTube Data API v3

1. In the Cloud Console, go to **APIs & Services** → **Library**
2. Search for **"YouTube Data API v3"**
3. Click on it, then click **Enable**

### 3. Create API Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **API Key**
3. Your API key will be created and shown in a popup
4. Click **Copy** to copy the API key
5. (Optional but recommended) Click **Restrict Key** and:
   - Under "API restrictions", select "Restrict key"
   - Check only "YouTube Data API v3"
   - Click **Save**

### 4. Add API Key to Your App

1. In your project folder, find the `.env.example` file
2. Copy it and rename to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and replace `your_api_key_here` with your actual API key:
   ```
   VITE_YOUTUBE_API_KEY=AIzaSyD...your_actual_key
   ```
4. Save the file

### 5. Restart Your Dev Server

```bash
npm run dev
```

That's it! The app will now fetch real YouTube videos personalized for each athlete.

## How It Works

The app automatically searches YouTube for relevant content based on:

- **User's sport** (e.g., Football → NIL opportunities for football players)
- **User's interests** (e.g., Tax Planning → quarterly tax payment videos)
- **Active deals** (e.g., Has brand deals → negotiation tips)
- **Tax status** (e.g., Behind on taxes → tax deadline videos)
- **Recent activity** (e.g., Social media income → social media marketing)

Videos are cached and updated intelligently to minimize API usage.

## Free Tier Limits

- **10,000 units per day** (free forever)
- Each search costs **100 units**
- Each video detail request costs **1 unit**
- With caching, you'll use ~200-500 units/day (well within limits)

## Troubleshooting

**Videos not showing?**
- Check that your `.env` file exists (not `.env.example`)
- Verify the API key is correct (no extra spaces)
- Make sure YouTube Data API v3 is enabled
- Check browser console for any error messages

**"API key not configured" message?**
- Restart your dev server after adding the `.env` file
- Vite requires a restart to pick up new environment variables

**API quota exceeded?**
- You hit the 10,000 units/day limit (unlikely)
- Wait until midnight Pacific Time for quota reset
- Or create a new project with a new API key

## Cost

The YouTube Data API v3 is **completely free** for up to 10,000 units/day. This is more than enough for this app. You will never be charged.

## Security Note

Never commit your `.env` file to git! It's already in `.gitignore` to prevent this.
