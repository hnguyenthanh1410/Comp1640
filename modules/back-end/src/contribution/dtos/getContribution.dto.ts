import { IsDate } from "class-validator";

export class GetContributionRequest {
	@IsDate()
	from: Date;

	@IsDate()
	to: Date;
};