# AgriGuard — Early Detection and Management of Crop Diseases and Pest Infestations

Full-stack app for detecting potato and tomato leaf diseases from photos using a
trained Keras CNN, plus remedies, prevention tips, a farming guide, crop
management info, and a chatbot.

**Stack:** React + Vite · FastAPI · SQLite (dev) / PostgreSQL (prod) · TensorFlow/Keras
**Deploy targets:** Frontend → Vercel · Backend → Render

---

## Quick start (local)

You need **two terminals** — one for the backend, one for the frontend.

> ⚠️ **Do NOT open `index.html` with VS Code "Live Server".** This is a React + Vite
> project: the browser cannot run `.jsx` files directly, so Live Server shows a
> **blank white page**. Always start it with `npm run dev` (below).

### 1. Backend (terminal 1)
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate            # macOS/Linux: source .venv/bin/activate
pip install -r requirements-base.txt   # light install, no TensorFlow
uvicorn app.main:app --reload
```
- Works out of the box: uses a local SQLite file, and a ready-made `.env` is included.
- API docs: http://localhost:8000/docs · health check: http://localhost:8000/api/health

### 2. Frontend (terminal 2)
```bash
cd frontend
npm install
npm run dev
```
Open **http://localhost:5173**, click **Register**, create an account, and you're in.

Windows shortcut: double-click `run_backend.bat` and `run_frontend.bat`.

### 3. Enable real AI predictions
Everything works without the model **except** `AI Detect`, which returns a clear
"model not available" message until you:
1. Copy your trained `crop_disease_model_final.keras` into `backend/ml_models/`.
2. Install TensorFlow: `pip install -r requirements.txt` (needs **Python 3.9 – 3.12**, not 3.13).
3. Restart the backend.

**Verify the model contract** in `backend/app/ai/labels.py` (class order) and
`backend/app/ai/preprocess.py` (currently `/255.0` → `[0, 1]`). If they don't match
how the model was trained, predictions will be silently wrong.

---

## Project structure

```
backend/
  app/
    main.py  config.py  database.py
    models/ schemas/ routes/ auth/ ai/ chatbot/ data/ utils/
  ml_models/            # put crop_disease_model_final.keras here
  alembic/  tests/
  requirements-base.txt # everything except TensorFlow
  requirements.txt      # full (used by Render)
  .env / .env.example

frontend/
  src/
    pages/  components/  api/  context/  utils/  styles/
  public/images/        # offline SVG illustrations (diseases, crops, login art)
  .env / .env.example
render.yaml  vercel.json
```

---

## Running tests
```bash
cd backend
pytest -v
```
16 tests cover auth, every data endpoint, chat + history, upload validation and the
"model missing" error, using a temporary SQLite database.

---

## Deployment

### Backend → Render
1. Push this repo to GitHub.
2. In Render, choose **New → Blueprint** and point it at this repo (it will
   read `render.yaml` and provision a web service + a free Postgres
   database automatically; `DATABASE_URL` and `JWT_SECRET_KEY` are filled in for you), **or** create the web service manually:
   - Root directory: `backend`
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. In the Render dashboard (Environment tab) set `ALLOWED_ORIGINS` to your
   Vercel URL (added after the frontend step below). The blueprint already pins
   `PYTHON_VERSION=3.11.9` because TensorFlow 2.17 has no wheels for Python 3.13.
4. **Model file**: Render's free tier has limited disk and RAM.
   `tensorflow-cpu` plus the model file can be heavy — if the free plan's
   RAM (512 MB) isn't enough, you'll need a paid plan. Get the model onto
   the server via one of:
   - Git LFS (if the repo hosts it)
   - A small startup step that downloads it from S3/GCS using a signed URL
     stored in an env var
5. Once deployed, confirm `https://your-service.onrender.com/api/health`
   returns `{"status": "ok", ...}`.

### Frontend → Vercel
1. In Vercel, import the same repo.
2. Set **Root Directory** to `frontend`.
3. Framework preset: Vite (auto-detected).
4. Add environment variable `VITE_API_URL` = your Render backend URL
   (no trailing slash), e.g. `https://crop-disease-backend.onrender.com`.
5. Deploy. Vercel will run `npm install && npm run build` automatically.
6. Go back to Render and set `ALLOWED_ORIGINS` to your new Vercel URL
   (e.g. `https://your-app.vercel.app`), then redeploy the backend so CORS
   allows requests from it.

### Post-deploy checklist
- [ ] `GET /api/health` on Render returns `database: ok`
- [ ] Register + login works from the deployed frontend
- [ ] `/api/predict` returns a real prediction (not a 503) once the model
      file is in place
- [ ] Browser devtools show no CORS errors
- [ ] All 11 pages load and fetch data without errors

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Blank white page | You opened it with Live Server. Run `npm run dev` in `frontend/` and open http://localhost:5173 |
| "Cannot reach the server" | Start the backend (`uvicorn app.main:app --reload`) and check `VITE_API_URL` in `frontend/.env` |
| `pip install` fails on tensorflow | Use Python 3.9–3.12, or install only `requirements-base.txt` |
| AI Detect says "model not available" | Put `crop_disease_model_final.keras` in `backend/ml_models/` and install TensorFlow |
| CORS error after deploying | Set `ALLOWED_ORIGINS` on Render to your exact Vercel URL |
