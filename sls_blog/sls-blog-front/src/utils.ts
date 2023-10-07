export function formatDate(date: string): string {
	// "2021-11-30T10:31:06.267Z" 형식을 "2021. 11. 30. 오후 7:31:06"로 변환한다.
	return new Date(Date.parse(date)).toLocaleString('ko');
}
