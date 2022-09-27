/* eslint-disable prettier/prettier */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto/editUserDto';
import { CreateBookmarkDto } from 'src/bookmark/dto';
// import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';

describe('App Testing', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll( async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
    }));

    await app.init();
    await app.listen(4000);
    
    prisma = app.get(PrismaService);
    await prisma.cleanUpDb();
    pactum.request.setBaseUrl('http://localhost:4000');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    //request body
    const dto: AuthDto = {
      email: 'georgeokafo3@gmail.com',
      password: 'Test12345%%'
    }
    describe('signup', () => {
      it('should throw exception if signing up with only email', () => {
        return pactum
        .spec()
        .post('/auth/signup')
        .withBody(dto.password)
        .expectStatus(400);
      });

      it('should throw exception if signing up with only password', () => {
        return pactum
        .spec()
        .post('/auth/signup')
        .withBody(dto.email)
        .expectStatus(400);
      });

      it('should throw exception if no body', () => {
        return pactum
        .spec()
        .post('/auth/signup')
        .expectStatus(400);
      });

      it('should signup', () => {
        return pactum
        .spec()
        .post('/auth/signup')
        .withBody(dto)
        .expectStatus(201)
      });

    });


    describe('signin', () => {
      it('should throw exception if signing in with only email', () => {
        return pactum
        .spec()
        .post('/auth/signin')
        .withBody(dto.password)
        .expectStatus(400);
      });

      it('should throw exception if signing in with only password', () => {
        return pactum
        .spec()
        .post('/auth/signin')
        .withBody(dto.email)
        .expectStatus(400);
      });

      it('should throw exception if signing in without body', () => {
        return pactum
        .spec()
        .post('/auth/signin')
        .expectStatus(400);
      });

      it('should signin', () => {
        return pactum
        .spec()
        .post('/auth/signin')
        .withBody(dto)
        .expectStatus(201)
        .stores('userAT', 'accessToken');
      });

    });

  });

  describe('User', () => {
    describe('get user', () => {
      it('should get current user logged in', () => {
        return pactum
        .spec()
        .get('/user/me')
        .withHeaders({
          Authorization: 'Bearer $S{userAT}'
        })
        .expectStatus(200);
      });
    });

    describe('edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          firstName: 'george',
          email: "george@gmail.com",
        }
        return pactum
        .spec()
        .patch('/user')
        .withHeaders({
          Authorization: 'Bearer $S{userAT}'
        })
        .withBody(dto)
        .expectStatus(200)
      })
      
    });


  });

  describe('Bookmarks', () => {
    describe('get empty bookmarks', () => {
      it('should get empty bookmarks', () => {
        return pactum.
        spec()
        .get('/bookmarks')
        .expectBody([])
        .withHeaders({
          Authorization: 'Bearer $S{userAT}'
        })
        .stores('userAT', 'accessToken');
      });
    });

    describe('create bookmarks', () => {
      const dto: CreateBookmarkDto = {
        title: "velli's delight",
        link: "www.velliblog.co.org",
        description: "what a wnoderful day to be alive"
      };
      it('create bookmarks', () => {
        return pactum.
        spec()
        .post('/bookmarks')
        .withBody(dto)
        .withHeaders({
          Authorization: 'Bearer $S{userAT}'
        })
        .stores('userAT', 'accessToken');
      });
    });


  });

});