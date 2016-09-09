import {Component, ViewChild, provide, PLATFORM_DIRECTIVES} from '@angular/core';
import { Http } from '@angular/http';
import {ionicBootstrap, Platform, MenuController, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {ProfilePage} from './pages/profile/profile';
import {FilmsPage} from './pages/films/films';
import {TabsPage} from './pages/tabs/tabs';
import {AuthHttp, AuthConfig} from 'angular2-jwt';
import { ClientSelectComponent } from './components/client-select.component';

import { AppStore, createAppStoreFactoryWithOptions } from "angular2-redux";
import reducers from "./reducers/app-reducer";
import {FilmActions} from "./actions/film-actions";
import { CounterActions } from "./actions/counter-actions";

import { AuthService } from './services/auth/auth';

const appStoreFactory = createAppStoreFactoryWithOptions({
  reducers,
  debug:true
});

@Component({
  templateUrl: 'build/app.html',
  directives: [ClientSelectComponent]
})
export class MyApp {
  @ViewChild('myNav') nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage: any;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public service: AuthService
  ) {

    this.initializeAuthGuard();
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  initializeAuthGuard() {
    if(this.service.authenticated()) {
      this.rootPage = TabsPage;
    } else {
      this.rootPage = ProfilePage;
    }
  }
  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}

ionicBootstrap(MyApp, [
  AuthService,
  provide(AppStore, { useFactory: appStoreFactory }),
  FilmActions,
  CounterActions,
  provide(AuthHttp, {
    useFactory: (http) => {
      return new AuthHttp(new AuthConfig, http);
    },
    deps: [Http]
  }),
  provide(PLATFORM_DIRECTIVES, {useValue: [ClientSelectComponent], multi: true})
]);

