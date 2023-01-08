import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailRequestDto } from './dto/mail-request.dto';
import { faker } from '@faker-js/faker';
import { MailResponseDto } from './dto/response/mail.response.dto';
import { HttpStatus } from '@nestjs/common';

describe('UsersController', () => {
  let controller: AppController;
  let mockMailResponse: MailResponseDto;

  const mockAppService = {
    sendMail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: mockAppService }],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  describe('sendMail', () => {
    it('should return info send mail', async () => {
      // arrange
      const mailDto: MailRequestDto = {
        mail_to: 'yuckimoera@gmail.com',
        partner_name: 'BukaLapak',
        transaction_id: faker.datatype.uuid(),
        cashback_total: 'Rp. 14.500',
      };
      const spySendMail = jest.spyOn(mockAppService, 'sendMail');
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
    it('should send mail', async () => {
      // arrange
      const mailDto: MailRequestDto = {
        mail_to: 'yuckimoera@gmail.com',
        partner_name: 'BukaLapak',
        transaction_id: faker.datatype.uuid(),
        cashback_total: 'Rp. 14.500',
      };

      const spySendMail = jest.spyOn(mockAppService, 'sendMail');

      // act
      await controller.handleSendMail(mailDto);

      // assert
      expect(spySendMail).toHaveBeenCalled();
    });
  });
});
