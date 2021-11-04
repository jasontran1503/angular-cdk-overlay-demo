import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  inputControl = new FormControl('');
  dataSource = [
    { id: 1, name: '1254' },
    { id: 2, name: '7897' },
    { id: 3, name: '20544' },
    { id: 4, name: '87' },
    { id: 5, name: '78962' },
    { id: 6, name: '0054' }
  ];
  isShowAll = false;

  constructor() {}

  ngOnInit() {}

  showAll() {
    this.isShowAll = true;
  }
}
