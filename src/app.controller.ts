import { Body, Controller, Get, Post } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';

@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @Post('register')
  async register(@Body() body: any) {
    const { type, name, password, turma } = body as {
      type: string;
      name: string;
      password: string;
      turma: number;
    };

    if (password.length <= 7) {
      return {
        message: 'É preciso ter no mínimo 8 caracteres!',
      };
    } else {
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

  @Get('login')
  async login(@Body() body: any) {
    const { name, password } = body as { name: string; password: string };
    try {
      const login = await this.prisma.aluno.findFirst({
        where: {
          name,
          password,
        },
      });
      switch (login?.id == undefined) {
        case true: {
          return {
            mensagem: `Credenciais incorretas`,
          };
        }
        case false: {
          return {
            mensagem: `Seja bem vindo ${login?.id}`,
            id: login?.id,
          };
        }
      }
    } catch (error) {
      return {
        mensagem: `Erro no login: ${error}`,
      };
    }
  }
}
