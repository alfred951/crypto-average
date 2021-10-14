# crypto-average
 A server for cryptocurrency price observation, powered by BinanceAPI

## Description

Built using [NestJS](https://typeorm.io/#/) and [Docker](https://docs.docker.com/engine/reference/commandline/compose/) with the following integrations:
  ORM: [TypeORM](https://typeorm.io/#/)
  Database: [MongoDB](https://www.mongodb.com)
  Documentation: [Compodoc](https://compodoc.app/)
  Linter: [EsLint](https://eslint.org/)
  HTTP Client: [Axios](https://axios-http.com/docs/intro)
  HTTP Mocking (for tests): [Nock](https://www.npmjs.com/package/nock)

## Documentation

```bash
# build and deploy
$ npm run docs

# access
$ localhost:8080
```

## Installation

```bash
# development
$ docker-compose build dev

# production
$ docker-compose build prod
```

## Running the app

```bash
# development
$ docker-compose up dev

# production mode
$ docker-compose up prod
```
The app runs in port `3000`

## Usage

Example API calls:

Post: `localhost:3000/pairs`
```json
{
    "symbol":"ADAUSDT"
}
```

Get: `localhost:3000/pairs`

Post: `localhost:3000/lecture`
```json
{
    "symbol":"USDETH",
    "lecture": 50
}
```

Get: `localhost:3000/average?symbol=USDETH&lectures=5`

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Credits

- Author - [Luis Gallego](https://www.linkedin.com/in/luis-alfredo-gallego-94b078143/)
