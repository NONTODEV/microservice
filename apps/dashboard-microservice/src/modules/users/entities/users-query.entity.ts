import { ApiProperty } from '@nestjs/swagger';
import { userEntyty } from './user.entity';

export class UsersQueryEntity {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  page: number;

  @ApiProperty({
    type: Number,
    example: 20,
  })
  perPage: number;

  @ApiProperty({
    type: Number,
    example: 100,
  })
  count: number;

  @ApiProperty({
    type: [userEntyty],
  })
  records: userEntyty[];
}
