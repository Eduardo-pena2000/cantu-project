export class GetAssistanceHistoryDto {
  private constructor(
    public readonly date: string,
    public readonly store_id?: number,
    public readonly name?: string,
    public readonly area_id?: number,
    public readonly role_id?: number,
    public readonly limit: number = 50,
    public readonly page: number = 1
  ) {}

  static create(object: { [key: string]: any }): [string?, GetAssistanceHistoryDto?] {
    const { date, store_id, name, area_id, role_id, limit, page } = object;

    // Date is mandatory to not overload the system
    if (!date) return ["Falta especificar la fecha (date)"];

    return [
      undefined,
      new GetAssistanceHistoryDto(
        date,
        store_id ? +store_id : undefined,
        name,
        area_id ? +area_id : undefined,
        role_id ? +role_id : undefined,
        limit ? +limit : 50,
        page ? +page : 1
      ),
    ];
  }
}
