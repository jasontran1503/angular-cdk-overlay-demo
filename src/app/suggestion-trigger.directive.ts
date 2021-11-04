import { hasModifierKey } from '@angular/cdk/keycodes';
import {
  ConnectionPositionPair,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Directive, ElementRef, Input, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { merge, Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { POSITION_MAP } from './connection-position-pair';
import { SuggestionListComponent } from './suggestion-list/suggestion-list.component';

@Directive({
  selector: '[appSuggestionTrigger]',
  host: {
    autocomplete: 'off',
    'aria-autocomplete': 'list',
    '(focusin)': 'handleFocus()',
    '(blur)': 'handleBlur()',
    '(keydown)': 'handleKeydown($event)'
  }
})
export class SuggestionTriggerDirective {
  @Input() appSuggestionTrigger!: SuggestionListComponent;

  private menuState = MenuState.closed;
  private portal!: TemplatePortal;
  private positions: ConnectionPositionPair[] = [POSITION_MAP.bottomLeft, POSITION_MAP.topLeft];
  private overlayRef!: OverlayRef;
  private subscription = Subscription.EMPTY;
  private readonly click$ = new Subject<boolean>();

  constructor(
    private el: ElementRef,
    private overlay: Overlay,
    private vcr: ViewContainerRef,
    private ngControl: NgControl
  ) {}
  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initialize();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  handleFocus(): void {
    if (!this.appSuggestionTrigger) {
      return;
    }
    this.click$.next(true);
  }

  handleBlur(): void {
    this.click$.next(false);
  }

  handleKeydown(event: KeyboardEvent) {
    const key = event.key;
    if (key === KeyBoardValue.DOWN_ARROW) {
      this.appSuggestionTrigger.setNextItemActive();
      this.scrollPosition(this.appSuggestionTrigger.activeItemIndex);
    } else if (key === KeyBoardValue.UP_ARROW) {
      this.appSuggestionTrigger.setPreviousItemActive();
      this.scrollPosition(this.appSuggestionTrigger.activeItemIndex);
    } else if (key === KeyBoardValue.ENTER) {
      this.click$.next(false);
      this.ngControl.control?.setValue(this.appSuggestionTrigger.activeItem.name);
    }
  }

  private scrollPosition(index: number) {
    const panel = this.appSuggestionTrigger.elementRef;
    if (index === 0) {
      panel.nativeElement.scrollTop = 0;
    } else {
      panel.nativeElement.scrollTop = 30 * index + 30 - Math.ceil(150 / 2);
    }
  }

  openMenu() {
    if (this.menuState === MenuState.opened) {
      return;
    }
    const overlayConfig = this.getOverlayConfig();
    this.setOverlayPosition(overlayConfig.positionStrategy as FlexibleConnectedPositionStrategy);
    const overlayRef = this.overlay.create(overlayConfig);

    overlayRef.attach(this.getPortal());
    this.subscribeOverlayEvent(overlayRef);
    this.overlayRef = overlayRef;
    this.menuState = MenuState.opened;
  }

  closeMenu() {
    if (this.menuState === MenuState.opened) {
      this.overlayRef?.detach();
      this.menuState = MenuState.closed;
    }
  }

  private initialize() {
    /*  ---true---false----
     *  ---------------true----false
     */
    const handle$ = this.click$;
    handle$.pipe().subscribe((value) => {
      if (value) {
        this.openMenu();
        return;
      }
      this.closeMenu();
    });
  }

  private getOverlayConfig(): OverlayConfig {
    const positionStrategy = this.overlay.position().flexibleConnectedTo(this.el);
    return new OverlayConfig({
      positionStrategy,
      minWidth: '200px',
      backdropClass: 'pt-menu-backdrop',
      panelClass: 'pt-menu-panel',
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });
  }

  private setOverlayPosition(positionStrategy: FlexibleConnectedPositionStrategy) {
    positionStrategy.withPositions([...this.positions]);
  }

  private getPortal(): TemplatePortal {
    if (!this.portal || this.portal.templateRef !== this.appSuggestionTrigger.menuTemplate) {
      this.portal = new TemplatePortal<any>(this.appSuggestionTrigger.menuTemplate, this.vcr);
    }
    return this.portal;
  }

  private subscribeOverlayEvent(overlayRef: OverlayRef) {
    this.subscription.unsubscribe();
    this.subscription = merge(
      overlayRef.backdropClick(),
      overlayRef.detachments(),
      overlayRef.keydownEvents().pipe(filter((event) => event.key === KeyBoardValue.ESCAPE && !hasModifierKey(event)))
    ).subscribe(() => {
      this.closeMenu();
    });
  }
}

enum MenuState {
  closed = 'closed',
  opened = 'opened'
}

enum KeyBoardValue {
  DOWN_ARROW = 'ArrowDown',
  ENTER = 'Enter',
  ESCAPE = 'Escape',
  TAB = 'Tab',
  UP_ARROW = 'ArrowUp'
}
