type GridFilterValue<T> = {
  type: GridFilterTypeEnum;
  filter: Extract<T, string | number>;
  filterTo?: Extract<T, string | number>;
};

type GridFilterSetValues<T> = {
  values: T[];
};


enum GridFilterTypeEnum {
  GREATER_THAN = 'greaterThan',
  LESS_THAN = 'lessThan',
  //other filters
}


type FilmAdditionalFilters = {
  year?: GridFilterValue<number>;
  rating?: GridFilterValue<number>;
  awards?: GridFilterSetValues<string>;
};


interface Film {
  name: string;
  year: number;
  rating: number;
  awards: string[];
  category: CategoryName;
}

interface ListState<Item, Additional = Record<string, never>> {
  items: readonly Item[];
  filters: {
    searchValue: string;
    additional: Additional;
  };
  applySearchValue(value: string): void;
  getFilteredItems(): Item[];
}



type CategoryName = "Action" | "Thriller" | "Mystery";

const filmsList = {
  items: [
    { name: "The Transporter",   year: 2002, rating: 6.8, awards: [], category: "Action"   },
    { name: "Now You See Me",    year: 2013, rating: 7.2, awards: [], category: "Mystery" },
    { name: "The Da Vinci Code", year: 2006, rating: 6.6, awards: [], category: "Mystery" },
  ] as const,

  filters: {
    searchValue: '',
    additional: {} as FilmAdditionalFilters,
  },

applySearchValue(value: string | number) {
    if (typeof value === 'string') {
      this.filters.searchValue = value.trim().toLowerCase();
    } else {
      this.filters.additional.year = {
        type: GridFilterTypeEnum.LESS_THAN,
        filter: value,
      };
    }
  },

getFilteredItems() {
  const search = this.filters.searchValue.trim().toLowerCase();

  return this.items.filter((film: Film) => {
    if (search && !film.name.toLowerCase().includes(search)) {
      return false;
    }

    const y = this.filters.additional.year;
    if (y) {
      if (y.type === GridFilterTypeEnum.GREATER_THAN && film.year <= y.filter) return false;
      if (y.type === GridFilterTypeEnum.LESS_THAN && film.year >= y.filter) return false;
    }

    return true;
    });
  },
} satisfies ListState<Film, FilmAdditionalFilters>;

let selectedCategory: CategoryName | null = null;


function selectCategory(name: CategoryName | null) {
  selectedCategory = name;
}


function getFilmsBySelectedCategory(): readonly Film[] {
  if (!selectedCategory) return [];

  return filmsList.items.filter((film: Film) =>
    film.category === selectedCategory
  );
}




filmsList.applySearchValue("da vinci");
//filmsList.applySearchValue(2010);
selectCategory("Mystery");

console.log("Searched film/s:", filmsList.getFilteredItems());
console.log("Category:", getFilmsBySelectedCategory());