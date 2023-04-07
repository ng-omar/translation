# Ng Omar Translation

Ng Omar Translation Project

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install @ng-omar/translation as dependencies.

```bash
npm i @ng-omar/translation @ngx-translation/core ngx-date-fns date-fns
```

## Usage

app.module.ts

```ts
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@ng-omar/translation';

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
      strings: [arLocale.data, enLocale.data],
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
