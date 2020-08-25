import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { apiurls } from 'src/app/api.constants';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  public cityWeather: any[] = [];
  public dailyIconLink: string = apiurls.getWeatherIcon;

  private cityWeatherBS = new BehaviorSubject(this.cityWeather);
  cityWeatherObs = this.cityWeatherBS.asObservable();

  constructor(private http: HttpClient) { }

  public nextCity(res) {
    this.cityWeatherBS.next(res);
  }

  public getCoords(city,state) {
    let cityState = city;
    //Took state out to prevent false returns. City will match alone.
    // +' ' +','+ ' '+state;
    console.log(cityState);
    let location = encodeURIComponent(cityState);
    console.log(location);
    // for lat/lon lookup --q=PLACENAME&key=b90857fd6e8641a5b7ddb41c707dc0df
    let params ={
      q: location,
      key: apiurls.getApiKeyLatLon,
      countrycode: 'us',
      no_annotations: '1',
      limit: '1',
    }
  // TODO Make work for international
    let promise = new Promise((resolve, reject) => {
      this.http.get<any>(apiurls.getLatLon, {params: params})
        .toPromise()
        .then(
          res => {
            console.log(res.results[0]);
            // results.geometry.lat --lng
            let lat = res.results[0].geometry.lat;
            let lon = res.results[0].geometry.lng;

            this.getWeather(lat,lon);
            resolve();
          },
          msg => { // Error
          reject(msg);
          }
        );
      })
      return promise;
  }

  public getWeather(gLat,gLon) {
    let params ={
      lat: gLat,
      lon: gLon,
      exclude: 'minutely,hourly',
      units: 'imperial',
      appid: apiurls.getApiKeyWeather,
    }
    let promise = new Promise((resolve, reject) => {
      this.http.get<any>(apiurls.getForecast, {params: params})
        .toPromise()
        .then(
          res => {
            console.log(res);
            this.nextCity(res);
            resolve();
          }
        );
      })
      return promise;
  }

  public getAllStates(): Observable<any> {
    return this.http.get('./assets/states_titlecase.json')
}

}
//Directions:
// - Using Angular, make a request to a free API: https://openweathermap.org/api
// - Get the 5-day forecast for a target city.
// - Let the user click to view the min, max, and mean temperatures for that city.
// - Your solution should be provided as a link to a
//Github repository with a README on how to get it up and running.
