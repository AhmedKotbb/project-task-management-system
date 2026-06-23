export interface CreateUserDto {
  fullName: string;
  email: string;
  phoneNumber: string;
  role: 'admin' | 'member';
}