import ActivityAssignment from "../models/activity-assignment.model";

class ActivitieHooks {
  static async calculateNote(data: ActivityAssignment) {
    let totalNote = 0;

    if (data.dataValues.manager_note !== null && data.dataValues.shift_manager_note !== undefined) {
      totalNote += +data.dataValues.manager_note;
    }

    if (data.dataValues.shift_manager_note !== null && data.dataValues.shift_manager_note !== undefined) {
      totalNote += +data.dataValues.shift_manager_note;
    }

    const [hoursDeadline, minutesDeadline] = data.dataValues.deadline.split(":").map(Number);
    const [hoursCompleted, minutesCompleted] = data.dataValues.date_completed!.split(":").map(Number);

    const deadlineMinutes = hoursDeadline * 60 + minutesDeadline;
    const completedMinutes = hoursCompleted * 60 + minutesCompleted;

    let note = totalNote / 2;

    if (completedMinutes > deadlineMinutes) {
      note = note * 0.5;
    }

    data.dataValues.note = note;
    data.dataValues.is_completed = true;
  }

  static register() {
    ActivityAssignment.addHook("beforeUpdate", ActivitieHooks.calculateNote);
  }
}

export default ActivitieHooks;
