import { Component, Host, h, Prop, Event, EventEmitter, Element, State, Watch } from '@stencil/core';

@Component({
  tag: 'index-scrollbar',
  styleUrl: 'index-scrollbar.scss',
  shadow: true,
})
export class IndexScrollbar {
  @Element() el: HTMLElement;

  //A custom alphabet to be used instead of the default alphabet. Default is 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  @Prop() alphabet: Array<string> = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
  @Watch('alphabet')
  onAlphabetChange(value) {
    if (!(Array.isArray(value) && value.every(it => typeof it === 'string'))) throw new Error('alphabet must be a string or an array of strings');
    this.checkVisibleLetters(true);
    this.visibleLetters = value;
  }

  //A custom overflow divider. Can be undefined or null if you don't want to use one. Defaults to '·'
  @Prop() overflowDivider: string | undefined | null = '·';
  @Watch('overflowDivider')
  onOverflowDividerChange(value) {
    if (!(typeof value === 'string' || value === undefined || value === null)) throw new Error('overflowDivider must be a string');
    this.checkVisibleLetters(true);
  }

  //Valid letters that are available for the user to select. default is all letters
  @Prop() validLetters: string[] = this.alphabet;
  @Watch('validLetters')
  onValidLettersChange() {
    this.checkVisibleLetters(true);
  }

  //Whether or invalid letters should be disabled (greyed out and do not magnify)
  @Prop() disableInvalidLetters: boolean = false;
  @Watch('disableInvalidLetters')
  onDisableInvalidLettersChange() {
    this.checkVisibleLetters(true);
  }

  //Whether or invalid letters should be disabled (greyed out and do not magnify)
  @Prop() prioritizeHidingInvalidLetters: boolean = false;
  @Watch('prioritizeHidingInvalidLetters')
  onPrioritizeHidingInvalidLettersChange() {
    this.checkVisibleLetters(true);
  }

  //Whether or not letters should be magnified
  @Prop() letterMagnification: boolean = true;

  //Whether or not overflow diveders should be magnified
  @Prop() magnifyDividers: boolean = false;

  //The maximum that the magnification multiplier can be. Default is 3
  @Prop() magnificationMultiplier: number = 3;
  @Watch('magnificationMultiplier')
  onMagnificationMultiplierChange() {
    console.log('onMagnificationMultiplierChange', this.magnificationMultiplier);
    this.checkVisibleLetters(true);
  }

  //Magnification curve accepts an array of numbers between 1 and 0 that represets the curve of magnification starting from magnificaiton multiplier to 1: defaults to [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1]
  @Prop() magnificationCurve: Array<number> = [1, 0.7, 0.5, 0.3, 0.1];
  @Watch('magnificationCurve')
  onMagnificationCurveChange(value) {
    if (!(Array.isArray(value) && value.every(it => typeof it === 'number' && it >= 0 && it <= 1)))
      throw new Error('magnificationCurve must be an array of numbers between 0 and 1');
  }

  //If the scrolling for touch screens in the x direction should be lenient. Default is false
  @Prop() exactX: boolean = false;

  //Whether or not letter change event is emitted on mouse hover. Default is false
  @Prop() navigateOnHover: boolean = false;

  //Percentage or number in pixels of how far apart the letters are. Defaults to 1.75%
  @Prop() letterSpacing: number | string | null = '1%';
  @Watch('letterSpacing')
  onLetterSpacingChange(value) {
    if (!(typeof value === 'number' || typeof value === 'string' || value === null)) throw new Error('letterSpacing must be a number, string or null');
    this.checkVisibleLetters(true);
  }

