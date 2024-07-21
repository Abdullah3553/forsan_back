import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

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