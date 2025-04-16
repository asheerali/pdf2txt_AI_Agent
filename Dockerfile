# Stage 1: Build the React frontend
FROM node:16 AS frontend-builder

# Set working directory for React app
WORKDIR /app/frontend

# Install dependencies and build the React app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the FastAPI backend
FROM python:3.9-slim AS backend-builder

# Set working directory for FastAPI app
WORKDIR /app/backend

# Install backend dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy FastAPI app code
COPY backend/ ./

# Stage 3: Final image with both frontend and backend
FROM python:3.9-slim

# Set working directory for backend
WORKDIR /app

# Install dependencies for serving FastAPI and Nginx (for serving React)
RUN apt-get update && \
    apt-get install -y nginx && \
    pip install --no-cache-dir fastapi uvicorn

# Copy React app build output to the backend container
COPY --from=frontend-builder /app/frontend/build /app/frontend/build

# Copy FastAPI app to the backend container
COPY --from=backend-builder /app/backend /app/backend

# Set up Nginx to serve the React frontend
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the ports for FastAPI and Nginx
EXPOSE 80 8000 3000

# Start both FastAPI (Uvicorn) and Nginx
CMD ["sh", "-c", "service nginx start && uvicorn backend.main:app --host 0.0.0.0 --port 8000"]