  //This interval can be used for fast, regular size-checks
  //Useful, if e.g. a splitter-component resizes the scroll-bar but not the window itself. Set in ms and defaults to 0 (disabled)
  @Prop() offsetSizeCheckInterval: number = 0;
  @Watch('offsetSizeCheckInterval')
  onOffsetSizeCheckIntervalChange(value: number) {
    if (this._offsetSizeCheckIntervalTimer) clearInterval(this._offsetSizeCheckIntervalTimer);
    this.offsetSizeCheckInterval = value;
    this.offsetSizeCheckInterval && ((this._offsetSizeCheckIntervalTimer = setInterval(() => this.checkVisibleLetters())), this.offsetSizeCheckInterval);
  }

  private _offsetSizeCheckIntervalTimer: any;

  @Event({
    eventName: 'letterChange',
    bubbles: true,
    composed: true,
  })
  letterChange: EventEmitter<string>;

  @Event({
    eventName: 'isActive',
    bubbles: true,
    composed: true,
  })
  isActive: EventEmitter<boolean>;

  private _lastEmittedActive = false;
  @State() _isComponentActive = false;

  scrolling: EventEmitter<boolean>;

  @State() visibleLetters: Array<string> = [];

  constructor() {}

  connectedCallback() {
    window.addEventListener('resize', this.checkVisibleLetters.bind(this));
    console.log('connectedCallback', this.alphabet);
    this.visibleLetters = this.alphabet;
  }

  componentDidLoad() {
    this.alphabetContainer.addEventListener('touchstart', ev => this.focusEvent(ev, 'touchstart'), { passive: true });
    this.alphabetContainer.addEventListener('touchmove', ev => this.focusEvent(ev, 'touchmove'), { passive: true });
    this.alphabetContainer.addEventListener('touchend', () => this.focusEnd(), { passive: true });
    this.alphabetContainer.addEventListener('mouseenter', ev => this.focusEvent(ev, 'mouseenter'), { passive: true });
    this.alphabetContainer.addEventListener('mousemove', ev => this.focusEvent(ev, 'mousemove'), { passive: true });
    this.alphabetContainer.addEventListener('mouseleave', () => this.focusEnd(), { passive: true });
    this.alphabetContainer.addEventListener('click', ev => this.focusEvent(ev, 'click'), { passive: true });
    this.alphabetContainer.addEventListener('mouseenter', () => this.focusEnd(), { passive: true });
    this.checkVisibleLetters(true);
  }

  disconnectedCallback() {
    this.alphabetContainer.removeEventListener('touchstart', ev => this.focusEvent(ev, 'touchstart'));
    this.alphabetContainer.removeEventListener('touchmove', ev => this.focusEvent(ev, 'touchmove'));
    this.alphabetContainer.removeEventListener('touchend', () => this.focusEnd());
    this.alphabetContainer.removeEventListener('mouseenter', ev => this.focusEvent(ev, 'mouseenter'));
    this.alphabetContainer.removeEventListener('mousemove', ev => this.focusEvent(ev, 'mousemove'));
    this.alphabetContainer.removeEventListener('mouseleave', () => this.focusEnd());
    this.alphabetContainer.removeEventListener('click', ev => this.focusEvent(ev, 'click'));
    window.removeEventListener('resize', this.checkVisibleLetters.bind(this));

    clearInterval(this._offsetSizeCheckIntervalTimer);
  }

  get alphabetContainer() {
    return this.el.shadowRoot.querySelector('.container');
  }

