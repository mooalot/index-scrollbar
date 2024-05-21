# index-scrollbar



<!-- Auto Generated Below -->


## Properties

| Property                         | Attribute                           | Description | Type               | Default                             |
| -------------------------------- | ----------------------------------- | ----------- | ------------------ | ----------------------------------- |
| `alphabet`                       | --                                  |             | `string[]`         | `[...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']` |
| `disableInvalidLetters`          | `disable-invalid-letters`           |             | `boolean`          | `false`                             |
| `exactX`                         | `exact-x`                           |             | `boolean`          | `false`                             |
| `letterMagnification`            | `letter-magnification`              |             | `boolean`          | `true`                              |
| `letterSpacing`                  | `letter-spacing`                    |             | `number \| string` | `0`                                 |
| `magnificationCurve`             | --                                  |             | `number[]`         | `[1, 0.7, 0.5, 0.3, 0.1]`           |
| `magnificationMultiplier`        | `magnification-multiplier`          |             | `number`           | `2`                                 |
| `magnifyDividers`                | `magnify-dividers`                  |             | `boolean`          | `false`                             |
| `navigateOnHover`                | `navigate-on-hover`                 |             | `boolean`          | `false`                             |
| `offsetSizeCheckInterval`        | `offset-size-check-interval`        |             | `number`           | `0`                                 |
| `overflowDivider`                | `overflow-divider`                  |             | `string`           | `'·'`                               |
| `prioritizeHidingInvalidLetters` | `prioritize-hiding-invalid-letters` |             | `boolean`          | `false`                             |
| `validLetters`                   | --                                  |             | `string[]`         | `this.alphabet`                     |


## Events

| Event          | Description | Type                   |
| -------------- | ----------- | ---------------------- |
| `isActive`     |             | `CustomEvent<boolean>` |
| `letterChange` |             | `CustomEvent<string>`  |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
