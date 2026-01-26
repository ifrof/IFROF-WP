### Build Fails
- Check build logs in Railway dashboard
- Verify all environment variables are set
- Ensure `DATABASE_URL` is correctly configured
- Railway uses Nixpacks by default; if you switch to a Dockerfile build, avoid apt-get steps or extra system packages in config, and prefer environment variables for customization
