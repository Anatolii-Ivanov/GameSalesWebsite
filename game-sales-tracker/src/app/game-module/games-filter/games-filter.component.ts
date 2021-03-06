import { Component, OnInit } from "@angular/core";
import { GameService } from "../services/game.service";
import { IGame } from "../interfaces/IGame";
import { IFilterRequest } from "../interfaces/IFilterRequest";
import { IFilterOptions, SortType } from "../interfaces/IFilterOptions";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/internal/operators";
import { CurrencySymbol } from "../interfaces/IPlatformGamePrice";
import { IPlatform } from "../interfaces/IPlatform";

@Component({
  selector: "app-games-filter",
  templateUrl: "./games-filter.component.html",
  styleUrls: ["./games-filter.component.css"],
})
export class GamesFilterComponent implements OnInit {
  games: IGame[];
  platforms: [boolean, IPlatform][];
  filterOptions: IFilterOptions;
  pageOptions: IFilterRequest;
  page: number = 1;
  gamesCountSubject: Subject<number> = new Subject<number>();
  gamesCount: number;
  filterChangedSubject: Subject<IFilterOptions> = new Subject<IFilterOptions>();

  constructor(private gameService: GameService) {
    this.filterChangedSubject.pipe(debounceTime(1000)).subscribe(() => {
      this.gameService.sendPageParams(this.pageOptions).subscribe((data) => {
        this.games = data.games;
        this.gamesCount = data.count;
        this.gamesCountSubject.next(data.count);
      });
    });
  }

  ngOnInit(): void {
    this.filterOptions = {
      GameName: "",
      Platforms: [],
      SortType: SortType.basePrice,
      AscendingOrder: true,
    };

    this.pageOptions = {
      From: 0,
      CountPerPage: 10,
      FilterOptions: this.filterOptions,
    };

    this.filterChangedSubject.next();

    this.gameService.getPlatforms().subscribe(
      (data) => {
        this.platforms = data.map((x) => [false, x]);
      },
      (error) => console.log(error)
    );
  }

  filterChanged() {
    this.filterOptions.Platforms = this.platforms
      .filter((x) => x[0])
      .map((y) => y[1].Id);
    this.filterChangedSubject.next();
  }

  pageChanged(pageCount: number) {
    this.page = pageCount;
    this.pageOptions.From = (pageCount - 1) * this.pageOptions.CountPerPage;
    this.filterChangedSubject.next();
  }

  getConvertedPrice(game: IGame): string {
    return `${(game.BestPrice / 100).toFixed(2)} ${
      CurrencySymbol[game.CurrencyId]
    }`;
  }
}
