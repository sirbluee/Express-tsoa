name: CI/CD Pipeline for Service

on:
  pull_request:
    branches: [main] # Specify branches as needed
  push:
    branches: [main] # Specify branches as needed

jobs:
  build:
    runs-on: ubuntu-latest # Specifies the environment to run the job
    defaults:
      run:
        working-directory: "." # Adjust this to the root directory of your Node.js project

    steps:
      - name: Checkout code
        uses: actions/checkout@v4 # Checks out your repository under $GITHUB_WORKSPACE

      - name: Set up Node.js
        uses: actions/setup-node@v4 # Sets up the Node.js environment
        with:
          node-version: "20" # Specify the Node.js version you require

      - name: Install dependencies
        run: yarn install # Install dependencies

      - name: Run build
        run: yarn build # Build your project

      - name: Archive build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build
          path: ./build # Specify where your build outputs

  deploy:
    runs-on: ubuntu-latest
    needs: build # This job depends on the build job
    if: github.ref == 'refs/heads/main' # Run only on the main branch

    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: build # Download the build artifact
          path: ./build # Download to the build directory

      - name: Prepare Deployment Directories
        uses: appleboy/ssh-action@master # SSH into the server
        with:
          host: ${{ secrets.SERVER_IP }} # Server IP from GitHub secrets
          username: ${{ secrets.SERVER_USERNAME }} # Server username from secrets
          key: ${{ secrets.SSH_PRIVATE_KEY }} # SSH private key from secrets
          port: 22 # Default SSH port
          script: |
            mkdir -p /home/ubuntu/apps/build
            mkdir -p /home/ubuntu/apps/build/configs
          debug: true # Enable debug to troubleshoot SSH issues

      - name: Copy files to Server
        uses: appleboy/scp-action@master # SCP to copy build files to the server
        with:
          host: ${{ secrets.SERVER_IP }}
          username: ${{ secrets.SERVER_USERNAME }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          port: 22
          source: "./build/*"
          target: "/home/ubuntu/apps/build"
          strip_components: 1 # Adjust based on the directory structure

      - name: Create .env File
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_IP }}
          username: ${{ secrets.SERVER_USERNAME }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          port: 22
          script: |
            echo "NODE_ENV=production" > /home/ubuntu/apps/build/configs/.env.production
            echo "PORT=${{ secrets.PORT }}" >> /home/ubuntu/apps/build/configs/.env.production
            echo "MONGODB_URL=${{ secrets.MONGODB_URL }}" >> /home/ubuntu/apps/build/configs/.env.production
          debug: true # Debug enabled for troubleshooting

      - name: Install Dependencies and Restart Application
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_IP }}
          username: ${{ secrets.SERVER_USERNAME }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          port: 22
          script: |
            # Load the environment for non-interactive shells
            source /home/ubuntu/.nvm/nvm.sh
            source /home/ubuntu/.profile

            cd /home/ubuntu/apps/build
            yarn install --production

            # Check if the PM2 process is running, otherwise start it
            if pm2 show product-service > /dev/null; then
              echo "Application is running. Restarting..."
              pm2 restart product-service
            else
              echo "Application is not running. Starting..."
              pm2 start product-service
            fi
          debug: true # Enable debug for SSH action
