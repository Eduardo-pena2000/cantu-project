import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityActions } from "./activity-actions";

export function ActivityCard({ activity }) {
  return (
    <Card className="relative shadow-none border-none px-0">
      <CardHeader className="px-0">
        <CardTitle>{activity.name}</CardTitle>
        <CardDescription>{activity.description}</CardDescription>
        <ActivityActions activityId={activity.id} className="absolute top-2 -right-3" />
      </CardHeader>

      <CardContent className="px-0">
        <div className="leading-none">
          <span className="text-muted-foreground text-sm font-semibold">Área</span>
          <p>
            <span className="text-sm uppercase">{activity.area.code}</span> - {activity.area.name}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
