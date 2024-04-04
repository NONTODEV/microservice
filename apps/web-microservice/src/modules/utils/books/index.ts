import { ESortBooksQuery } from '../../books/dto/books-query.dto';
import { CategoryEnum } from './enum/category.enum';

export class BooksCategoryUtil {
  static getQueryByCategory(key: string, query?: Record<string, any>) {
    if (key === CategoryEnum.ALL) {
      return { ...query };
    }

    if (key === CategoryEnum.ACTION) {
      return { ...query, category: CategoryEnum.ACTION };
    }

    if (key === CategoryEnum.ADVENTURE) {
      return { ...query, category: CategoryEnum.ADVENTURE };
    }

    if (key === CategoryEnum.ALTERNATE_HISTORY) {
      return { ...query, category: CategoryEnum.ALTERNATE_HISTORY };
    }

    if (key === CategoryEnum.ANTHOLOGY) {
      return { ...query, category: CategoryEnum.ANTHOLOGY };
    }

    if (key === CategoryEnum.CHILDERN) {
      return { ...query, category: CategoryEnum.CHILDERN };
    }

    if (key === CategoryEnum.CLASSIC) {
      return { ...query, category: CategoryEnum.CLASSIC };
    }

    if (key === CategoryEnum.COMIC_BOOK) {
      return { ...query, category: CategoryEnum.COMIC_BOOK };
    }

    if (key === CategoryEnum.DRAMA) {
      return { ...query, category: CategoryEnum.DRAMA };
    }

    if (key === CategoryEnum.FAIRYTALE) {
      return { ...query, category: CategoryEnum.FAIRYTALE };
    }

    if (key === CategoryEnum.FANTASY) {
      return { ...query, category: CategoryEnum.FANTASY };
    }

    if (key === CategoryEnum.HORROR) {
      return { ...query, category: CategoryEnum.HORROR };
    }

    if (key === CategoryEnum.MYSTERY) {
      return { ...query, category: CategoryEnum.MYSTERY };
    }

    if (key === CategoryEnum.PICTURE_BOOK) {
      return { ...query, category: CategoryEnum.PICTURE_BOOK };
    }

    if (key === CategoryEnum.ROMANCE) {
      return { ...query, category: CategoryEnum.ROMANCE };
    }

    if (key === CategoryEnum.BIOGRAPHY) {
      return { ...query, category: CategoryEnum.BIOGRAPHY };
    }

    if (key === CategoryEnum.HEALTH) {
      return { ...query, category: CategoryEnum.HEALTH };
    }
  }

  static sort(key: string) {
    if (key === ESortBooksQuery.PRICE_DESC) {
      return { price: 'desc' };
    }
    if (key === ESortBooksQuery.PRICE_ASC) {
      return { price: 'asc' };
    }
    if (key === ESortBooksQuery.QUANTITY_ASC) {
      return { quantity: 'asc' };
    }
    if (key === ESortBooksQuery.QUANTITY_DESC) {
      return { quantity: 'desc' };
    }
  }
}
