# DC Bikeshare Bikes per Neighborhood

https://www.alexandraulsh.com/dc-bikeshare-by-neighborhood

A map that lets you analyze and explore the number of DC bikeshare bikes by DC neighborhood clusters.

![Screenshot of dc-bikeshare-by-neighborhood map](assets/map-full.png)

## How do I view the data?

Mouse over different neighborhoods to see how many bikes for that bikeshare service are in that neighborhood cluster.

![Neighborhood mouseover popup with number of bikeshare bikes](assets/mouseover.png)

## Data

### DC Neighborhood Cluster Polygons

DC neighborhood clusters come from the District of Columbia's Office of the Chief Technology Officer's [DC Open Data Portal](http://opendata.dc.gov/datasets/neighborhood-clusters). Note: the government of D.C. does not provide official neighborhood polygons. These are instead "neighborhood clusters."

Neighborhoods no longer loading? Did the URL change or break? [Please create a new issue to report this bug](https://github.com/alulsh/dc-bikeshare-by-neighborhood/issues/new).

### Current bikeshare services

#### Capital Bikeshare

Station capacity information comes from [Motivate's](https://www.motivateco.com/use-our-data/) [General Bikeshare Feed Specification](https://gbfs.capitalbikeshare.com/gbfs/gbfs.json) JSON API for Capital Bikeshare.

#### JUMP Bikes

JUMP bike data for DC is available in [GBFS format](https://github.com/NABSA/gbfs) from [`https://gbfs.uber.com/v1/dcb/free_bike_status.json`](https://gbfs.uber.com/v1/dcb/free_bike_status.json). Unfortunately this API does not allow for cross-origin resource sharing, so it cannot be used client-side. Follow [issue #7](https://github.com/alulsh/dc-bikeshare-by-neighborhood/issues/7) for any updates. In the mean time, you can use the script in `scripts/jump.js` to fetch the data manually using Node.js.

### Historical bikeshare services

Most dockless pedal bike operations left Washington, D.C. in [summer 2018](https://ggwash.org/view/69307/who-killed-dcs-dockless-pedal-bicycles)

#### Spin

Spin ended its dockless bike program and switched to electric scooters in [August 2018](https://dc.curbed.com/2018/8/20/17761122/dc-dockless-bikes-scooters-transportation-spin-pilot).

This February 6th, 2018 tweet from [DDOT](https://twitter.com/DDOTDC/status/960885112731832320), mentioned the former Spin API information was available at https://web.spin.pm/api/gbfs/v1/gbfs in GBFS format.

#### Lime

Lime ended its dockless bike program and switched to electric scooters in [August 2018](https://dc.curbed.com/2018/8/31/17806012/dc-dockless-bikes-scooters-lime-pilot-program).

Per this February 6th, 2018 tweet from [DDOT](https://twitter.com/DDOTDC/status/960885111066636289), Lime bike information was available at `https://lime.bike/api/partners/v1/bikes?region=Washington%20DC%20Proper` with a bearer token. The data is not available in GBFS format.

Unfortunately this endpoint had no `Access-Control-Allow-Origin` header. You received the following CORS error when attempting to access this endpoint via client-side JavaScript:

`Failed to load https://lime.bike/api/partners/v1/bikes?region=Washington%20DC%20Proper: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:5000' is therefore not allowed access. The response had HTTP status code 404.`

#### Mobike

Mobike left the DC market in [July 2018](https://www.washingtonpost.com/news/dr-gridlock/wp/2018/07/25/mobike-becomes-second-dockless-bike-operator-to-pull-out-of-d-c/). They never provided an official public API. [There was an endpoint you could submit a POST request to](https://github.com/ubahnverleih/WoBike#mobike-china-italy-uk-japan), but it did not seem to be designed or intended for public use. You needed to set the `Referer` and `user-agent` headers to match a WeChat client.

#### Ofo

Ofo left the DC market in [July 2018](https://www.washingtonpost.com/news/dr-gridlock/wp/2018/07/24/dockless-bike-share-company-ofo-is-the-first-to-pull-out-of-d-c/). Ofo did not provide an API that could be securely used with client side JavaScript. [Their main API required authentication with an OTP code and authorization token](https://github.com/ubahnverleih/WoBike/blob/master/Ofo.md).

[DDOT DC provided an API endpoint](https://twitter.com/DDOTDC/status/963143987216314368) but it was HTTP only. It also could not be used securely client side.

## Local development

Want to run this project locally? If you have Node and npm installed then run the following commands:

```sh
git clone git@github.com:alulsh/dc-bikeshare-by-neighborhood.git
cd dc-bikeshare-by-neighborhood
npm install
npm start
```

Don't use Node and npm? You can still run this project locally by running `index.html` with any local web server.

## Tests

This project doesn't have unit tests but does use [eslint](https://eslint.org/) for linting. Linting tests run automatically after every commit with Travis CI.

## Scripts

The `scripts` directory of this project has Node.js scripts to fetch data from the various bikeshare services in Washington, D.C. These scripts are useful for debugging or obtaining data unavailable with client side JavaScript (e.g. LimeBike).

## Contributing

Notice a bug in the project? Did one of the missing bikeshare services recently implement a public API? [Create a new issue in this repository](https://github.com/alulsh/dc-bikeshare-by-neighborhood/issues/new) to help me out!