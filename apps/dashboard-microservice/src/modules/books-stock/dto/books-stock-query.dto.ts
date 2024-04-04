import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';
import { CategoryEnum } from '../../utils/books/enum/category.enum';
import { ESortBooksQuery } from '../../books/enum/BooksQuery.enum';

export class BooksStockQueryDto {
  @ApiProperty({
    example: 1,
  })
  @Type(() => Number)
  @Min(1)
  page: number;

  @ApiProperty({
    example: 20,
  })
  @Type(() => Number)
  @Max(100)
  @Min(1)
  perPage: number;

  @ApiProperty({
    enum: CategoryEnum,
    example: CategoryEnum.ALL,
  })
  @IsEnum(CategoryEnum)
  @IsNotEmpty()
  category: CategoryEnum;

  @ApiPropertyOptional({
    description: '',
  })
  @IsOptional()
  bookName: string;

  filter: Record<string, any>;

  sort: Record<string, any>;

  @ApiProperty({
    enum: ESortBooksQuery,
    example: ESortBooksQuery.PRICE_ASC,
  })
  @IsEnum(ESortBooksQuery)
  @IsNotEmpty()
  kSort: ESortBooksQuery;
}
