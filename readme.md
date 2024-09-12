"dev1": "ts-node src/server.ts",
    "dev": "yarn tsoa:gen && nodemon src/server.ts",
    "tsoa:gen": "tsoa spec && tsoa routes",
    "build": "node build-script.js",
    "start:local": "yarn tsoa:gen && nodemon ./build/server.js"