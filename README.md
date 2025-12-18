# Rack Planner

Rack Planner is a web-based tool designed to help you visually plan and organize your server racks. Whether you're working with a standard 19-inch rack or a smaller 10-inch mini rack, our tool provides a simple and intuitive interface to design your setup.

## Features

- **Visual Rack Planning:** Drag and drop components into a visual representation of your rack.
- **Support for Multiple Rack Sizes:** Plan for both 19-inch and 10-inch racks.
- **Component Library:** A library of common and generic rack-mountable items is available to get you started.
- **Custom Items:** Create your own custom items for your 3D printed parts or DIY projects.
- **Work in Progress:** This is a working prototype with more features to come, including public profiles to share your rack setup with friends.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

To run this project, you will need to have the following installed on your machine:

- **Node.js:** Version 20.19.0 or higher (or 22.12.0 or higher)
- **npm:** Version 10.x or higher (or the version of npm that comes with your Node.js installation)

### Installation

1.  Clone the repository to your local machine:

    ```bash
    git clone https://github.com/plagosus/rack-planner.git
    ```

2.  Navigate to the project directory:

    ```bash
    cd rack-planner
    ```

3.  Install the dependencies:

    ```bash
    npm install
    ```

## Available Scripts

In the project directory, you can run the following commands:

### `npm run dev`

Runs the app in the development mode.
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `dist` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run lint`

Lints the project files for any code quality issues.

### `npm run preview`

Runs a local server to preview the production build. This is useful for testing the production build before deploying it.

## Docker

You can run the application using Docker, either by building it locally or pulling the pre-built image.

### Quick Start (Pre-built Image)

If you just want to run the application without downloading the source code, you can pull the image from [Docker Hub](https://hub.docker.com/repository/docker/brankko/rack-planner):

1.  Make sure you have Docker installed.
2.  Run the following command:

    ```bash
    docker run -d -p 1019:80 brankko/rack-planner:latest
    ```

    _(You can change `1019` to any port you prefer, e.g., `-p 8080:80`)_

3.  Access the application at [http://localhost:1019](http://localhost:1019).

### Running Locally (From Source)

If you have cloned the repository and want to build the Docker image yourself:

1.  Make sure you have Docker installed and running.
2.  Run the following command:

    ```bash
    docker-compose up --build -d
    ```

3.  Access the application at [http://localhost:1019](http://localhost:1019).

### Publishing

To publish the Docker image to a registry (e.g., Docker Hub), you can use the built-in script:

```bash
npm run publish:docker
```

This will build and push the image with tags `1.0.0` and `latest` to `brankko/rack-planner`. Ensure you are logged in (`docker login`) before running this.

## Accessing the Application

Once you have the development server running with `npm run dev`, you can access the application by opening your web browser and navigating to [http://localhost:5173](http://localhost:5173).
