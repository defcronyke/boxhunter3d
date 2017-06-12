import {Component, ViewChild, ElementRef} from '@angular/core';
import Game from './game';
require('./gameComponent.scss');

@Component({
  selector: 'fountain-app',
  template: require('./gameComponent.html')
})
export class GameComponent {
  @ViewChild('container') canvas:ElementRef;
  ngAfterViewInit() {
    // console.log(this.canvas.nativeElement);
    const g = new Game(this.canvas.nativeElement);
    console.log(g);
  }
}
