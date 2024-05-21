# Index Scroll Bar

This project uses the `index-scrollbar`. Here are the basics of how it works.

A very responsive, simple and customizable alphabetical scroll bar (index scrollbar) that can be used in any project as a web component.

![Alt Text](https://github.com/mooalot/alphabetical-scroll-bar/blob/main/projects/example/src/assets/alphabetical-scroll-bar.gif)

## New features

- You can now use your own custom alphabet.
- Added support for desktop (see usage for more info).
- Scroll bar now supports all screen sizes by adding dividers between the letters as the screen size gets smaller.

## Support

| Platform | Support |
| -------- | ------- |
| iOS      | Yes     |
| Android  | Yes     |
| Web      | Yes     |

## Usage

Install using npm

```
npm i index-scrollbar
```

Using the package in your project varies depending on the framework you are using. Research how to use stencil web components in your framework.

Here is the template for the component:

```
  <index-scrollbar
    [alphabet]="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')"
    [overflowDivider]="'-'"
    [validLetters]="letterGroups"
    [disableInvalidLetters]="true"
    [prioritizeHidingInvalidLetters]="true"
    [letterMagnification]="true"
    [magnifyDividers]="true"
    [magnificationMultiplier]="2"
    [magnificationCurve]="[1, .7, .6, .4, .2, 0]"
    [exactX]="false"
    [navigateOnHover]="true"
    letterSpacing="'1%'"
    [offsetSizeCheckInterval]="100"
    (letterChange)="goToLetterGroup($event)"
    (isActive)="!$event && enableScroll()"
  ></index-scrollbar>
```

| Input/Output | Parameter                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | default                                | type                        |
| ------------ | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | --------------------------- |
| Input        | alphabet                       | Custom version of the alphabet.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `ABCDEFGHIJKLMNOPQRSTUVWXYZ`.split('') | Array or                    |
| Input        | overflowDivider                | Custom divider to be used when the screen size is smaller than the scroll bar. Can be set to `undefined` or `null`.                                                                                                                                                                                                                                                                                                                                                                                                        | `·`                                    | string or undefined or null |
| Input        | validLetters                   | Array of the possible letters that are available in the scrollable content. For example, if you only have 5 different letter dividers `A`, `D`, `F`, `I`, and `R`, you would want to pass these into `validLetters`. If you did not, when you tap on `Z` in the alphabetical scroll bar, nothing will happen. If you do include `validLetters`, your view would be taken to the next closest letter, which in this case is `R`. This is not a requirement, but it will make your alphabetical scroll bar much more robust. | `ABCDEFGHIJKLMNOPQRSTUVWXYZ`           | Array                       |
| Input        | disableInvalidLetters          | Boolean that determines whether or not to disable the invalid letters. Disabled letters are greyed out and will not magnify. If you do not, the invalid letters will be shown as disabled.                                                                                                                                                                                                                                                                                                                                 | `false`                                | boolean                     |
| Input        | prioritizeHidingInvalidLetters | If true, the scroll bar will prioritize hiding invalid letters before subsituting `overflowDividers`. This is useful if you have a lot of invalid letters and you want to show the scroll bar without the invalid letters.                                                                                                                                                                                                                                                                                                 | `false`                                | boolean                     |
| Input        | letterMagnification            | This will create a magnification effect on the alphabetical scroll bar when the user touches it or hovers over it.                                                                                                                                                                                                                                                                                                                                                                                                         | `true`                                 | boolean                     |
| Input        | magnifyDividers                | This input will magnify the dividers when the user touches them or hovers over them.                                                                                                                                                                                                                                                                                                                                                                                                                                       | `false`                                | boolean                     |
| Input        | magnificationMultiplier        | How much to multiply the size of magnified letters.                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | `2`                                    | number                      |
| Input        | magnificationCurve             | This is the curve that the magnification will follow as the letters magnify. This input must range between 1 and 0. Closer to one means larger. Closer to zero means smaller. The first index determines the size of the selected letter, the following indexes determine size for neighboring letters. Play around with it to see what looks best for your application.                                                                                                                                                   | `[1, 0.7, 0.5, 0.3, 0.1]`              | Array                       |
| Input        | exactX                         | When `false`, this means the user does not have to be accurate along the x direction of the screen (after they have touched the scroll bar), meaning they can slide their finger freely along the x axis while still changing the scroll value. If set to `true`, the user will have to remain inside the scroll bar to continue navigating (I think false gives it a smoother feel).                                                                                                                                      | `false`                                | boolean                     |
| Input        | navigateOnHover                | This means that the user will have to tap on the scroll bar to navigate to a new letter. If set to `true`, the user will be able to navigate to a new letter by hovering over the scroll bar.                                                                                                                                                                                                                                                                                                                              | `false`                                | boolean                     |
| Input        | letterSpacing                  | This is the spacing between letters. It defaults to `1%`. Accepts a string with a percentage value (`1%`) or a number as a pixel value. Percentage is the percent of the scroll bar height.                                                                                                                                                                                                                                                                                                                                | `1%`                                   | string or number            |
| Input        | offsetSizeCheckInterval        | This is the interval in milliseconds that the scroll bar will check to see if the size of the scroll bar has changed. Useful, if e.g. a splitter-component resizes the scroll-bar but not the window itself.                                                                                                                                                                                                                                                                                                               | `0` (no interval)                      | number                      |
| Output       | letterChange                   | Every time the user scrolls through the alphabetical scroll bar to a new letter, this emitter will output the letter (as a `string`) that the user scrolled to. This will allow you to scroll to the appropriate letter divider. The example project above shows one method of how this function can be used. You can add things like haptics in the function this calls.                                                                                                                                                  | none                                   | none                        |
| Output       | isActive                       | EventEmitter that will emit when the user releases their finger from the scroll bar. This is used to stop any unwanted scroll glitches while the user is using the alphabetical scroll bar. See example for more information. (MOBILE ONLY)                                                                                                                                                                                                                                                                                | none                                   | none                        |

\*Also note that the `alphabetical-scroll` element must have a high z-index to be above dividers and other elements.
