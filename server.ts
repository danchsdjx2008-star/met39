import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import fetch from "node-fetch";

const db = new Database("met39.db");

// Initialize Database Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS movies (
    id TEXT PRIMARY KEY,
    name TEXT,
    slug TEXT UNIQUE,
    origin_name TEXT,
    thumb_url TEXT,
    poster_url TEXT,
    content TEXT,
    year INTEGER,
    episode_current TEXT,
    episode_total TEXT,
    status TEXT
  );

  CREATE TABLE IF NOT EXISTS episodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    movie_id TEXT,
    episode_name TEXT,
    episode_slug TEXT,
    video_url TEXT,
    server TEXT,
    status TEXT DEFAULT 'active',
    UNIQUE(movie_id, episode_slug, server),
    FOREIGN KEY(movie_id) REFERENCES movies(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API: Get movie detail and episodes from DB
  app.get("/api/movie/:slug", async (req, res) => {
    const { slug } = req.params;
    
    try {
      let movie = db.prepare("SELECT * FROM movies WHERE slug = ?").get(slug) as any;
      
      // If not in DB, fetch from external API and cache it
      if (!movie) {
        const extRes = await fetch(`https://phimapi.com/phim/${slug}`);
        const extData = await extRes.json() as any;
        
        if (extData.status) {
          const m = extData.movie;
          db.prepare(`
            INSERT OR IGNORE INTO movies (id, name, slug, origin_name, thumb_url, poster_url, content, year, episode_current, episode_total, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(m._id, m.name, m.slug, m.origin_name, m.thumb_url, m.poster_url, m.content, m.year, m.episode_current, m.episode_total, m.status);
          
          // Insert episodes
          for (const server of extData.episodes) {
            for (const ep of server.server_data) {
              db.prepare(`
                INSERT OR IGNORE INTO episodes (movie_id, episode_name, episode_slug, video_url, server, status)
                VALUES (?, ?, ?, ?, ?, ?)
              `).run(m._id, ep.name, ep.slug, ep.link_embed, server.server_name, 'active');
            }
          }
          movie = db.prepare("SELECT * FROM movies WHERE slug = ?").get(slug);
        }
      }

      if (!movie) {
        return res.status(404).json({ status: false, message: "Không tìm thấy phim" });
      }

      // Get unique episodes by slug to avoid duplicates from multiple servers in the UI
      const episodes = db.prepare(`
        SELECT * FROM episodes 
        WHERE movie_id = ? AND status = 'active' 
        GROUP BY episode_slug 
        ORDER BY id ASC
      `).all(movie.id);
      
      res.json({
        status: true,
        movie: {
          ...movie,
          episodes: [{
            server_name: "Default",
            server_data: episodes.map((e: any) => ({
              name: e.episode_name,
              slug: e.episode_slug,
              link_embed: e.video_url
            }))
          }]
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: "Lỗi máy chủ nội bộ" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
