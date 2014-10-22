![angular-input-hints](angular-input-hints.gif)

*Animates input placeholders to make it look like they are being typed in realtime.*

## Dependencies
- [angular](https://github.com/angular/angular.js) >=1.2

## Install
### Bower
```bash
$ bower install angular-input-hints --save
```
### Download
[Minified version - 2.89 KB](https://github.com/williamboman/angular-input-hints/releases/download/v1.0.0/angular-input-hints.min.js)

[Regular version - 5.08 KB](https://github.com/williamboman/angular-input-hints/releases/download/v1.0.0/angular-input-hints.js)

Then simply just include the JavaScript file in your document!

## Usage
To use this Angular module, add `wb.inputHints` as a dependency in your Angular module.
```js
angular.module('yourApp', [..., 'wb.inputHints']);
```
To actually use it;
```html
<input input-hints="Your first placeholder!|Your second placeholder.|And so on..">
```

**Of course, you can add any other attribute to the input elements as you would do normally.**
### Configuration
The default config values are;
- `waitBeforeDeleteMs` - 2000 ms

 The amount of milliseconds to wait before starting to delete the placeholder (the amount of time the placeholder is fully readable).
- `waitInBetweenMs` - 300 ms

  Amount of milliseconds to wait before starting to print the next placeholder.

- `writeSpeedMs` - 100 ms

  The absolute slowest speed to wait between printing characters (characters are printed at random intervals that span from 0 ms to whatever this config value is set to).

- `deleteSpeedMs` - 60 ms

  Same as `writeSpeedMs` (see above), but for when deleting characters.


####There are 2 ways of changing these config values.

You can change these configuration values either specifically for just one element, or across the whole application.

To change these values for just one element, you can do like this;
```html
<input type="text"
  input-hints="Lorem Ipsum.."
  wait-before-deleting="2000"
  wait-in-between="300"
  write-speed="100"
  delete-speed="60">
```

To change the default config values permanently, you can utilize the `inputHintsProvider` in an Angular config-block, like so;
```js
angular.module('yourApp',  [..., 'wb.inputHints'])
  // Immediately after registering your Angular module, change the config values.
  .config(function (inputHintsProvider) {
    inputHintsProvider.config.waitBeforeDeleteMs = 2000;
    inputHintsProvider.config.waitInBetweenMs = 300;
    inputHintsProvider.config.writeSpeedMs = 100;
    inputHintsProvider.config.deleteSpeedMs = 60;
  });
```


## License
Licensed under the MIT license.

## Authors
**William Boman** <william@redwill.se>
