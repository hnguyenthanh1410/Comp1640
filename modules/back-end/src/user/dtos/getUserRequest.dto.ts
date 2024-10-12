import { IsDate } from "class-validator";

export class GetUserRequest {
	@IsDate()
	from: Date

	@IsDate()
	to: Date
}