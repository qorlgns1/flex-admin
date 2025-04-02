import { User } from '../entities/user.entity';

export interface AuthenticatedRequest {
  user: User;
}
