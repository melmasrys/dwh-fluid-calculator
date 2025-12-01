# Deployment Guide

This document provides comprehensive instructions for deploying the DWH Sizing Calculator to production environments.

## Vercel Deployment (Recommended)

Vercel is the recommended platform for deploying this application due to its seamless integration with React/Next.js applications, automatic CI/CD, and generous free tier.

### Prerequisites

- A GitHub account
- A Vercel account (free tier available at https://vercel.com)
- The project pushed to a GitHub repository

### Step-by-Step Deployment

1. **Push to GitHub**
   - Create a new repository on GitHub
   - Push the project code to the repository

2. **Connect to Vercel**
   - Log in to Vercel at https://vercel.com
   - Click "New Project"
   - Select your GitHub repository
   - Vercel will automatically detect the project as a Vite application

3. **Configure Build Settings**
   - **Framework Preset**: Vite
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`

4. **Environment Variables** (if needed)
   - Add any required environment variables in the Vercel dashboard
   - For this project, no environment variables are strictly required for basic functionality

5. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application
   - Your application will be available at a URL like `https://your-project-name.vercel.app`

### Automatic CI/CD

Once deployed to Vercel, every push to your GitHub repository will automatically trigger a new deployment. This ensures your live application is always up-to-date with your latest code changes.

## Alternative Deployment Options

### Docker Deployment

You can containerize the application using Docker:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

Build and run:
```bash
docker build -t dwh-calculator .
docker run -p 3000:3000 dwh-calculator
```

### Traditional Node.js Hosting

For platforms like AWS, Azure, or DigitalOcean:

1. Build the project: `pnpm build`
2. Upload the `dist` directory to your server
3. Install Node.js on your server
4. Run: `NODE_ENV=production node dist/index.js`
5. Configure a reverse proxy (nginx/Apache) to forward requests to port 3000

## Environment Variables

The following environment variables can be configured:

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | No | `development` |
| `PORT` | Server port | No | `3000` |
| `VITE_ANALYTICS_ENDPOINT` | Analytics endpoint | No | Not set |
| `VITE_ANALYTICS_WEBSITE_ID` | Analytics website ID | No | Not set |

## Monitoring and Maintenance

### Vercel Dashboard
- Monitor deployment status and logs
- View performance metrics
- Configure custom domains
- Set up automatic deployments

### Health Checks
The application exposes a health check endpoint at `/` which returns the main HTML page. Monitor this endpoint to ensure the application is running.

## Troubleshooting

### Build Fails
- Ensure all dependencies are listed in `package.json`
- Check that the build command completes without errors locally
- Review Vercel build logs for specific error messages

### Application Crashes
- Check server logs: `NODE_ENV=production node dist/index.js`
- Ensure all required environment variables are set
- Verify that port 3000 is not in use by another process

### Performance Issues
- Enable Vercel's performance monitoring
- Consider code-splitting for large JavaScript bundles
- Optimize images and static assets

## Security Considerations

- Keep dependencies updated: `pnpm update`
- Use HTTPS (automatically handled by Vercel)
- Implement rate limiting if needed
- Validate all user inputs on the backend
- Use environment variables for sensitive data

## Rollback Procedures

### Vercel Rollback
1. Go to the Vercel dashboard
2. Navigate to your project
3. Go to the "Deployments" tab
4. Click on a previous deployment
5. Click "Promote to Production"

### Git Rollback
```bash
git revert <commit-hash>
git push origin main
```

This will automatically trigger a new deployment with the reverted code.

## Support and Resources

- Vercel Documentation: https://vercel.com/docs
- Vite Documentation: https://vitejs.dev
- React Documentation: https://react.dev
- Express.js Documentation: https://expressjs.com
