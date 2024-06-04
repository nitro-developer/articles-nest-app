import { ApiProperty } from '@nestjs/swagger';

export class SignInResponse {
	@ApiProperty({
		example:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJlOTc5OWYyLTI5MTgtNGE3ZS05ZWQ2LTFhMGI1ODcwN2I5YSIsImxvZ2luIjoic3VwZXJhZG1pbiIsImNyZWF0ZWRBdCI6IjIwMjQtMDYtMDNUMDk6MDM6NDUuNTIwWiIsImlhdCI6MTcxNzQwNjQ5OSwiZXhwIjoxNzE3NDA3MDk5fQ.1cyvc7jqxKPL-Q_Sqw7Cw-nTLyMJI1TL1MjYpTvf9Ek',
	})
	accessToken: string;
}
