# Simplified AWS Deployment Guide

This guide provides simple steps to deploy the application on AWS for demonstration purposes.

## Prerequisites

- AWS account with access to S3, EC2, and IAM
- Node.js installed locally
- MongoDB Atlas account (free tier is sufficient)
- Domain name (optional)

## Step 1: Set Up S3 Bucket for Media Storage

1. Log into AWS Console and navigate to S3
2. Click "Create bucket"
3. Name your bucket (e.g., "media-app-uploads-demo")
4. Uncheck "Block all public access" (for demonstration purposes)
5. Enable CORS with this configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

6. Create an IAM user with S3 access:
   - Navigate to IAM
   - Create a new user
   - Attach "AmazonS3FullAccess" policy
   - Save the Access Key ID and Secret Access Key

## Step 2: Deploy the Backend

### Option 1: Simple EC2 Deployment

1. Create an EC2 instance
   - Launch a t2.micro instance with Amazon Linux 2023
   - Configure security group to allow HTTP (80), HTTPS (443), and SSH (22)

2. SSH into your instance
   ```bash
   ssh -i your-key.pem ec2-user@your-ec2-public-ip
   ```

3. Install dependencies
   ```bash
   sudo dnf update -y
   sudo dnf install -y nodejs git
   ```

4. Clone your repository
   ```bash
   git clone https://github.com/mouryaankit2001/media-upload.git
   cd /media-upload
   ```

5. Set up environment variables
   ```bash
   cd backend
   nano .env
   ```
   Add all required environment variables

6. Install and start the application
   ```bash
   npm install
   npm start
   ```

7. (Optional) Install PM2 for production process management
   ```bash
   npm install -g pm2
   pm2 start server.js
   pm2 save
   pm2 startup
   ```

## Step 3: Deploy the Frontend

### S3 + CloudFront

1. Build your React app locally
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. Create an S3 bucket for your frontend
3. Upload the build folder contents to the S3 bucket
4. Enable static website hosting on the bucket
5. Create a CloudFront distribution pointing to the S3 bucket

## Step 4: Connect Everything

1. Update the frontend API URL to point to your backend
2. Update the CORS settings in your backend to allow requests from your frontend