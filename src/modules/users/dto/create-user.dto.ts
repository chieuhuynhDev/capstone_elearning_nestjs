export class CreateUserDto {
  username: string;
  fullName?: string;
  password: string;
  phoneNumber: number;
  email: string;
  userTypeId: number;
}
