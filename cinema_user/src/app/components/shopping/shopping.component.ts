import { Component, OnInit } from '@angular/core';

import { RssService } from 'src/app/services/rss.service';
@Component({
  styleUrls: ['./shopping.component.css'],
  templateUrl: './shopping.component.html',
})
export class ShoppingComponent implements OnInit{
  feedItems: any[] = [];
  pagedItems: any[] = [];
  pageSize: number = 5; // Số lượng bài viết trên mỗi trang
  currentPage: number = 1;
  constructor(private rssService: RssService) {}

  ngOnInit(): void {
    this.rssService.getFeed('https://vtcnews.vn/rss/gioi-tre.rss')
    .subscribe(data => {
      this.feedItems = data;
      this.setPage(1);
    });
  }
  setPage(page: number) {
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedItems = this.feedItems.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.feedItems.length / this.pageSize);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.setPage(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.setPage(this.currentPage + 1);
    }
  }
}