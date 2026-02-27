// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

// necessario per __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const app = express();   
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

// API 
app.get('/api/album/:folder', async (req, res) => {
  const folder = req.params.folder; 
  
  try {
    const result = await cloudinary.search
      .expression(`folder:${folder}`)
      .sort_by('public_id', 'asc')
      .max_results(100)
      .execute();

    const images = result.resources.map(img => ({
      name: img.public_id,
      url: img.secure_url
    }));

    res.json(images);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore nel recuperare immagini' });
  }
});

// Avvia il server
app.listen(PORT, () => {
  console.log(`Server attivo su http://localhost:${PORT}`);
});