  checkVisibleLetters(force?: boolean): void {
    let height = this.alphabetContainer.clientHeight;
    if (!force && height === this._lastHeight) {
      return;
    }

    this._lastHeight = height;

    let newAlphabet = this.alphabet;
    let letterSpacing = 0;
    let letterSize = this.stringToNumber(getComputedStyle(this.alphabetContainer).getPropertyValue('font-size'));

    if (this.letterMagnification) {
      letterSize = letterSize * this.magnificationMultiplier;
    }

    //Calculate actual letter spacing
    if (typeof this.letterSpacing === 'number') {
      letterSpacing = this.letterSpacing;
    } else if (typeof this.letterSpacing === 'string') {
      letterSpacing = this.stringToNumber(this.letterSpacing);
      if (this.letterSpacing.endsWith('%')) {
        letterSpacing = height * (letterSpacing / 100);
      }
    }

    letterSize = letterSize + letterSpacing;

    //Remove invalid letters (if set and necessary)
    if (this.prioritizeHidingInvalidLetters && !!this.validLetters && height / letterSize < newAlphabet.length) {
      newAlphabet = this.validLetters;
    }

    //Check if there is enough free space for letters
    this._lettersShortened = height / letterSize < newAlphabet.length;
    if (this._lettersShortened) {
      const numHiddenLetters = newAlphabet.length - Math.floor(height / letterSize);
      if (numHiddenLetters === newAlphabet.length) newAlphabet = [];

      //determine how many letters to hide
      const hiddenHalves = this.getNumHiddenHalves(numHiddenLetters, newAlphabet.length) + 1;
      // (this.magnifyDividers || numHiddenLetters > newAlphabet.length - 2 ? 1 : 0);

      //split alphabet into two halves
      let alphabet1 = newAlphabet.slice(0, Math.ceil(newAlphabet.length / 2));
      let alphabet2 = newAlphabet.slice(Math.floor(newAlphabet.length / 2)).reverse();

      for (let i = 0; i < hiddenHalves; i++) {
        alphabet1 = alphabet1.filter((_, i) => i % 2 === 0);
        alphabet2 = alphabet2.filter((_, i) => i % 2 === 0);
      }

      //insert dots between letters
      alphabet1 = alphabet1.reduce((prev, curr, i) => {
        if (i > 0) {
          if (this.overflowDivider) prev.push(this.overflowDivider);
        }
        prev.push(curr);
        return prev;
      }, []);
      alphabet2 = alphabet2.reduce((prev, curr, i) => {
        if (i > 0) {
          if (this.overflowDivider) prev.push(this.overflowDivider);
        }
        prev.push(curr);
        return prev;
      }, []);

      if (this.alphabet.length % 2 === 0 && this.overflowDivider) alphabet1.push(this.overflowDivider);
      newAlphabet = alphabet1.concat(alphabet2.reverse());
    }

    this.visibleLetters = newAlphabet;
  }
  private _lastHeight: number;
  //Flag for determining letter under pointer
  private _lettersShortened = false;

  getNumHiddenHalves(numHiddenLetters: number, total: number) {
    if (numHiddenLetters > total / 2) {
      return 1 + this.getNumHiddenHalves(numHiddenLetters % (total / 2), Math.ceil(total / 2));
    }
    return 0;
  }

  isValid(letter: string): boolean {
    return this.validLetters?.includes(letter) !== false || letter === this.overflowDivider;
  }

  focusEvent(event: MouseEvent | TouchEvent | any, type?: string): void {
    if (!this._lastEmittedActive) {
      this.isActive.emit((this._lastEmittedActive = true));
    }

    if (type == 'click') this._isComponentActive = false;
    else this._isComponentActive = true;

    this.setLetterFromCoordinates(event.touches?.[0].clientX ?? event.clientX, event.touches?.[0].clientY ?? event.clientY);

    if (this._lastEmittedLetter !== this.letterSelected && (this.navigateOnHover || !type.includes('mouse'))) {
      this.letterChange.emit((this._lastEmittedLetter = this.letterSelected));
    }
  }
  @State() _lastEmittedLetter: string;

  focusEnd(): void {
    this.isActive.emit((this._isComponentActive = this._lastEmittedActive = false));
  }

  @State() magIndex: number;

