# AppliedProject
Update the project description here

## Setting up local machine

Install Angular CLI on the machine

- `npm install -g @angular/cli`

Navigate to "app" and run the following

- `cd app`
- `npm install --force`

Navigate back to "template" and run the following to install dependencies for the template

- `cd ../template`
- `npm install`

## Run Development environment

Start angular dev env by

- `ng serve`
- open `http://localhost:4200` on your browser

start template env by 

- `ng serve --port 4201`
- open your browser on `http://localhost:4201`

sample edit, remove this line later, testing


## Improvements
### APIs

- authentication needs to be implemented
- batch APIs needs to be added to reduce the number of APIs made on scarping
- caching needs to be added where the APIs scan the entire tables for example dashboard stats, product categories
- Indexing needs to be implemented for quering data, example product history could be indexed
- cross origin validations should be done, currently its allow all

### Scraper

- Add cronjobs on AWS for schedulled scraping
- Add more stores 
- Invoke bulk insert APIs to reduce number of API calls and cost
- more automation could be added to the scappers, like comments and more interactive stats etc

### Web app

- 