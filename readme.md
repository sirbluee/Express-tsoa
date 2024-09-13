name: CI/CD Pipeline for Service

on:
  pull_request:
    branches: [main]
    paths:
      - "src/**"
      - "configs/**"
  push:
    branches: [main]
    paths:
      - "src/**"
      - "configs/**" # Add other directories if needed

jobs:
  build:
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: ./ # Set to the root directory of your project

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: yarn install

      - name: Run build
        run: yarn build

      - name: Run tests
        env:
          PORT: ${{ secrets.PORT }}
          NODE_ENV: ${{ secrets.NODE_ENV }}
          MONGODB_URL: ${{ secrets.MONGODB_URL }}
        run: yarn test # Running tests with Jest and TypeScript support

      - name: Archive build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-artifacts
          path: ./build # Ensure the build output directory is correct and exists

  # Deployment step
  deploy:
    runs-on: ubuntu-latest
    needs: build # Ensure the deploy job only runs after the build job completes successfully
    if: github.ref == 'refs/heads/main' # Ensure deploy runs only when pushed to main branch

    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v4 # Downloads artifacts from the build job
        with:
          name: build-artifacts # The name of the artifact from the build job
          path: ./artifacts # The path where the artifacts will be downloaded

      - name: Prepare Deployment Directories
        uses: appleboy/ssh-action@master # SSH into the server to prepare directories
        with:
          host: ${{ secrets.SERVER_IP }}
          username: ${{ secrets.SERVER_USERNAME }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          port: 22
          script: |
            mkdir -p /home/ubuntu/apps/build  # Create the necessary directories on the server
            mkdir -p /home/ubuntu/apps/build/configs  # Additional configuration directories

      - name: Copy files to Server
        uses: appleboy/scp-action@master # Copy build artifacts to the server using SCP
        with:
          host: ${{ secrets.SERVER_IP }}
          username: ${{ secrets.SERVER_USERNAME }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          port: 22
          source: "./artifacts/*"
          target: "/home/ubuntu/apps/build"
          strip_components: 1 # Adjust based on the directory depth of the source

      - name: Create .env File
        uses: appleboy/ssh-action@master # Create the environment variables on the server
        with:
          host: ${{ secrets.SERVER_IP }}
          username: ${{ secrets.SERVER_USERNAME }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          port: 22
          script: |
            echo "NODE_ENV=production" > /home/ubuntu/apps/build/.env
            echo "PORT=${{ secrets.PORT }}" >> /home/ubuntu/apps/build/.env
            echo "MONGODB_URL=${{ secrets.MONGODB_URL }}" >> /home/ubuntu/apps/build/.env

      - name: Install Dependencies and Restart Application
        uses: appleboy/ssh-action@master # SSH into the server, install dependencies, and restart the application
        with:
          host: ${{ secrets.SERVER_IP }}
          username: ${{ secrets.SERVER_USERNAME }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          port: 22
          script: |
            cd /home/ubuntu/apps/build
            yarn install --production
            if pm2 show your-service-name > /dev/null; then
              echo "Application is running. Restarting..."
              pm2 restart your-service-name
            else
              echo "Application is not running. Starting..."
              pm2 start your-service-name
            fi
