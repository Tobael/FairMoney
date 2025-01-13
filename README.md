# FairMoney

Easily share your expenses with your friends, colleagues or any other group of your choice.

---

## Tech-Stack
### Backend
- Python3
- FastAPI
- SQLAlchemy
- SQLite3

### Frontend
- Javascript
- React
- Mui


## Folders
- **./Backend:** Application Code for Backend
- **./Frontend:** Application Code for Frontend
- **./Docs:** Documents created for IU: DLMCSPSE01_D


## How to test the application

### Frontend
- Ensure Node is installed by executing `node --version` in your shell.
- Ensure NPM is installed by executing `npm --version ` in your shell.
- Switch your working directory to ./Frontend (`cd Frontend`),
- Execute `npm ci` in your shell to install the necessary dependecies.
- Execute `npm test` in your shell to run the tests.

### Backend
- Ensure Python is installed by executing `python --version` in your shell.
- Switch your working directory to ./Backend (`cd Backend`).
- Install dependencies with `pip install -r requirements.txt`
- Switch your working directory to ./tests (`cd tests`).
- Execute the Unit and Integrationtests with `python -m pytest`


## How to run the application

### App (with Docker)
- Ensure that Docker is installed by executing `docker --version` in your shell.
- If Docker is installed, run `docker compose up`.
- The command will build the application, create Docker images and run the containers.
- The access to Backend or Frontend, check the port configuration in `./docker-compose.yml` 
  - (defaults to Backend 8003 and Frontend 8002)


### Frontend
- Ensure Node is installed by executing `node --version` in your shell.
- Ensure NPM is installed by executing `npm --version ` in your shell.
- Switch your working directory to ./Frontend (`cd Frontend`),
- Execute `npm ci` in your shell to install the necessary dependecies.
- Execute `npm run dev` in your shell to run the dev server.
- See the URL in the shell to access the dev server.

### Backend
- Ensure Python is installed by executing `python --version` in your shell.
- Switch your working directory to ./Backend (`cd Backend`).
- Install dependencies with `pip install -r requirements.txt`
- Set the env variable *DB_PATH* to determine the path to the sqlite3 file.
- Run `python main.py` in your shell.
- See the URL in the shell to access the dev server.