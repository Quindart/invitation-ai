# Use official Python image as base
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Expose port (adjust if needed)
EXPOSE 8000

# Start the application (remove --reload for production)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