  private setLetterFromCoordinates(x: number, y: number): void {
    if (this.exactX) {
      const rightX = this.alphabetContainer.getBoundingClientRect().right;
      const leftX = this.alphabetContainer.getBoundingClientRect().left;

      this._isComponentActive = x > leftX && x < rightX;
      if (!this._isComponentActive) {
        this.visualLetterIndex = this.visualLetterIndex = null;
        return;
      }
    }

    const height = this.alphabetContainer.clientHeight;
    //Letters drew outside the viewport or host padding may cause values outsize height boundries (Usage of min/max)
    const top = Math.min(Math.max(0, y - this.alphabetContainer.getBoundingClientRect().top), height);

    let topRelative = (top / height) * (this.visibleLetters.length - 1);
    const preferNext = Math.round(topRelative) < topRelative;
    topRelative = Math.round(topRelative);

    this.magIndex = topRelative;

    //Set visualLetterIndex to the closest valid letter
    this.visualLetterIndex = this.getClosestValidLetterIndex(this.visibleLetters, topRelative, preferNext);

    if (this._lettersShortened) {
      if (this.validLetters) {
        this.letterSelected = this.validLetters[Math.round((top / height) * (this.validLetters.length - 1))];
      } else {
        this.letterSelected = this.alphabet[this.getClosestValidLetterIndex(this.alphabet, topRelative, preferNext)];
      }
    } else {
      this.letterSelected = this.visibleLetters[this.visualLetterIndex];
    }
  }
  @State() visualLetterIndex: number;
  @State() letterSelected: string;

  private getClosestValidLetterIndex(alphabet: string[], visualLetterIndex: number, preferNext: boolean): number {
    const lowercaseAlphabet = alphabet.map(l => l.toLowerCase());
    const lowercaseValidLetters = this.validLetters.map(l => l.toLowerCase());
    const validLettersAsNumbers = lowercaseValidLetters.map(l => lowercaseAlphabet.indexOf(l));

    return validLettersAsNumbers.length > 0
      ? validLettersAsNumbers.reduce((prev, curr) =>
          preferNext
            ? Math.abs(curr - visualLetterIndex) > Math.abs(prev - visualLetterIndex)
              ? prev
              : curr
            : Math.abs(curr - visualLetterIndex) < Math.abs(prev - visualLetterIndex)
            ? curr
            : prev,
        )
      : null;
  }

  private stringToNumber(value?: string): number {
    return Number(value?.match(/[\.\d]+/)[0]);
  }

  getLetterStyle(index: number) {
    if (
      (this.magIndex === undefined && this.magIndex === null) ||
      (!this.magnifyDividers && this.visibleLetters[index] === this.overflowDivider) ||
      (this.disableInvalidLetters && !this.isValid(this.visibleLetters[index]))
    )
      return {};

    const lettersOnly = this.visibleLetters.filter(l => l !== this.overflowDivider);

    const mappedIndex = Math.round((index / this.visibleLetters.length) * lettersOnly.length);
    const mappedMagIndex = Math.round((this.magIndex / this.visibleLetters.length) * lettersOnly.length);

    let relativeIndex = this.magnifyDividers ? Math.abs(this.magIndex - index) : Math.abs(mappedMagIndex - mappedIndex);

    const magnification = relativeIndex < this.magnificationCurve.length - 1 ? this.magnificationCurve[relativeIndex] * (this.magnificationMultiplier - 1) + 1 : 1;

    const style: any = {
      transform: `scale(${magnification})`,
      zIndex: this.magIndex === index ? 1 : 0,
    };
    return this._isComponentActive && this.letterMagnification ? style : { transform: 'scale(1)', zIndex: 0 };
  }

  render() {
    return (
      <Host>
        <div
          class={{
            container: true,
          }}
        >
          {this.visibleLetters?.map((letter, i) => {
            return (
              <div
                key={`${letter}-${i}`}
                class={{
                  'letter': true,
                  'letter-disabled': this.disableInvalidLetters && !this.isValid(letter),
                }}
                style={this.getLetterStyle(i)}
                id={this.visibleLetters[i]}
              >
                <label> {letter}</label>
              </div>
            );
          })}
        </div>
      </Host>
    );
  }
}
