import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";
import { SequelizeDatabase } from "../../../infraestructure";
import { QueryTypes } from "sequelize";

export class TvDashboardController implements Controller {
  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const { id: storeId } = httpRequest.params;
      const sequelize = SequelizeDatabase.getSequelizeInstance();

      const query = `
        SELECT 
          u.id, 
          u.names, 
          u.last_names as "last_names", 
          u.avatar_url,
          u.is_active,
          (
            SELECT COALESCE(AVG(aa.note), 0)
            FROM assistance a
            LEFT JOIN activity_assignments aa ON aa.assistance_id = a.id
            WHERE a.employee_id = u.id AND a.date_assistance::date = CURRENT_DATE
          ) as today_score,
          (
            SELECT COUNT(aa.id)
            FROM assistance a
            JOIN activity_assignments aa ON aa.assistance_id = a.id
            WHERE a.employee_id = u.id AND a.date_assistance::date = CURRENT_DATE AND aa.is_late = true
          ) as late_activities,
          (
            SELECT COUNT(a.id)
            FROM assistance a
            WHERE a.employee_id = u.id AND a.date_assistance::date = CURRENT_DATE
          ) as has_assistance_today
        FROM users u
        WHERE u.store_id = :storeId AND u.deleted_at IS NULL
        ORDER BY u.names ASC
      `;

      const employees = await sequelize.query(query, {
        replacements: { storeId },
        type: QueryTypes.SELECT
      });

      return {
        statusCode: 200,
        message: "TV Dashboard data fetched successfully",
        body: employees,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
