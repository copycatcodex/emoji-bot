# Emoji Auto Play Script

This script automates tasks such as logging in, claiming free tickets, completing quests, and playing games on the Emoji app.

---

## Table of Contents
- [Prerequisites](#prerequisites)
- [How to Obtain Your Query ID](#how-to-obtain-your-query-id)
- [Running the Script](#running-the-script)
  - [For Windows](#for-windows)
  - [For Linux](#for-linux)
- [Features](#features)
- [Notes](#notes)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

1. **Node.js and npm**  
   Make sure you have Node.js and npm installed.  
   - [Download Node.js](https://nodejs.org/)

2. **Dependencies**  
   The required dependencies are listed in `package.json`. Install them using the instructions below.

3. **Account Registration**  
   To use this script, you need an account. Register via Telegram by clicking the link below:  
   [Register Account on Telegram](https://t.me/webemoji_bot/play?startapp=812826573)

---

## How to Obtain Your Query ID

### Step-by-Step Instructions

1. **Login to Telegram**  
   Open the [Emoji Bot](https://t.me/webemoji_bot) in Telegram.

2. **Start the App**  
   Use the `/play` command or follow the link provided after registration.

3. **Enable Debugging in Telegram**  
   - Go to **Settings > Privacy and Security > Data and Storage > Debug Logs**.
   - Enable logging and replay the `/play` command.

4. **Capture the Query ID**  
   - Open the debug log file after sending the `/play` command.
   - Look for a URL like this:
     ```
     https://emojiapp.xyz/?query_id=YOUR_QUERY_ID
     ```
   - Copy the `query_id` value.

## How to Obtain Your User-Agent

1. **Go to a User-Agent Detection Website**  
   To get your user-agent, visit the following website:  
   [What is my User-Agent?](https://www.whatismybrowser.com/detect/what-is-my-user-agent/)

2. **Using Your Default Mobile Browser**  
   **Important**: Use the default browser on your phone (avoid using Chrome).  
   - Open the link in your phone's default browser (such as Safari for iPhone or Samsung Internet for Samsung devices).
   - Copy the User-Agent string provided on the webpage.
---
### Replace `YOUR_QUERY_ID` with your query ID and `YOUR_USER_AGENT` with a valid user agent string.
 **Add Query ID and User-agent to `data.json`**  
   the script directory and format it like this:
   ```json
   [
     {
       "queryId": "YOUR_QUERY_ID",
       "userAgent": "YOUR_USER_AGENT"
     }
   ]

