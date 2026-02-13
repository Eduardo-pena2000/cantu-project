import { Frown, Meh, Smile } from "lucide-react";

export function getActivityScore(score) {
  if (score === null) {
    return <Meh />;
  } else if (score < 50) {
    return <Frown className="text-destructive" />;
  } else if (score >= 50 && score <= 75) {
    return <Meh className="text-yellow-500" />;
  } else {
    return <Smile className="text-green-600" />;
  }
}

export function getAssigmentStatus(assignment) {
  if (!assignment.isComplete && !assignment.isLate) {
    return "Pendiente";
  } else if (assignment.isLate) {
    return "Tardía";
  } else {
    return "Completado";
  }
}
