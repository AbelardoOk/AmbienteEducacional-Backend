import { Body, Controller, Get, Post } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';

@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @Post('register')
  async register(@Body() body: any) {
    const { type, name, password, turmaId } = body as {
      type: string;
      name: string;
      password: string;
      turmaId: number;
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
              turma: {
                connect: { id: turmaId },
              },
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
      const loginAluno = await this.prisma.aluno.findFirst({
        where: {
          name,
          password,
        },
      });
      switch (loginAluno?.id == undefined) {
        case false: {
          return {
            mensagem: `Seja bem vindo ${name}`,
            id: loginAluno?.id,
          };
          break;
        }
        case true: {
          const loginProfessor = await this.prisma.professor.findFirst({
            where: {
              name,
              password,
            },
          });

          switch (loginProfessor?.id == undefined) {
            case true: {
              return {
                mensagem: `Credenciais incorretas`,
              };
            }
            case false: {
              return {
                mensagem: `Seja bem vindo Prof(a) ${name}`,
                id: loginProfessor?.id,
              };
            }
          }
          break;
        }
      }
    } catch (error) {
      return {
        mensagem: `Erro no login: ${error}`,
      };
    }
  }

  @Post('createTurma')
  async createTurma() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const novaTurma = await this.prisma.turma.create({
        data: {},
      });

      return {
        mensagem: 'Turma criada com sucesso',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        turmaId: novaTurma.id,
      };
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error('Erro ao criar turma:', e.message);
        throw new Error(`Erro ao criar turma: ${e.message}`);
      } else {
        console.error('Erro desconhecido ao criar turma');
        throw new Error('Erro desconhecido ao criar turma');
      }
    }
  }
}
