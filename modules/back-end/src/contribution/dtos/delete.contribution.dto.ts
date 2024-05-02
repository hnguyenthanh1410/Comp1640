import { IsNotEmpty, IsString } from "class-validator";

export class deleteContributionRequest {
	@IsString()
	@IsNotEmpty()
	id: string;
}