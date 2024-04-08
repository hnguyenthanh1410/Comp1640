import { IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenRequest {
	@IsString()
	@IsNotEmpty()
	refresh_token: string

	@IsString()
	@IsNotEmpty()
	access_token: string
}