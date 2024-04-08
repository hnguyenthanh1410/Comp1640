import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { RoleName } from 'src/role/entity/role.entity';

export class UpdateRoleRequest {
	roleName: RoleName;
}

export class UpdateUserRequest {
	@IsOptional()
	@IsString()
	firstName: string;

	@IsOptional()
	@IsString()
	lastName: string;

	@IsOptional()
	@IsPhoneNumber()
	phone: string;

	@IsOptional()
	@IsString()
	address: string;

	@IsOptional()
	@IsString()
	avatar: string;
	
	@IsString()
	@IsOptional()
	refreshToken?: string;
}
