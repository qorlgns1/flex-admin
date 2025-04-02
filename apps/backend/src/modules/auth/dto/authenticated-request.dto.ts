import { Request } from 'express';
import { User } from '../../users/entities/user.entity';

export interface AuthenticatedRequestDto extends Request {
  user: User;
}
