# Ng Omar Translation

Ng Omar Translation Project

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install @ng-omar/translation as dependencies.

```bash
npm i @ng-omar/translation @ngx-translation/core ngx-date-fns date-fns
```

## Usage

for root module

app.module.ts

```ts
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@ng-omar/translation';
import { arLocale, enLocale } from './18n';

@NgModule({
  imports: [
    TranslateModule.forRoot(),

    // For Static Translations in typescript
    TranslationModule.forRoot({
      type: 'strings',
      languages: [
        { label: 'Arabic', code: 'ar', isRtl: true },
        { label: 'English', code: 'en', isRtl: false },
      ],
      strings: [arLocale, enLocale],
      defaultLanguage: 'ar',
    }),

    // For Dynamic Translations With Backend library
    TranslationModule.forRoot({
      type: 'endpoint',
      translationEndpoint: 'http://localhost:5157',
      localStorageKey: 'lang',
      defaultLanguage: 'ar',
      module: 'app',
    }),

    // For Static Translations Using Json Files
    TranslationModule.forRoot({
      type: 'folder',
      languages: [
        { label: 'Arabic', code: 'ar', isRtl: true },
        { label: 'English', code: 'en', isRtl: false },
      ],
      i18nFolderPath: '/assets/i18n',
      module: 'app',
    }),
  ],
})
export class AppModule {}
```

i18n/index.ts

```ts
import { ILocale } from '@ng-omar/translations';

export const arLocale: ILocale = {
  code: 'ar',
  strings: {
    translate_yes: 'نعم',
    translate_no: 'لا',
  },
};

export const enLocale: ILocale = {
  code: 'en',
  strings: {
    translate_yes: 'Yes',
    translate_no: 'No',
  },
};
```

for child module

there are two ways to load the translations in the child module

the first way is to use forChild for static strings

```ts
import { NgModule } from '@angular/core';
import { TranslationModule } from '@ng-omar/translation';
import { arLocale, enLocale } from './18n';

@NgModule({
  imports: [
    // For Static Translations in typescript
    TranslationModule.forChild({
      strings: [arLocale, enLocale],
    }),
  ],
})
export class ChildModule {}
```

the second way is to use resolver

```ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadTranslationsResolver } from '@ng-omar/translation';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./account/account.module').then((m) => m.AccountModule),

    // Use the resolver to insure that the translations are loaded before opening the module
    resolve: { translations: LoadTranslationsResolver },

    // by default the resolver will lock at path and use it as module name for the translations
    // but if you want to use another module name use the module property inside the data
    data: { module: 'account' },
  },

  {
    path: '',
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then((x) => x.DashboardModule),
        resolve: { translations: LoadTranslationsResolver },
      },

      {
        path: 'excellence',
        loadChildren: () => import('./excellence/excellence.module').then((x) => x.ExcellenceModule),
        resolve: { translations: LoadTranslationsResolver },
      },
    ],
  },
];
```

## Development

To run this project in development use

Clone the project

```bash
  git clone https://github.com/ng-omar/translation.git
```

Install Packages

```bash
  npm install
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Authors

- [@omar-elsayed](https://github.com/omar-elsayed97)

## Hi, I'm Omar Elsayed! 👋

I'm a full stack javascript developer...

## 🛠 Skills

Typescript, Javascript, Angular, Ionic, Nest.js, Node.js, HTML, CSS...

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Feedback

If you have any feedback, please reach out to us at challengeromar97@gmail.com
