import { Injectable } from '@nestjs/common';

@Injectable()
export class UserContextService {
    private username: string;
  
    setUsername(username: string) {
      this.username = username;
    }
  
    getUsername(): string {
      return this.username;
    }
  }