import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms'


interface State {
  name: string;
  abbreviation: string;
}

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {
  myForm: FormGroup;
  selectedLocation: string;
  cityData: any;
  states: State[]=[];
  currently: any;
  run: boolean = false;
  showMin: any[]=[];
  showMax: any[]=[];
  showMean: any[]=[];

  constructor(private ws: WeatherService, private fb: FormBuilder) {
        // setup form
        this.myForm = this.fb.group({
          city: new FormControl(null, Validators.required),
          // state: new FormControl(null, Validators.required),
        });
  }

  ngOnInit() {
    //subscribe to states
    this.ws.getAllStates().subscribe((data:any) => {
      console.log(data);
      this.states = data;
    });

    // subscribe to city
    this.ws.cityWeatherObs.subscribe(data => {
      if (data && this.run) {
        this.cityData = data;
        console.log(this.cityData.current);
        this.currently = this.cityData.current;
      }else {
        console.log("No weather data at this time");
      }
    })
  }
  //call on button click
  public cityLookup() {
    if (this.myForm.value.city) {
      let formCity = this.myForm.value.city;
      let formState = this.myForm.value.state;
      this.selectedLocation = formCity;
        // +' ' +','+ ' '+formState;
      console.log(this.selectedLocation);
      this.ws.getCoords(formCity,formState);
      this.run = true;
    }
  }

}
