import { Request } from 'express';

export class UserDetailDto {
  private readonly id: string;
  private readonly name: string;
  private readonly birthDate: Date;
  private readonly gender: string;
  private readonly phone: string;
  private readonly address: string;

  get getId(): string {
    return this.id;
  }
  get getName(): string {
    return this.name;
  }
  get getBirthDate(): Date {
    return this.birthDate;
  }
  get getGender(): string {
    return this.gender;
  }
  get getPhone(): string {
    return this.phone;
  }
  get getAddress(): string {
    return this.address;
  }

  constructor(req: Request) {
    this.id = (req.user as any).id;
    const { name, birthDate, gender, phone, address } = req.body;
    this.name = name;
    this.birthDate = birthDate;
    this.gender = gender;
    this.phone = phone;
    this.address = address;
  }
}
