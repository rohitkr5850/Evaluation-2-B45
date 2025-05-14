# REAL-TIME FILE PROCESSING SYSTEM

This Node.js project simulates a real time file processing system where :

- A new file is created every 3 seconds in the `processing/` folder
- It is then moved to `in-progress/` and processed for a secure random time (1 - 6 seconds).
- If processing takes less than 5 seconds , it moves to `completed/`.
- If it exceeds 5 seconds , it crashes and moves to `crashed/`.
- All actions are logged in `logs.txt`.

## Features

- Secure random durations using `crypto.randomInt()`.
- Status transitions : Processing - In-Progress - completed - crashed.
- Logs and warnings for slow or failed files.

## How to Run

```bash
npm install
node index.js