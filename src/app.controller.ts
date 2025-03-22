import { Body, Controller, Post } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';

@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @Post('register')
  async postRegister(@Body() body: any) {
    const { type, name, password, turma } = body;

    switch (type) {
      case 'aluno': {
        const aluno = await this.prisma.aluno.create({
          data: {
            name,
            password,
            turma,
          },
        });
        return {
          aluno,
        };
      }

      case 'professor': {
        const professor = await this.prisma.professor.create({
          data: {
            name,
            password,
          },
        });
        return {
          professor,
        };
      }

      default: {
        return {
          error: 'Tipo de cadastro',
        };
      }
    }
  }
}
