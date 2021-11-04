import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.scss']
})
export class ListItemsComponent implements OnInit {
  @Input() set inputValue(value: string) {
    if (!value) {
      this.items = this.dataSource;
      return;
    }
    this.items = this.dataSource.filter((item) => item[this.bindKeyFilter].includes(value));
  }

  @Input() dataSource: any[] = [];
  items: any[] = [];

  @Input() bindKeyFilter!: string;

  constructor() {}

  ngOnInit(): void {
    this.items = this.dataSource;
  }
}
