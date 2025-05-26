# Hosting Options for Leela Analytics Website

## 1. GitHub Pages (Free)

1. Create a GitHub account if you don't have one
2. Create a new repository (e.g., `leela-analytics`)
3. Push your website files to the repository
4. Go to repository Settings > Pages
5. Select the branch to deploy (usually `main`)
6. Your site will be available at `https://yourusername.github.io/leela-analytics`

### Quick setup commands:

```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit"

# Create repository on GitHub first, then:
git remote add origin https://github.com/rassu/leela-analytics.git
git branch -M main
git push -u origin main
```

## 2. Netlify (Free tier available)

1. Sign up for a Netlify account
2. Click "New site from Git"
3. Connect to your GitHub/GitLab/Bitbucket
4. Select your repository
5. Deploy! Your site will be available at a Netlify subdomain (e.g., `leela-analytics.netlify.app`)
6. You can add a custom domain later

## 3. Vercel (Free tier available)

Similar to Netlify:
1. Sign up for a Vercel account
2. Import your Git repository
3. Configure build settings (not needed for this static site)
4. Deploy! Your site will be available at a Vercel subdomain

## 4. AWS S3 + CloudFront (Low cost)

1. Create an S3 bucket
2. Upload your website files
3. Configure the bucket for static website hosting
4. (Optional) Set up CloudFront for CDN capabilities
5. (Optional) Register a domain with Route 53

## 5. Firebase Hosting (Free tier available)

1. Create a Firebase account
2. Install Firebase CLI: `npm install -g firebase-tools`
3. Login: `firebase login`
4. Initialize project: `firebase init`
5. Select "Hosting" option
6. Deploy: `firebase deploy`

## 6. Traditional Web Hosting

Any traditional web hosting provider (Bluehost, HostGator, DreamHost, etc.) can host your static website. Simply upload your files via FTP.

## 7. Digital Ocean App Platform (Paid)

1. Create a Digital Ocean account
2. Create a new App
3. Connect to your Git repository
4. Configure as a static site
5. Deploy

## Recommended Option

For a startup website like Leela Analytics, **Netlify** or **Vercel** are highly recommended due to:
- Free tier is generous
- Easy deployment from Git
- Built-in CI/CD
- Custom domain support
- SSL certificates included
- Global CDN included
