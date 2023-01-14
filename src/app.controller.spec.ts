import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailRequestDto } from './dto/mail-request.dto';
import { faker } from '@faker-js/faker';
import { MailResponseDto } from './dto/response/mail.response.dto';
import { HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { IMailData } from './core/mail-data.interface';

describe('UsersController', () => {
  let controller: AppController;
  let mockMailResponse: MailResponseDto;

  const appService = {
    sendMail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: appService }],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  afterEach(() => jest.clearAllMocks());

  describe('sendMail', () => {
    let mailDto: MailRequestDto;
    beforeEach(async () => {
      mailDto = {
        mail_to: 'yuckimoera@gmail.com',
        partner_name: 'BukaLapak',
        transaction_id: faker.datatype.uuid(),
        cashback_total: 'Rp. 14.500',
      };
    });

    it('should return info send mail', async () => {
      // arrange
      const spySendMail = jest.spyOn(appService, 'sendMail');
      mockMailResponse = new MailResponseDto(
        HttpStatus.OK,
        `Send mail successfully`,
        mailDto,
      );
      // act
      const response = await controller.sendMail(mailDto);
      // assert
      expect(response).toEqual(mockMailResponse);
      expect(spySendMail).toHaveBeenCalled();
    });
  });

  describe('handleSendMail', () => {
    let mailData: IMailData;
    beforeEach(async () => {
      mailData = {
        mail_to: 'yuckimoera@gmail.com',
        partner_name: 'BukaLapak',
        transaction_id: faker.datatype.uuid(),
        cashback_total: 'Rp. 14.500',
      };
    });
    it('should send mail', async () => {
      // arrange
      const spySendMail = jest.spyOn(appService, 'sendMail');

      // act
      await controller.handleSendMail(mailData);

      // assert
      expect(spySendMail).toHaveBeenCalled();
    });
  });
});
