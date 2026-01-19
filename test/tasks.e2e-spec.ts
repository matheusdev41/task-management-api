/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';

describe('Tasks (e2e)', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  it('POST /talks', async () => {
    console.log('TEST POST TASKS INICIO');
    const task = {
      title: 'Estudar NestJS',
      description: 'Criar CRUD de tasks',
      status: 'OPEN',
      expirationDate: new Date('2026-01-30'),
    };

    return request(app.getHttpServer())
      .post('/tasks')
      .send(task)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');

        expect(res.body.title).toBe(task.title);
        console.log(res.body);
      });
  });

  it('GET /talks', async () => {
    const res = await request(app.getHttpServer()).get('/tasks').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /talks/:id deve retornar uma task', async () => {
    // Cria a task
    const createResponse = await request(app.getHttpServer())
      .post('/tasks')
      .send({
        title: 'Buscar ID',
        description: 'teste findById',
        status: 'OPEN',
      })
      .expect(201);

    const taskId = createResponse.body.id;

    // Busca pelo ID
    const res = await request(app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .expect(200);

    expect(res.body).toHaveProperty('id', taskId);
    expect(res.body.title).toBe('Buscar ID');
  });

  it('GET /tasks/:id inexistente deve retornar 404', async () => {
    await request(app.getHttpServer()).get('/tasks/id-invalido').expect(404);
  });

  it('POST /talks sem title deve falhar', async () => {
    await request(app.getHttpServer()).post('/tasks').send({}).expect(400);
  });

  afterAll(async () => {
    await app.close();
  });
});
