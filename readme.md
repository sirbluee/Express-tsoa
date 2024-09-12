"dev1": "ts-node src/server.ts",
"dev": "yarn tsoa:gen && nodemon src/server.ts",
"tsoa:gen": "tsoa spec && tsoa routes",
"build": "node build-script.js",
"start:local": "yarn tsoa:gen && nodemon ./build/server.js"

    <!-- deploy pipline -->
    deploy:
    runs-on: ubuntu-latest # Specifies that the job should run on the latest Ubuntu virtual environment provided by GitHub
    needs: build # Specifies that this job needs the 'build' job to complete successfully before it starts
    if: github.ref == 'refs/heads/main' # This job runs only if the push or PR merge is to the 'main' branch

    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v4 # Downloads artifacts from the build job
        with:
          name: build # The name of the artifact to download
          path: ./path/to/artifacts # The path to store the downloaded artifact

      - name: Prepare Deployment Directories
        uses: appleboy/ssh-action@master # SSH into the server to prepare directories
        with:
          host: ${{ secrets.SERVER_IP }} # Server IP address from secrets
          username: ${{ secrets.SERVER_USERNAME }} # Server username from secrets
          key: ${{ secrets.SSH_PRIVATE_KEY }} # SSH private key from secrets
          port: 22 # SSH port, usually 22
          script: |
            mkdir -p /home/ubuntu/apps/build  # Change to match your desired directory structure
            mkdir -p /home/ubuntu/apps/build/configs  # For additional configuration files

      - name: Copy files to Server
        uses: appleboy/scp-action@master # Copies files to the server using SCP
        with:
          host: ${{ secrets.SERVER_IP }}
          username: ${{ secrets.SERVER_USERNAME }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          port: 22
          source: "./path/to/artifacts/*"
          target: "/home/ubuntu/apps/build"
          strip_components: 1 # Adjust based on the directory depth of the source

      - name: Create .env File
        uses: appleboy/ssh-action@master # Creates an environment variable file on the server
        with:
          host: ${{ secrets.SERVER_IP }}
          username: ${{ secrets.SERVER_USERNAME }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          port: 22
          script: |
            echo "NODE_ENV=production" > /home/ubuntu/apps/build/.env
            echo "PORT=your_port_number" >> /home/ubuntu/apps/build/.env
            echo "DATABASE_URL=your_database_url" >> /home/ubuntu/apps/build/.env

      - name: Install Dependencies and Restart Application
        uses: appleboy/ssh-action@master # Installs dependencies and restarts the application using a process manager
        with:
          host: ${{ secrets.SERVER_IP }}
          username: ${{ secrets.SERVER_USERNAME }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          port: 22
          script: |
            cd /home/ubuntu/apps/build
            yarn install --production
            # Assume PM2 is used. Replace with other command if using another process manager
            if pm2 show your-service-name > /dev/null; then
              echo "Application is running. Restarting..."
              yarn restart
            else
              echo "Application is not running. Starting..."
              yarn start
