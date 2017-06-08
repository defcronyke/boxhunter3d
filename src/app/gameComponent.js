import {Component, ViewChild, ElementRef} from '@angular/core';
import Game from './game';

@Component({
  selector: 'fountain-app',
  template: require('./gameComponent.html')
})
export class GameComponent {
  @ViewChild('container') div:ElementRef;
  ngAfterViewInit() {
    const g = new Game(this.div.nativeElement);
    console.log(g);
  }
}
