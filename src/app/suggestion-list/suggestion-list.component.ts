import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-suggestion-list',
  templateUrl: './suggestion-list.component.html',
  styleUrls: ['./suggestion-list.component.scss']
})
export class SuggestionListComponent implements OnInit {
  @ViewChild(TemplateRef, { static: true }) menuTemplate!: TemplateRef<any>;
  @ViewChild('elementRef', { static: false }) elementRef!: ElementRef<any>;

  @Input() set inputValue(value: string) {
    if (!value) {
      this.items = this.dataSource;
      return;
    }
    this.items = this.dataSource.filter((item) => item[this.bindKeyFilter].includes(value));
  }

  @Input() dataSource: any[] = [];
  items: any[] = [];

  activeItem: any = {};
  activeItemIndex = -1;

  @Input() bindKeyFilter!: string;
  @Input() set isShowAll(value: boolean) {
    if (value) {
      this.items = this.dataSource;
      return;
    }
  }

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.items = this.dataSource;
  }

  setActiveItem(index: number): void {
    this.activeItem = this.items[index];
    this.activeItemIndex = index;
  }

  setNextItemActive() {
    const nextIndex = this.activeItemIndex + 1 <= this.items.length - 1 ? this.activeItemIndex + 1 : 0;
    this.setActiveItem(nextIndex);
  }

  setPreviousItemActive() {
    const previousIndex = this.activeItemIndex - 1 < 0 ? this.items.length - 1 : this.activeItemIndex - 1;
    this.setActiveItem(previousIndex);
  }
}
