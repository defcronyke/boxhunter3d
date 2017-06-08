import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {routing, RootComponent} from './routes';
import {GameComponent} from './gameComponent';

import {HelloComponent} from './hello';

@NgModule({
  imports: [
    BrowserModule,
    routing
  ],
  declarations: [
    RootComponent,
    HelloComponent,
    GameComponent
  ],
  bootstrap: [RootComponent]
})
export class AppModule {}
