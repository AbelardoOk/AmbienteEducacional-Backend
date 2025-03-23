import { Body, Controller, Post } from '@nestjs/common';
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

  @Post('login')
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
                error: `Credenciais incorretas`,
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
      const novaTurma = await this.prisma.turma.create({
        data: {},
      });

      return {
        mensagem: 'Turma criada com sucesso',

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

  @Post('createMateria')
  async createMateria(@Body() body: any) {
    const { title, professorId, turmaId } = body as {
      title: string;
      professorId: number;
      turmaId: number;
    };
    try {
      const novaMateria = await this.prisma.materia.create({
        data: {
          title,
          turma: { connect: { id: turmaId } },
          professor: { connect: { id: professorId } },
        },
      });

      return {
        novaMateria,
      };
    } catch (error) {
      console.log(error);
    }
  }

  @Post('listMaterias')
  async listMaterias(@Body() body: any) {
    const { turmaId } = body as { turmaId: number };
    try {
      const turma = await this.prisma.turma.findUnique({
        where: { id: turmaId },
        include: { materias: true },
      });

      const materias = turma?.materias;
      return { materias };
    } catch (e) {
      return {
        error: `Erro inesperado: ${e}`,
      };
    }
  }
}
